import { TRPCError } from "@trpc/server";
import { createTRPCRouter, ultraProtectedProcedure } from "../trpc";
import { z } from "zod";
import { env } from "~/env";
import Tracker from "~/lib/tracking-more";
import { type ShipmentStatus, type Prisma } from "@prisma/client";

const adminShipmentRouter = createTRPCRouter({
  getOrders: ultraProtectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        shipmentType: z
          .enum([
            "ALL",
            "INFORECEIVED",
            "TRANSIT",
            "PENDING",
            "DELIVERED",
            "PICKUP",
            "UNDELIVERED",
            "EXCEPTION",
          ])
          .default("INFORECEIVED"),
        days: z.number().default(7),
        searchQuery: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, shipmentType, days, searchQuery } = input;
      const skip = (page - 1) * limit;

      const dateFilter = new Date(
        new Date().getTime() - days * 24 * 60 * 60 * 1000,
      );

      const baseWhere: Prisma.OrderWhereInput = {
        orderDate: {
          gte: dateFilter,
        },
        status: "READY_TO_SHIP",
        shipment: {
          ...(shipmentType !== "ALL" ? { status: shipmentType } : {}),
          ...(searchQuery
            ? {
                awbNumber: {
                  contains: searchQuery,
                  mode: "insensitive",
                },
              }
            : {}),
        },
      };

      // Get total count for pagination
      const total = await ctx.db.order.count({
        where: baseWhere,
      });

      // Get paginated results
      const orders = await ctx.db.order.findMany({
        where: baseWhere,
        take: limit,
        skip,
        orderBy: { orderDate: "desc" },
        select: {
          orderAdressDetails: {
            select: {
              city: true,
              state: true,
              famousLandmark: true,
              houseNumber: true,
              streetName: true,
              pincode: true,
            },
          },
          orderCustomerDetails: {
            select: {
              customerMobile: true,
              customerName: true,
            },
          },
          orderDate: true,
          shipment: {
            select: {
              subStatus: true,
              latestEvent: true,
              awbNumber: true,
              status: true,
            },
          },
          packageDetails: {
            select: {
              length: true,
              breadth: true,
              height: true,
              physicalWeight: true,
            },
          },
          id: true,
          userAwbDetails: {
            select: {
              awbNumber: true,
            },
          },
        },
      });

      return {
        items: orders.map((order) => ({
          ...order,
          userAwbDetails: {
            awbNumber: order.userAwbDetails?.awbNumber
              ? order.userAwbDetails?.awbNumber + +env.USER_AWB_OFFSET
              : 0,
          },
        })),
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    }),
  trackShipment: ultraProtectedProcedure
    .input(z.object({ awbNumber: z.string() }))
    .query(async ({ input }) => {
      const { awbNumber } = input;
      try {
        const tracker = new Tracker(env.TRACKINGMORE_API_KEY);
        const trackingData =
          await tracker.trackings.getTrackingByAWB(awbNumber);

        if (trackingData.meta.code === 200) {
          return trackingData.data;
        } else {
          throw new Error(trackingData.meta.message);
        }
      } catch (error) {
        throw error;
      }
    }),
  editAwb: ultraProtectedProcedure
    .input(
      z.object({
        orderId: z.string(),
        newAwb: z.string(),
        courierProvider: z.enum([
          "delhivery",
          "ecom-express",
          "shadowfax",
          "xpressbees",
          "valmo",
        ]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // delete this existing awb from the trackingmore account
      const tracker = new Tracker(env.TRACKINGMORE_API_KEY);

      const order = await ctx.db.order.findUnique({
        where: {
          id: input.orderId,
        },
        select: {
          orderId: true,
          shipment: {
            select: {
              trackingId: true,
            },
          },
          user: {
            select: {
              name: true,
              kycDetails: {
                select: {
                  companyInfo: {
                    select: {
                      companyName: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!order?.shipment?.trackingId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Tracking Id not configured successfully",
        });
      }

      try {
        const hasDeleted = await tracker.trackings.deleteTracking(
          order?.shipment?.trackingId,
        );

        if (!hasDeleted) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete the tracking",
          });
        }

        // create new tracking

        const response = await tracker.trackings.createTracking({
          courier_code: input.courierProvider,
          tracking_number: input.newAwb,
          customer_name: `${order?.user.name} - ${order?.user?.kycDetails?.companyInfo?.companyName}`,
          order_number: order.orderId.toString(),
        });

        if (!response) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error in creating shipment",
          });
        }

        // update the shipment details in the database

        await ctx.db.order.update({
          where: {
            id: input.orderId,
          },
          data: {
            shipment: {
              update: {
                awbNumber: response.data.tracking_number,
                courierProvider: response.data.courier_code,
                trackingId: response.data.id,
                latestEvent: response.data.latest_event,
                status:
                  response.data.delivery_status.toUpperCase() as unknown as keyof typeof ShipmentStatus,
                subStatus: response.data.substatus,
              },
            },
          },
        });
      } catch (error) {
        throw error;
      }
    }),

  getShipmentCount: ultraProtectedProcedure.query(async ({ ctx }) => {
    const shipmentCounts = await ctx.db.shipment.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
      where: {
        status: {
          in: [
            "INFORECEIVED",
            "PENDING",
            "TRANSIT",
            "DELIVERED",
            "UNDELIVERED",
            "EXCEPTION",
            "PICKUP",
          ],
        },
        createdAt: {
          gte: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000),
        },
      },
    });

    const allCount = shipmentCounts.reduce((acc: number, count) => {
      return acc + count._count.status;
    }, 0);

    const counts = {
      allCount: allCount,
      infoReceivedCount: 0,
      pickupPendingCount: 0,
      inTransitCount: 0,
      deliveredCount: 0,
      undeliveredCount: 0,
      exceptionCount: 0,
      pickupScheduledCount: 0,
    };

    shipmentCounts.forEach((count) => {
      switch (count.status) {
        case "INFORECEIVED":
          counts.infoReceivedCount = count._count.status;
          break;
        case "PENDING":
          counts.pickupPendingCount = count._count.status;
          break;
        case "TRANSIT":
          counts.inTransitCount = count._count.status;
          break;
        case "DELIVERED":
          counts.deliveredCount = count._count.status;
          break;
        case "UNDELIVERED":
          counts.undeliveredCount = count._count.status;
          break;
        case "EXCEPTION":
          counts.exceptionCount = count._count.status;
          break;
        case "PICKUP":
          counts.pickupScheduledCount = count._count.status;
          break;
      }
    });

    return counts;
  }),
});

export default adminShipmentRouter;
