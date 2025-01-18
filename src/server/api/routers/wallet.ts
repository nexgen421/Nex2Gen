import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  ultraProtectedProcedure,
} from "../trpc";
import { TRPCError } from "@trpc/server";
import { env } from "~/env";

const GetWalletStatmentValidator = z.object({
  cursor: z.number().optional(),
});

const DeleteWalletRequestValidator = z.object({
  walletRequestId: z.string(),
});

const GetAllWalletRequestsValidator = z.object({
  cursor: z.number().optional(),
});

const CreateWalletRequestValidator = z.object({
  fundInput: z.number(),
  referenceNumber: z.string(),
});

const ApproveWalletRequestValidator = z.object({
  walletRequestId: z.string(),
});

const PayOrderValidator = z.object({
  orderId: z.string(),
});

const walletRouter = createTRPCRouter({
  getFunds: protectedProcedure.query(async ({ ctx }) => {
    const selfId = ctx.session?.user.id;

    const walletBalance = await ctx.db.wallet.findUnique({
      where: {
        userId: selfId,
      },
      select: {
        currentBalance: true,
      },
    });

    return walletBalance?.currentBalance;
  }),
  getAllWalletRequests: ultraProtectedProcedure
    .input(GetAllWalletRequestsValidator)
    .query(async ({ ctx, input }) => {
      const unapprovedRequests = await ctx.db.walletRequest.findMany({
        take: 10,
        skip: (input.cursor ?? 0) * 10,
        select: {
          id: true,
          amount: true,
          referenceNumber: true,
          createdAt: true,
          wallet: {
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
          },
        },
        where: {
          isApproved: false,
        },
      });

      return unapprovedRequests;
    }),
  getApprovedWalletRequests: ultraProtectedProcedure
    .input(GetAllWalletRequestsValidator)
    .query(async ({ ctx, input }) => {
      const approvedRequests = await ctx.db.walletRequest.findMany({
        where: {
          isApproved: true,
        },
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
        select: {
          referenceNumber: true,
          amount: true,
          id: true,
          createdAt: true,
          wallet: {
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
          },
        },
        take: 10,
        skip: (input.cursor ?? 0) * 10,
      });
      const walletCount = await ctx.db.walletRequest.count({ where:{isApproved: true}});
      return {approvedRequests,walletCount};
    }),
  createWalletRequest: protectedProcedure
    .input(CreateWalletRequestValidator)
    .mutation(async ({ ctx, input }) => {
      const wallet = await ctx.db.wallet.findUnique({
        where: {
          userId: ctx.session?.user.id,
        },
      });

      if (!wallet) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "No wallet associated with given user",
        });
      }

      await ctx.db.walletRequest.create({
        data: {
          amount: input.fundInput,
          referenceNumber: input.referenceNumber,
          wallet: {
            connect: {
              id: wallet.id,
            },
          },
        },
      });

      return true;
    }),
  approveWalletRequest: ultraProtectedProcedure
    .input(ApproveWalletRequestValidator)
    .mutation(async ({ ctx, input }) => {
      const walletRequest = await ctx.db.walletRequest.findUnique({
        where: {
          id: input.walletRequestId,
        },
      });

      if (!walletRequest) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Wallet request not found",
        });
      }

      const wallet = await ctx.db.wallet.findUnique({
        where: {
          id: walletRequest.walletId,
        },
      });

      if (!wallet) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Wallet not found" });
      }

      await ctx.db.wallet.update({
        where: {
          id: wallet.id,
        },
        data: {
          currentBalance: {
            increment: walletRequest.amount,
          },
          transactions: {
            create: {
              amount: walletRequest.amount,
              type: "CREDIT",
              status: "SUCCESS",
              reason: "Funds added to wallet",
            },
          },
        },
      });

      await ctx.db.walletRequest.update({
        where: {
          id: input.walletRequestId,
        },
        data: {
          isApproved: true,
        },
      });
    }),
  payOrder: ultraProtectedProcedure
    .input(PayOrderValidator)
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.db.order.findUnique({
        where: {
          id: input.orderId,
        },
        select: {
          isInsured: true,
          shipment: true,
          userId: true,
          orderPricing: true,
        },
      });

      if (!order) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
      }

      const wallet = await ctx.db.wallet.findUnique({
        where: {
          userId: order.userId,
        },
      });

      if (!wallet) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Wallet not found" });
      }

      const walletBalance = wallet.currentBalance;

      if (
        walletBalance <
        (order.orderPricing?.price ?? Infinity) + env.INSURANCE_COST
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Insufficient funds",
        });
      }

      await ctx.db.wallet.update({
        where: {
          id: wallet.id,
        },
        data: {
          currentBalance: {
            decrement: order.orderPricing?.price ?? 0,
          },
        },
      });
    }),
  deleteWalletRequest: ultraProtectedProcedure
    .input(DeleteWalletRequestValidator)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.walletRequest.delete({
        where: {
          id: input.walletRequestId,
        },
      });
    }),
  getWalletStatement: protectedProcedure
    .input(GetWalletStatmentValidator)
    .query(async ({ input, ctx }) => {
      const selfId = ctx.session?.user.id;

      const wallet = await ctx.db.wallet.findUnique({
        where: {
          userId: selfId,
        },
      });

      if (!wallet) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Wallet not found" });
      }

      const walletStatements = await ctx.db.transaction.findMany({
        where: {
          walletId: wallet.id,
        },
        take: 10,
        skip: (input.cursor ?? 0) * 10,
      });

      return walletStatements;
    }),
  getUserWalletRequest: protectedProcedure
    .input(GetWalletStatmentValidator)
    .query(async ({ ctx, input }) => {
      const selfId = ctx.session?.user.id;

      const walletRequests = ctx.db.walletRequest.findMany({
        where: {
          wallet: {
            userId: selfId,
          },
        },
        take: 10,
        skip: (input.cursor ?? 0) * 10,
      });

      return walletRequests;
    }),
  getUserWalletRequests: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.number().optional(),
        isApproved: z.boolean(),
        month: z.number(),
        year: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, isApproved, month, year } = input;
      const userId = ctx.session.user.id;

      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);

      const items = await ctx.db.walletRequest.findMany({
        take: limit + 1,
        where: {
          wallet: {
            userId: userId,
          },
          isApproved: isApproved,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        cursor: cursor ? { id: cursor.toString() } : undefined,
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = parseInt(nextItem!.id, 10);
      }

      return {
        items,
        nextCursor,
      };
    }),
});

export default walletRouter;
