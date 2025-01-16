import { type Prisma } from "@prisma/client";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { env } from "~/env";
import { TRPCError } from "@trpc/server";
import { truncate } from "node:fs";

const userOrderRouter = createTRPCRouter({
  getOrders: protectedProcedure
    .input(
      z.object({
        cursor: z.number().optional(),
        limit: z.number().min(1).max(100).default(10),
        shipmentType: z
          .enum([
            "BOOKED",
            "INFORECEIVED",
            "TRANSIT",
            "PENDING",
            "DELIVERED",
            "PICKUP",
            "UNDELIVERED",
            "EXCEPTION",
            "CANCELLED",
          ])
          .default("BOOKED"),
        days: z.number().default(7),
        searchQuery: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (input.searchQuery) {
        const order = await ctx.db.order.findFirst({
          where: {
            userId: ctx.session.user.id,
            userAwbDetails: {
              awbNumber: input.searchQuery - +env.USER_AWB_OFFSET,
            },
          },
          select: {
            orderValue: true,
            orderAdressDetails: {
              select: {
                city: true,
                famousLandmark: true,
                state: true,
                houseNumber: true,
                streetName: true,
                pincode: true,
              },
            },
            orderDate: true,
            userAwbDetails: {
              select: {
                awbNumber: true,
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
            orderPricing: {
              select: {
                price: true,
              },
            },
            shipment: {
              select: {
                subStatus: true,
                latestEvent: true,
              },
            },
            orderCustomerDetails: {
              select: {
                customerName: true,
                customerMobile: true,
              },
            },
            id: true,
          },
        });

        if (order?.userAwbDetails?.awbNumber !== undefined) {
          order.userAwbDetails.awbNumber += +env.USER_AWB_OFFSET;
        }

        const orders = [];
        if (order) {
          orders.push(order);
        }

        return {
          items: orders,
          nextCursor: undefined,
        };
      }

      const { cursor, limit, shipmentType, days } = input;
      const dateFilter = new Date(
        new Date().getTime() - days * 24 * 60 * 60 * 1000,
      );

      const baseWhere = {
        userId: ctx.session.user.id,
        orderDate: { gte: dateFilter },
      };

      const where: Prisma.OrderWhereInput =
        shipmentType === "BOOKED" || shipmentType === "CANCELLED"
          ? { ...baseWhere, status: shipmentType }
          : { ...baseWhere, shipment: { status: shipmentType } };

      const orders = await ctx.db.order.findMany({
        where,
        take: limit + 1,
        skip: cursor,
        orderBy: { orderDate: "desc" },
        select: {
          id: true,
          orderValue: true,
          orderAdressDetails: {
            select: {
              city: true,
              famousLandmark: true,
              state: true,
              houseNumber: true,
              streetName: true,
              pincode: true,
            },
          },
          orderDate: true,
          userAwbDetails: {
            select: {
              awbNumber: true,
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
          orderPricing: {
            select: {
              price: true,
            },
          },
          shipment: {
            select: {
              subStatus: true,
              latestEvent: true,
            },
          },
          orderCustomerDetails: {
            select: {
              customerName: true,
              customerMobile: true,
            },
          },
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (orders.length > limit) {
        // Don't know what is the use of this
        const nextItem = orders.pop();
        nextCursor = orders.length;
      }

      return {
        items: orders.map((order) => ({
          ...order,
          userAwbDetails: {
            awbNumber:
              (order.userAwbDetails?.awbNumber ?? 0) + +env.USER_AWB_OFFSET,
          },
        })),
        nextCursor,
      };
    }),

  getShipmentCount: protectedProcedure.query(async ({ ctx }) => {
    const { id } = ctx.session.user;

    const totalShipments = await ctx.db.shipment.groupBy({
      by: ["status"],
      where: {
        order: {
          userId: id,
        },
        createdAt: {
          gte: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000),
        },
      },
      having: {
        status: {
          in: [
            "DELIVERED",
            "PENDING",
            "EXCEPTION",
            "TRANSIT",
            "UNDELIVERED",
            "EXPIRED",
            "NOTFOUND",
            "INFORECEIVED",
            "PICKUP",
          ],
        },
      },
      _count: {
        status: true,
      },
    });

    const shipmentCount = {
      infoReceivedCount: 0,
      pickupPendingCount: 0,
      inTransitCount: 0,
      deliveredCount: 0,
      undeliverdCount: 0,
      exceptionCount: 0,
      pickupScheduledCount: 0,
    };

    totalShipments.forEach((count) => {
      switch (count.status) {
        case "INFORECEIVED":
          shipmentCount.infoReceivedCount = count._count.status;
          break;
        case "PENDING":
          shipmentCount.pickupPendingCount = count._count.status;
          break;
        case "TRANSIT":
          shipmentCount.inTransitCount = count._count.status;
          break;
        case "DELIVERED":
          shipmentCount.deliveredCount = count._count.status;
          break;
        case "UNDELIVERED":
          shipmentCount.undeliverdCount = count._count.status;
          break;
        case "EXCEPTION":
          shipmentCount.exceptionCount = count._count.status;
          break;
        case "PICKUP":
          shipmentCount.exceptionCount = count._count.status;
          break;
      }
    });

    const bookedCount = await ctx.db.order.count({
      where: {
        userId: id,
        status: "BOOKED",
      },
    });

    const cancelledCount = await ctx.db.order.count({
      where: {
        userId: id,
        status: "CANCELLED",
      },
    });

    return { shipmentCount, bookedCount, cancelledCount };
  }),
  getAllOrders: protectedProcedure
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
        userId: ctx.session.user.id,
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
        },
        orderBy: {
          orderDate: "desc",
        },
      });

      const totalOrderCount = await ctx.db.order.count({
        where
        // where: {
        //   userId: ctx.session.user.id,
        // },
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
  rejectOrder: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.db.order.findUnique({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
          status: "BOOKED",
        },
        select: {
          orderPaymentDetails: {
            select: {
              transaction: {
                select: {
                  amount: true,
                },
              },
            },
          },
        },
      });

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

      const wallet = await ctx.db.wallet.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (!wallet) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Wallet not found for the user",
        });
      }

      // 2. Separate the balance update and transaction creation
      await ctx.db.wallet.update({
        where: { id: wallet.id },
        data: {
          currentBalance: {
            increment: order.orderPaymentDetails?.transaction?.amount,
          },
        },
      });

      if (order.orderPaymentDetails?.transaction?.amount) {
        await ctx.db.transaction.create({
          data: {
            amount: order.orderPaymentDetails.transaction.amount,
            type: "CREDIT",
            status: "SUCCESS",
            wallet: {
              connect: {
                id: wallet.id,
              },
            },
            reason: "Order Rejected",
          },
        });
      }

      await ctx.db.order.update({
        where: {
          id: input.id,
        },
        data: {
          status: "CANCELLED",
        },
      });
    }),
  getSingleOrderDetails: protectedProcedure
    .input(z.object({ orderId: z.number() }))
    .query(async ({ ctx, input }) => {
      const order = await ctx.db.order.findFirstOrThrow({
        where: {
          orderId: input.orderId,
          userId: ctx.session.user.id,
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

export default userOrderRouter;
