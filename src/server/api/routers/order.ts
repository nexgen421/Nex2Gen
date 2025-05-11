import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  ultraProtectedProcedure,
} from "../trpc";
import { z } from "zod";
import { env } from "~/env";
import { OrderStatus, type ShipmentStatus } from "@prisma/client";
import { Tracker } from "~/lib/tracking-more";
import { type TrackingItem } from "~/lib/tracking-more/modules/types";
import moment from "moment";
import { type Prisma } from "@prisma/client";

interface UserAwbDetails {
  awbNumber?: number | null;
}

interface Order {
  userAwbDetails: UserAwbDetails;
  // other properties of the order
}

const RejectOrderValidator = z.object({
  orderId: z.string(),
});
export const FetchAllUsersValidator = z.object({
  cursor: z.number().optional(),
  filter: z.enum(["all", "approved", "kyc", "pending"]),
  search: z.string().optional(),
});

const GetUsersValidator = z.object({
  cursor: z.number().optional(),
});

const GetUserOrderValidator = z.object({
  id: z.string(),
});

const GetApprovedOrdersValidator = z.object({
  cursor: z.number().optional(),
});

const GetOrderValidator = z.object({
  id: z.string(),
});

const GetOrderRequestsValidator = z.object({
  id: z.string(),
  cursor: z.number().optional(),
});

const GetAllOrdersValidator = z.object({
  cursor: z.number().optional(),
});

const ApproveOrderValidator = z.object({
  awbNumber: z.string(),
  courierProvider: z.enum([
    "delhivery",
    "ecomexpress",
    "xpressbees",
    "shadowfax",
    "valmo",
  ]),
  dbOrderId: z.string(),
});

const GetUserOrdersAdminValidator = z.object({
  id: z.string(),
  cursor: z.number().optional(),
  statusType: z.enum(["BOOKED", "READY_TO_SHIP", "CANCELLED"]),
});

const GetUserOrdersValidator = z.object({
  cursor: z.number().default(0),
  days: z.number().default(7),
  awb: z.string().optional(),
});

const CreateOrderValidator = z.object({
  customerName: z.string(),
  customerMobile: z.string(),
  customerEmail: z.string().email(),
  streetName: z.string(),
  houseNumber: z.string(),
  pincode: z.number(),
  state: z.string(),
  city: z.string(),
  famousLandmark: z.string(),
  productName: z.string(),
  productCategory: z.string(),
  orderValue: z.number(),
  physicalWeight: z.number(),
  length: z.number(),
  breadth: z.number(),
  height: z.number(),
  pickupLocationId: z.string(),
  isInsured: z.boolean(),
  orderCategory: z.string(),
});

