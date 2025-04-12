import { TRPCError } from "@trpc/server";
import { createTRPCRouter, ultraProtectedProcedure } from "../trpc";
import { z } from "zod";
import { env } from "~/env";
import { Tracker, ShipWayTracker } from "~/lib/tracking-more";
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
            "DELIVERED",
            "IN TRANSIST",
            "RTO",
            "RTO DELIVERED",
            "CANCELLED",
            "SHIPMENT BOOKED",
            "PICKED UP",
            "OUT OF DELIVERY",
            "NO INFORMATION YET",
            "OUT OF DELIVERY AREA",
            "DELIVERY DELAYED",
            "UNDELIVERED ATTEMPT",
          ])
          .default("NO INFORMATION YET"),
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
      const statusConverted = {
        "ALL": [""],
        "DELIVERED": ["DEL"],
        "IN TRANSIST": ["INT"],
        "RTO": ["RTO"],
        "RTO DELIVERED": ["RTD"],
        "CANCELLED": ["CAN"],
        "SHIPMENT BOOKED": ["SCH"],
        "PICKED UP": ["PKP"],
        "OUT OF DELIVERY": ["OOD"],
        "NO INFORMATION YET": ["NFI"],
        "OUT OF DELIVERY AREA": ["ODA"],
        "DELIVERY DELAYED": ["SMD"],
        "UNDELIVERED ATTEMPT": ["23", "24", "25", "CRTA", "DEX", "DRE"],
      }[shipmentType]
      const baseWhere: Prisma.OrderWhereInput = {
        orderDate: {
          gte: dateFilter,
        },
        status: "READY_TO_SHIP",
        // shipment: {
        //   ...(shipmentType !== "ALL" ? { status: shipmentType } : {}),
        //   ...(searchQuery
        //     ? {
        //       awbNumber: {
        //         contains: searchQuery,
        //         mode: "insensitive",
        //       },
        //     }
        //     : {}),
        // },
      };
      const newBaseWhere: Prisma.TrackingWhereInput = {
        orderId: {
          contains: searchQuery,
          mode: "insensitive",
        },
        currentStatus: shipmentType !== "ALL" ? { in: statusConverted } : undefined
      };

      // Get total count for pagination
      const total = await ctx.db.order.count({
        where: baseWhere,
      });

      const tracking_total = await ctx.db.tracking.count();

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

      const tracking_count = await ctx.db.tracking.count()
      console.log("tracking_count", tracking_count);

      const tracking_orders = await ctx.db.tracking.findMany({
        where: newBaseWhere,
        // take: limit,
        // skip,
        orderBy: { id: "desc" },
        select: {
          id: true,
          awbNumber: true,
          orderId: true,
          lastName: true,
          carrier: true,
          currentStatusDesc: true,
          extraFields: true,
          scans: true,
          currentStatus: true,
        },
      });
      const menupulated_orders = orders.map((order) => {
        console.log(order.userAwbDetails?.awbNumber ? order.userAwbDetails?.awbNumber : "Hello");

        return ({
          ...order,
          userAwbDetails: {
            awbNumber: order.userAwbDetails?.awbNumber
              ? order.userAwbDetails?.awbNumber + +env.USER_AWB_OFFSET
              : 0,
          },
        })
      })
      const mergedData = menupulated_orders.map(order => {
        console.log(String(order.userAwbDetails?.awbNumber));
        const tracking = tracking_orders.find(track => String(track.orderId) === String(order.userAwbDetails?.awbNumber));
        if (tracking) {
          return { ...order, ...tracking }
        }
        else {
          return
        }
      });

      return {
        items_old: menupulated_orders,
        items: mergedData,
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
  trackShipwayShipment: ultraProtectedProcedure
    .input(z.object({ order_id: z.string() }))
    .query(async ({ input }) => {
      const { order_id } = input;
      try {
        const tracker = new ShipWayTracker(env.SHIPWAY_USERNAME, env.SHIPWAY_PASSWORD);
        const trackingData =
          await tracker.trackings.getTrackingDetailsByOrderID(order_id);

        if (trackingData?.status === "Success") {
          return trackingData?.response;
        } else {
          throw new Error(trackingData?.message);
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
  getNewShipmentCount: ultraProtectedProcedure.query(async ({ ctx }) => {

    const shipmentCounts = await ctx.db.tracking.groupBy({
      by: ["currentStatus"],
      _count: {
        currentStatus: true,
      },
      where: {
        currentStatus: {
          in: [
            "",
            "PCAN",
            "INT",
            "DEL",
            "RTO",
            "RTD",
            "CAN",
            "SCH",
            "PKP",
            "OOD",
            "NFI",
            "ODA",
            "ODA",
            "SMD",
            "CRTA",
            "DEX",
            "DRE",
            "23",
            "24",
            "25",
          ],
        },
        createdAt: {
          gte: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000),
        },
      },
    });

    const allCount = shipmentCounts.reduce((acc: number, count) => {
      return acc + count._count.currentStatus;
    }, 0);

    console.log(347, shipmentCounts)

    const counts = {
      allCount: allCount,
      noInformationYet: 0,
      inTransist: 0,
      delivered: 0,
      rto: 0,
      rtoDelivered: 0,
      calcelled: 0,
      shipmentBooked: 0,
      pickedUp: 0,
      outOfDelivery: 0,
      outOfDeliveryArea: 0,
      deliveryDelayed: 0,
      undeliveredAttempt: 0,
    };

    shipmentCounts.forEach((count) => {
      switch (count.currentStatus) {
        case "NFI":
          counts.noInformationYet = count._count.currentStatus;
          break;
        case "INT":
          counts.inTransist = count._count.currentStatus;
          break;
        case "DEL":
          counts.delivered = count._count.currentStatus;
          break;
        case "RTO":
          counts.rto = count._count.currentStatus;
          break;
        case "RTD":
          counts.rtoDelivered = count._count.currentStatus;
          break;
        case "CAN":
          counts.calcelled += count._count.currentStatus;
          break;
        case "PCAN":
          counts.calcelled += count._count.currentStatus;
          break;
        case "SCH":
          counts.shipmentBooked = count._count.currentStatus;
          break;
        case "PKP":
          counts.pickedUp = count._count.currentStatus;
          break;
        case "OOD":
          counts.outOfDelivery = count._count.currentStatus;
          break;
        case "ODA":
          counts.outOfDeliveryArea = count._count.currentStatus;
          break;
        case "SMD":
          counts.deliveryDelayed = count._count.currentStatus;
          break;
        case "23":
          counts.undeliveredAttempt += count._count.currentStatus ? count._count.currentStatus : 0;
          break;
        case "24":
          counts.undeliveredAttempt += count._count.currentStatus ? count._count.currentStatus : 0;
          break;
        case "25":
          counts.undeliveredAttempt += count._count.currentStatus ? count._count.currentStatus : 0;
          break;
        case "CRTA":
          counts.undeliveredAttempt += count._count.currentStatus ? count._count.currentStatus : 0;
          break;
        case "DEX":
          counts.undeliveredAttempt += count._count.currentStatus ? count._count.currentStatus : 0;
          break;
        case "DRE":
          counts.undeliveredAttempt += count._count.currentStatus ? count._count.currentStatus : 0;
          break;
      }
    });
    console.log(471, counts)
    return counts;
  }),
});

export default adminShipmentRouter;
