import { ShipWayTracker } from "~/lib/tracking-more";
// import { ShipWayTracking } from "~/lib/tracking-more";
import { createTRPCRouter, ultraProtectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { type ShipmentStatus } from "@prisma/client";
import { env } from "~/env";
import { type Prisma } from "@prisma/client";

const adminOrderRouter = createTRPCRouter({
  approveOrder: ultraProtectedProcedure
    .input(
      z.object({
        awbNumber: z.string(),
        courierProvider: z.string(),
        dbOrderId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.db.order.findUnique({
        where: {
          id: input.dbOrderId,
        },
        select: {
          orderId: true,
          productName: true,
          userAwbDetails: {
            select: {
              awbNumber: true,
            },
          },
          orderCustomerDetails: {
            select: {
              customerMobile: true,
              customerName: true,
            },
          },
          user: {
            select: {
              name: true,
              email: true,
              mobile: true,

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

      if (input.courierProvider === "valmo") {
        try {
          await ctx.db.order.update({
            where: {
              id: input.dbOrderId,
            },
            data: {
              status: "READY_TO_SHIP",
              shipment: {
                create: {
                  awbNumber: input.awbNumber,
                  courierProvider: input.courierProvider,
                  trackingId: "",
                  status: "pending"
                    .toString()
                    .toUpperCase() as keyof typeof ShipmentStatus,
                },
              },
            },
          });
          return;
        } catch (error) {
          throw error;
        }
      }

      const shipWayTracker = new ShipWayTracker(
        env.SHIPWAY_USERNAME,
        env.SHIPWAY_PASSWORD,
      );
      const computedOrderId = "100000";
      if (
        order?.userAwbDetails?.awbNumber == null ||
        isNaN(+env.USER_AWB_OFFSET)
      ) {
        const computedOrderId = String(env.USER_AWB_OFFSET);
      } else {
        const computedOrderId = String(
          order.userAwbDetails.awbNumber + Number(env.USER_AWB_OFFSET),
        );
      }

      try {
        const response = await shipWayTracker.trackings.createTracking({
          carrier_id: input.courierProvider,
          awb: input.awbNumber,
          order_id: computedOrderId,
          first_name: order?.user.name,
          last_name: order?.orderCustomerDetails?.customerName,
          email: order?.user.email,
          phone: order?.orderCustomerDetails?.customerMobile,
          products: order?.productName,
          shipment_type: "1",
          company: order?.user?.kycDetails?.companyInfo?.companyName,
        });

        if (!response) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error in approving orders",
          });
        }

        if (
          response.status !== "Success" &&
          response.message !== "Order is already pushed"
        ) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: response.message,
          });
        }

        await ctx.db?.tracking.create({
          data: {
            awbNumber: input.awbNumber,
            orderId: computedOrderId,
          },
        });

        await ctx.db.order.update({
          where: {
            id: input.dbOrderId,
          },
          data: {
            status: "READY_TO_SHIP",
            shipment: {
              create: {
                awbNumber: input.awbNumber,
                courierProvider: input.courierProvider,
                trackingId: String(order?.orderId),
                status: "PENDING"
                  .toString()
                  .toUpperCase() as keyof typeof ShipmentStatus,
              },
            },
          },
        });
      } catch (error) {
        console.log(error);
        throw error;
      }
    }),
  getAllOrdersAdmin: ultraProtectedProcedure
    .input(
      z.object({
        cursor: z.number().optional(),
        limit: z.number().min(10).max(100).default(10),
        awbNumber: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where: Prisma.OrderWhereInput = {
        // userId: ctx.session.user.id,
        ...(input.awbNumber && {
          userAwbDetails: {
            awbNumber: parseInt(input.awbNumber, 10),
          },
        }),
        ...(input.startDate && {
          orderDate: {
            gte: input.startDate,
          },
        }),
        ...(input.endDate && {
          orderDate: {
            ...(input.startDate ? { gte: input.startDate } : {}),
            lte: input.endDate,
          },
        }),
      };
      const newBaseWhere: Prisma.TrackingWhereInput = {
        orderId: {
          contains: input.awbNumber,
          mode: "insensitive",
        },
      };

      const tracking_orders = await ctx.db.tracking.findMany({
        where: newBaseWhere,
        // skip: (input.cursor ?? 0) * input.limit,
        // take: input.limit,
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

      const orders = await ctx.db.order.findMany({
        where,
        skip: (input.cursor ?? 0) * input.limit,
        take: input.limit,
        include: {
          shipment: true,
          userAwbDetails: true,
          orderCustomerDetails: true,
          user: {
            select: {
              name: true,
              kycDetails: {
                select: {
                  id: true,
                  userId: true,
                  // mobile:true
                  // CompanyInfo:true
                  companyInfo: true,
                },
              },
              // mobile:true
            },
            // include: {

            // }
          },
          // orderPaymentDetails: true,
        },
        orderBy: {
          orderDate: "desc",
        },
      });
      const trackingCount = await ctx.db.tracking.count();
      console.log("trackingCount", trackingCount);

      const totalOrderCount = await ctx.db.order.count({
        where: {
          // userId: ctx.session.user.id,
        },
      });
      const menupulated_orders = orders.map((order, i) => {
        console.log(i, order);
        return {
          ...order,
          userAwbDetails: {
            ...order.userAwbDetails,
            awbNumber: order.userAwbDetails?.awbNumber
              ? order.userAwbDetails?.awbNumber + +env.USER_AWB_OFFSET
              : undefined,
          },
        };
      });
      // console.log("tracking_orders", tracking_orders);

      const mergedData = menupulated_orders.map((order) => {
        console.log(String(order.userAwbDetails?.awbNumber));
        const tracking = tracking_orders.find(
          (track) =>
            String(track.orderId) === String(order.userAwbDetails?.awbNumber),
        );
        if (tracking) {
          console.log({ ...order, ...tracking });
          return { ...order, ...tracking };
        } else {
          return;
        }
      });
      return {
        orders: mergedData,
        totalOrderCount,
      };
    }),
  getSingleOrderDetails: ultraProtectedProcedure
    .input(z.object({ orderId: z.number() }))
    .query(async ({ ctx, input }) => {
      const order = await ctx.db.order.findFirstOrThrow({
        where: {
          orderId: input.orderId,
          // userId: ctx.session.user.id,
        },
        include: {
          orderAdressDetails: true,
          orderCustomerDetails: true,
          orderPaymentDetails: true,
          orderPricing: true,
          packageDetails: true,
          pickupLocation: true,
          shipment: true,
          userAwbDetails: true,
        },
      });

      return order;
    }),
});

export default adminOrderRouter;
