import Tracker from "~/lib/tracking-more";
import { createTRPCRouter, ultraProtectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { type ShipmentStatus } from "@prisma/client";
import { type TrackingItem } from "~/lib/tracking-more/modules/types";
import { env } from "~/env";
import { type Prisma } from "@prisma/client";
const adminOrderRouter = createTRPCRouter({
  approveOrder: ultraProtectedProcedure
    .input(
      z.object({
        awbNumber: z.string(),
        courierProvider: z.enum([
          "delhivery",
          "ecom-express",
          "xpressbees",
          "shadowfax",
          "valmo",
        ]),
        dbOrderId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.db.order.findUnique({
        where: {
          id: input.dbOrderId,
        },
        select: {
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

      const tracker = new Tracker(env.TRACKINGMORE_API_KEY);

      try {
        const response = await tracker.trackings.createTracking({
          courier_code: input.courierProvider,
          tracking_number: input.awbNumber,
          customer_name: `${order?.user.name} - ${order?.user?.kycDetails?.companyInfo?.companyName}`,
        });

        if (!response) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error in approving orders",
          });
        }

        if (response.meta.code !== 200) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: response.meta.message,
          });
        }
        // TODO: Remove this console.log after testing
        console.log("TRACKINGMORE RESPONSE CREATED", response.data);

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
                trackingId: (response.data as Partial<TrackingItem>).id ?? "",
                status: response.data.delivery_status
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
                  companyInfo: true
                },
              }
              // mobile:true
            },
            // include: {

            // }
          }
          // orderPaymentDetails: true,
        },
        orderBy: {
          orderDate: "desc",
        },
      });

      const totalOrderCount = await ctx.db.order.count({
        where: {
          // userId: ctx.session.user.id,
        },
      });

      return {
        orders: orders.map((order) => ({
          ...order,
          userAwbDetails: {
            ...order.userAwbDetails,
            awbNumber: order.userAwbDetails?.awbNumber
              ? order.userAwbDetails?.awbNumber + +env.USER_AWB_OFFSET
              : undefined,
          },
        })),
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