const orderRouter = createTRPCRouter({
  createOrder: protectedProcedure
    .input(CreateOrderValidator)
    .mutation(async ({ ctx, input }) => {
      const wallet = await ctx.db.wallet.findUnique({
        where: {
          userId: ctx.session.user.id,
        },
      });

      if (!wallet) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Wallet not found",
        });
      }

      const rateList = await ctx.db.rateList.findUnique({
        where: {
          userId: ctx.session.user.id,
        },
      });

      if (!rateList) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Rate List not updated",
        });
      }

      let rate = 0;
      if (input.physicalWeight <= 0.5) {
        rate = rateList.halfKgPrice;
      } else if (input.physicalWeight <= 1) {
        rate = rateList.oneKgPrice;
      } else if (input.physicalWeight <= 2) {
        rate = rateList.twoKgPrice;
      } else if (input.physicalWeight <= 3) {
        rate = rateList.threeKgPrice;
      } else if (input.physicalWeight <= 5) {
        rate = rateList.fiveKgPrice;
      } else if (input.physicalWeight <= 7) {
        rate = rateList.sevenKgPrice;
      } else if (input.physicalWeight <= 10) {
        rate = rateList.tenKgPrice;
      } else if (input.physicalWeight <= 12) {
        rate = rateList.twelveKgPrice;
      } else if (input.physicalWeight <= 15) {
        rate = rateList.fifteenKgPrice;
      } else if (input.physicalWeight <= 17) {
        rate = rateList.seventeenKgPrice;
      } else if (input.physicalWeight <= 20) {
        rate = rateList.twentyKgPrice;
      } else if (input.physicalWeight <= 22) {
        rate = rateList.twentyTwoKgPrice;
      } else if (input.physicalWeight <= 25) {
        rate = rateList.twentyFiveKgPrice;
      } else if (input.physicalWeight <= 28) {
        rate = rateList.twentyEightKgPrice;
      } else if (input.physicalWeight <= 30) {
        rate = rateList.thirtyKgPrice;
      } else if (input.physicalWeight <= 35) {
        rate = rateList.thirtyFiveKgPrice;
      } else if (input.physicalWeight <= 40) {
        rate = rateList.fortyKgPrice;
      } else if (input.physicalWeight <= 45) {
        rate = rateList.fortyFiveKgPrice;
      } else if (input.physicalWeight <= 50) {
        rate = rateList.fiftyKgPrice;
      } else if (input.physicalWeight > 50) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Weight more than 50kg not supported",
        });
      }

      const totalCost = rate + (input.isInsured ? env.INSURANCE_COST : 0);

      if (totalCost > wallet?.currentBalance) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Insufficient Funds!",
        });
      }

      // deduct money from wallet

      const order = await ctx.db.order.create({
        data: {
          pickupLocation: {
            connect: {
              id: input.pickupLocationId,
            },
          },
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          orderCustomerDetails: {
            create: {
              customerMobile: input.customerMobile,
              customerName: input.customerName,
            },
          },
          isInsured: input.isInsured,
          packageDetails: {
            create: {
              breadth: input.breadth,
              length: input.length,
              height: input.height,
              physicalWeight: input.physicalWeight,
            },
          },
          orderAdressDetails: {
            create: {
              city: input.city,
              famousLandmark: input.famousLandmark,
              houseNumber: input.houseNumber,
              pincode: input.pincode,
              state: input.state,
              streetName: input.streetName,
            },
          },
          orderCategory: input.orderCategory,
          orderValue: input.orderValue,
          productName: input.productName,
          orderPricing: {
            create: {
              price: totalCost,
            },
          },
        },
      });

      await ctx.db.wallet.update({
        where: {
          id: wallet.id,
        },
        data: {
          currentBalance: {
            decrement: totalCost,
          },
          transactions: {
            create: {
              amount: totalCost,
              status: "SUCCESS",
              orderPaymentDetails: {
                create: {
                  order: {
                    connect: {
                      id: order.id,
                    },
                  },
                },
              },
              reason: "Order Payment",
            },
          },
        },
      });

      await ctx.db.userAwbDetails.create({
        data: {
          order: {
            connect: {
              id: order.id,
            },
          },
        },
      });
    }),
  getAllPickupLocation: protectedProcedure.query(async ({ ctx }) => {
    const pickupLocation = await ctx.db.pickupLocation.findUnique({
      where: {
        userId: ctx.session.user.id,
      },
    });

    if (!pickupLocation) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No Pickup Location found",
      });
    }

    // get the name of the company also
    const company = await ctx.db.kycDetails.findFirst({
      where: {
        user: {
          id: ctx.session.user.id,
        },
      },
      select: {
        companyInfo: {
          select: {
            companyName: true,
          },
        },
      },
    });

    if (!company) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No KYC Details found",
      });
    }

    const name = company.companyInfo?.companyName;

    if (!name) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No Company Name found",
      });
    }

    return {
      ...pickupLocation,
      name,
    };
  }),
  getAllOrders: ultraProtectedProcedure
    .input(GetAllOrdersValidator)
    .query(async ({ ctx, input }) => {
      const orders = await ctx.db.order.findMany({
        skip: (input.cursor ?? 0) * 10,
        take: 10,
      });

      return orders;
    }),
  getOrderRequests: ultraProtectedProcedure
    .input(GetOrderRequestsValidator)
    .query(async ({ ctx, input }) => {
      const orders = await ctx.db.order.findMany({
        where: {
          status: "BOOKED",
          userId: input.id,
        },
        select: {
          id: true,
          orderDate: true,
          status: true,
          orderAdressDetails: {
            select: {
              city: true,
              famousLandmark: true,
              houseNumber: true,
              pincode: true,
              state: true,
              streetName: true,
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
          isInsured: true,
          orderCategory: true,
          orderId: true,
          orderPaymentDetails: true,
          orderPricing: true,
          orderValue: true,
          paymentMode: true,
          pickupLocation: true,
          pickupLocationId: true,
          productName: true,
          shipment: true,
          // user:true,
          user: {
            select: {
              kycDetails: {
                select: {
                  companyInfo: {
                    select: {
                      companyName: true,
                    },
                  },
                },
              },
              name: true,
            },
          },
        },
        take: 10,
        skip: input.cursor ? input.cursor * 10 : 0,
        orderBy: {
          orderDate: "desc",
        },
      });

      const orderCount = await ctx.db.order.count({
        where: {
          status: "BOOKED",
        },
      });
      return { orders, orderCount };
    }),
  getOrder: ultraProtectedProcedure
    .input(GetOrderValidator)
    .query(async ({ ctx, input }) => {
      const order = await ctx.db.order.findUnique({
        where: {
          id: input.id,
        },
        select: {
          packageDetails: {
            select: {
              length: true,
              height: true,
              breadth: true,
              physicalWeight: true,
            },
          },
          orderCustomerDetails: {
            select: {
              customerMobile: true,
              customerName: true,
            },
          },
          orderAdressDetails: {
            select: {
              city: true,
              state: true,
              pincode: true,
              houseNumber: true,
              famousLandmark: true,
              streetName: true,
            },
          },
          status: true,
          id: true,
          isInsured: true,
          orderDate: true,
          orderId: true,
          paymentMode: true,
          pickupLocation: true,
          updatedAt: true,
          pickupLocationId: true,
          orderPricing: true,
        },
      });

      return order;
    }),
  getUserOrders: protectedProcedure
    .input(GetUserOrdersValidator)
    .query(async ({ ctx, input }) => {
      const { cursor, days, awb } = input;
      const startDate = moment().subtract(days, "days").toDate();

      const whereClause: Prisma.OrderScalarWhereInput = {
        userId: ctx.session.user.id,
        orderDate: { gte: startDate },
        ...(awb ? { userAwbDetails: { awbNumber: { contains: awb } } } : {}),
      };

      const ordersCount = await ctx.db.order.count({
        where: whereClause,
      });

      const orders = await ctx.db.order.findMany({
        where: whereClause,
        select: {
          id: true,
          status: true,
          orderDate: true,
          orderPricing: {
            select: {
              price: true,
            },
          },
          orderCustomerDetails: true,
          userAwbDetails: {
            select: {
              awbNumber: true,
            },
          },
          productName: true,
          orderCategory: true,
          orderValue: true,
          packageDetails: {
            select: {
              length: true,
              breadth: true,
              height: true,
              physicalWeight: true,
            },
          },
          orderAdressDetails: {
            select: {
              city: true,
              famousLandmark: true,
              houseNumber: true,
              pincode: true,
              state: true,
              streetName: true,
            },
          },
        },
        take: 10,
        skip: cursor * 10,
        orderBy: { orderDate: "desc" },
      });

      const modifiedOrders = orders.map((order) => ({
        ...order,
        userAwbDetails: {
          awbNumber: order.userAwbDetails?.awbNumber
            ? order.userAwbDetails.awbNumber + 100000
            : null,
        },
      }));

      return {
        orders: modifiedOrders,
        ordersCount,
      };
    }),
  approveOrder: ultraProtectedProcedure
    .input(ApproveOrderValidator)
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
        throw error;
      }
    }),
  getApprovedOrders: ultraProtectedProcedure
    .input(GetApprovedOrdersValidator)
    .query(async ({ input, ctx }) => {
      const orders = await ctx.db.order.findMany({
        where: {
          status: "READY_TO_SHIP",
        },
        take: 10,
        skip: (input.cursor ?? 0) * 10,
        select: {
          status: true,
          id: true,

          isInsured: true,
          orderDate: true,
          orderId: true,
          paymentMode: true,
          pickupLocation: true,
          updatedAt: true,
          pickupLocationId: true,
          shipment: true,
          orderPricing: true,
          orderAdressDetails: {
            select: {
              city: true,
              state: true,
              streetName: true,
              famousLandmark: true,
              houseNumber: true,
              pincode: true,
            },
          },
          packageDetails: {
            select: {
              breadth: true,
              length: true,
              height: true,
              physicalWeight: true,
            },
          },
        },
      });

      const orderCount = await ctx.db.order.count({
        where: {
          status: "READY_TO_SHIP",
        },
      });

      return { orders, orderCount };
    }),
  getUserWithOrderCounts: ultraProtectedProcedure
    .input(GetUsersValidator)
    .query(async ({ ctx, input }) => {
      const users = await ctx.db.user.findMany({
        skip: (input.cursor ?? 0) * 10,
        take: 10,
        orderBy: {},
        select: {
          id: true,
          name: true,
          email: true,
          kycDetails: {
            select: {
              companyInfo: {
                select: {
                  companyName: true,
                },
              },
            },
          },
          orders: {
            select: {
              status: true,
              orderDate: true,
            },
            orderBy: {
              orderDate: "desc",
            },
          },
        },
      });

      const userCount = await ctx.db.user.count();

      const usersWithOrderCounts = users.map((user) => ({
        name: user.name,
        email: user.email,
        companyName: user.kycDetails?.companyInfo?.companyName ?? null,
        bookedOrdersCount: user.orders.filter(
          (order) => order.status === OrderStatus.BOOKED,
        ).length,
        processingOrdersCount: user.orders.filter(
          (order) => order.status === OrderStatus.READY_TO_SHIP,
        ).length,
        latestOrderDate: user.orders[0]?.orderDate ?? null,
        id: user.id,
      }));

      return { userData: usersWithOrderCounts, userCount };
    }),
  getUserWithOrderRequestCounts: ultraProtectedProcedure
    .input(GetUsersValidator)
    .query(async ({ ctx, input }) => {
      const users = await ctx.db.user.findMany({
        skip: (input.cursor ?? 0) * 10,
        take: 10,
        orderBy: {},
        where: {
          orders: {
            some: { status: OrderStatus.BOOKED }, // Only include users who have at least one order with status "hello"
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          kycDetails: {
            select: {
              companyInfo: {
                select: {
                  companyName: true,
                },
              },
            },
          },
          orders: {
            where: { status: OrderStatus.BOOKED },
            select: {
              status: true,
              orderDate: true,
            },
            orderBy: {
              orderDate: "desc",
            },
          },
        },
      });

      const userCount = users.length;

      const usersWithOrderCounts = users.map((user) => ({
        name: user.name,
        email: user.email,
        companyName: user.kycDetails?.companyInfo?.companyName ?? null,
        bookedOrdersCount: user.orders.filter(
          (order) => order.status === OrderStatus.BOOKED,
        ).length,
        processingOrdersCount: user.orders.filter(
          (order) => order.status === OrderStatus.READY_TO_SHIP,
        ).length,
        latestOrderDate: user.orders[0]?.orderDate ?? null,
        id: user.id,
      }));

      return { userData: usersWithOrderCounts, userCount };
    }),
  getUserOrder: protectedProcedure
    .input(GetUserOrderValidator)
    .query(async ({ ctx, input }) => {
      const order = await ctx.db.order.findUnique({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        select: {
          id: true,
          pickupLocation: true,
          isInsured: true,
          orderCategory: true,
          orderDate: true,
          orderId: true,
          userAwbDetails: {
            select: {
              awbNumber: true,
            },
          },
          productName: true,
          paymentMode: true,
          user: {
            select: {
              kycDetails: {
                select: {
                  companyInfo: {
                    select: {
                      companyName: true,
                    },
                  },
                },
              },
              name: true,
              email: true,
            },
          },
          orderValue: true,
          orderAdressDetails: {
            select: {
              city: true,
              state: true,
              streetName: true,
              famousLandmark: true,
              houseNumber: true,
              pincode: true,
            },
          },
          packageDetails: {
            select: {
              breadth: true,
              length: true,
              height: true,
              physicalWeight: true,
            },
          },
          orderCustomerDetails: {
            select: {
              customerMobile: true,
              customerName: true,
            },
          },
          shipment: {
            select: {
              awbNumber: true,
              courierProvider: true,
            },
          },
        },
      });

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order with given id not found",
        });
      }

      order.userAwbDetails?.awbNumber &&
        (order.userAwbDetails.awbNumber += +env.USER_AWB_OFFSET);

      return {
        ...order,
        url: env.NEXTAUTH_URL,
      };
    }),
  getUserOrdersAdmin: ultraProtectedProcedure
    .input(GetUserOrdersAdminValidator)
    .query(async ({ input, ctx }) => {
      const userOrders = await ctx.db.order.findMany({
        where: {
          userId: input.id,
          status: input.statusType as OrderStatus,
        },
        select: {
          id: true,
          status: true,
          orderDate: true,
          shipment: {
            select: {
              awbNumber: true,
              courierProvider: true,
              status: true,
            },
          },
          orderCustomerDetails: {
            select: {
              customerName: true,
            },
          },
          packageDetails: {
            select: {
              breadth: true,
              length: true,
              height: true,
              physicalWeight: true,
            },
          },
          paymentMode: true,
          orderValue: true,
          productName: true,
          orderPricing: {
            select: {
              price: true,
            },
          },
        },
        take: 10,
        skip: (input.cursor ?? 0) * 10,
      });

      const userOrderCount = await ctx.db.order.count({
        where: {
          userId: input.id,
        },
      });

      const userDetails = await ctx.db.user.findUnique({
        where: {
          id: input.id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          kycDetails: {
            select: {
              companyInfo: {
                select: {
                  companyName: true,
                  companyEmail: true,
                  companyContactNumber: true,
                },
              },
            },
          },
        },
      });

      return {
        userOrders,
        userOrderCount,
        userName: userDetails?.name,
        userEmail: userDetails?.email,
        companyName: userDetails?.kycDetails?.companyInfo?.companyName,
        companyEmail: userDetails?.kycDetails?.companyInfo?.companyEmail,
        companyContactNumber:
          userDetails?.kycDetails?.companyInfo?.companyContactNumber,
      };
    }),
  // revenue
  RevenuefetchAll: ultraProtectedProcedure
    .input(FetchAllUsersValidator)
    .query(async ({ ctx, input }) => {
      const filter = input.filter;
      const searchTerm = input.search;

      const where: Prisma.UserWhereInput = {
        AND: [
          filter === "approved" ? { isApproved: true } : {},
          filter === "kyc" ? { isKycSubmitted: true, isApproved: false } : {},
          filter === "pending"
            ? {
                isApproved: false,
                isKycSubmitted: false,
              }
            : {},
          searchTerm
            ? {
                OR: [{ name: { contains: searchTerm, mode: "insensitive" } }],
              }
            : {},
        ],
      };

      const users = await ctx.db.user.findMany({
        take: 10,
        skip: (input.cursor ?? 0) * 10,
        where,
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
          // mobile: true,
          isApproved: true,
          isKycSubmitted: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const usersCount = await ctx.db.user.count({ where });
      return { users, usersCount };
    }),
  rejectOrder: ultraProtectedProcedure
    .input(RejectOrderValidator)
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.db.order.findUnique({
        where: {
          id: input.orderId,
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
          userId: true,
        },
      });

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

      const wallet = await ctx.db.wallet.findUnique({
        where: { userId: order.userId },
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
          id: input.orderId,
        },
        data: {
          status: "CANCELLED",
        },
      });
    }),
});

export default orderRouter;
