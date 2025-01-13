/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  ultraProtectedProcedure,
  publicProcedure
} from "../trpc";
import bcrypt from "bcrypt";
import { TRPCError } from "@trpc/server";
import { type Prisma } from "@prisma/client";
import axios from 'axios';
export const FetchAllUsersValidator = z.object({
  cursor: z.number().optional(),
  filter: z.enum(["all", "approved", "kyc", "pending"]),
  search: z.string().optional(),
});

const ApproveUserValidator = z.object({
  id: z.string(),
});

const FetchKycDetailsValidator = z.object({
  id: z.string(),
});

const ChangePasswordValidator = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
  confirmPassword: z.string(),
});

const userRouter = createTRPCRouter({
  getDashboardData: protectedProcedure.query(async ({ ctx }) => {
    const promises = {
      wallet: ctx.db.wallet.findUnique({
        where: {
          userId: ctx.session.user.id,
        },
        select: {
          currentBalance: true,
        },
      }),
      shipments: ctx.db.shipment.groupBy({
        by: ["status"],
        where: {
          order: {
            userId: ctx.session.user.id,
          },
          createdAt: {
            gte: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000), // Last 15 days
          },
        },
        _count: {
          status: true,
        },
      }),
      bookedCount: ctx.db.order.count({
        where: {
          userId: ctx.session.user.id,
          status: "BOOKED",
        },
      }),
      cancelledCount: ctx.db.order.count({
        where: {
          userId: ctx.session.user.id,
          status: "CANCELLED",
        },
      }),
    };

    const [wallet, shipments, bookedCount, cancelledCount] = await Promise.all([
      promises.wallet,
      promises.shipments,
      promises.bookedCount,
      promises.cancelledCount,
    ]);

    const shipmentCount = {
      INFORECEIVED: 0,
      PENDING: 0,
      TRANSIT: 0,
      DELIVERED: 0,
      UNDELIVERED: 0,
      EXCEPTION: 0,
      PICKUP: 0,
    };

    shipments.forEach((count) => {
      switch (count.status) {
        case "INFORECEIVED":
          shipmentCount.INFORECEIVED = count._count.status;
          break;
        case "PENDING":
          shipmentCount.PENDING = count._count.status;
          break;
        case "TRANSIT":
          shipmentCount.TRANSIT = count._count.status;
          break;
        case "DELIVERED":
          shipmentCount.DELIVERED = count._count.status;
          break;
        case "UNDELIVERED":
          shipmentCount.UNDELIVERED = count._count.status;
          break;
        case "EXCEPTION":
          shipmentCount.EXCEPTION = count._count.status;
          break;
        case "PICKUP":
          shipmentCount.PICKUP = count._count.status;
          break;
      }
    });

    return {
      wallet: wallet?.currentBalance ?? 0,
      shipmentCount,
      bookedCount,
      cancelledCount,
    };
  }),
  fetchAll: ultraProtectedProcedure
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
  paymentWebhook: protectedProcedure.query(async ({ ctx }) => {
    const unapprovedRequests = await ctx.db.walletRequest.findMany({
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
        wallet: {
          userId: ctx.session.user.id,  // Search for wallet by userId
        },
      },
    });

    // for (let i = 0; i < unapprovedRequests.length; i++) {
    for(const data of unapprovedRequests){
      const obj = {
        "user_token": "1e718255af0d6dc004e4e2d860a90c6f", "order_id": data.referenceNumber
      }
      // try {
      const response : any = await axios.post('https://pay.imb.org.in/api/check-order-status', obj, {});
      const walletRequest = await ctx.db.walletRequest.findFirst({
        where: {
          referenceNumber: data.referenceNumber,
        },
      });

      if (!walletRequest) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Wallet request not found",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (response?.data?.status == 'ERROR') {
        await ctx.db.walletRequest.update({
          where: {
            id: walletRequest.id,
          },
          data: {
            isApproved: true,
            status: response?.data?.status
          },
        });
        continue;
      }

      const wallet = await ctx.db.wallet.findUnique({
        where: {
          id: walletRequest.walletId,
        },
      });

      if (!wallet) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Wallet not found" });
      }
      if (response.data.result.txnStatus == 'COMPLETED') {
        await ctx.db.wallet.update({
          where: {
            id: wallet.id,
          },
          data: {
            currentBalance: {
              increment: response.data.result.amount,
            },
            transactions: {
              create: {
                amount: response.data.result.amount,
                type: "CREDIT",
                status: "SUCCESS",
                reason: "Funds added to wallet",
                walletReferenceId: response?.data?.referenceNumber
              },
            },
          },
        });
      }
      await ctx.db.walletRequest.update({
        where: {
          id: walletRequest.id,
        },
        data: {
          isApproved: true,
          status: response.data.result.txnStatus
        },
      });
      // } catch (err) {
      //   console.log(err)

      // }

    }

    // console.log(response)
    return { data: "success" }
  }),
  approve: ultraProtectedProcedure
    .input(ApproveUserValidator)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.update({
        where: {
          id: input.id,
        },
        data: {
          isApproved: true,
        },
      });
      return true;
    }),
  deleteUser: ultraProtectedProcedure
    .input(ApproveUserValidator)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.delete({
        where: {
          id: input.id,
        },
      });

      return true;
    }),
  fetchKycDetails: ultraProtectedProcedure
    .input(FetchKycDetailsValidator)
    .query(async ({ ctx, input }) => {
      const kycDetails = await ctx.db.kycDetails.findFirst({
        where: {
          userId: input.id,
        },
        select: {
          aadharInfo: true,
          panInfo: true,
          companyInfo: true,
          id: true,
          user: {
            select: {
              pickupLocation: true,
            },
          },
        },
      });

      return kycDetails;
    }),

  fetchUserProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        name: true,
        email: true,
        kycDetails: {
          select: {
            companyInfo: {
              select: {
                companyContactNumber: true,
                companyEmail: true,
                companyName: true,
                companyType: true,
                createdAt: true,
              },
            },
            aadharInfo: true,
            panInfo: true,
          },
        },
      },
    });

    return user;
  }),

  // fetchAllUserProfileRevenue : protectedProcedure.query(async ({ ctx }) => {
  //   const users = await ctx.db.user.findMany({
  //     take: 10,
  //     skip: (input.cursor ?? 0) * 10,
  //     where,
  //     select: {
  //       id: true,
  //       name: true,
  //       image: true,
  //       email: true,
  //       // mobile: true,
  //       isApproved: true,
  //       isKycSubmitted: true,
  //       createdAt: true,
  //     },
  //     orderBy: {
  //       createdAt: "desc",
  //     },
  //   });

  //   return users;
  // }),

  fetchAllUserProfileRevenue: ultraProtectedProcedure
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
          // wallet: true,
          wallet: true,
          kycDetails: {
            select: {
              companyInfo: {
                select: {
                  companyContactNumber: true,
                  companyEmail: true,
                  companyName: true,
                  companyType: true,
                  createdAt: true,
                },
              },
              aadharInfo: true,
              panInfo: true,
            },
          },
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
  changePassword: protectedProcedure
    .input(ChangePasswordValidator)
    .mutation(async ({ ctx, input }) => {
      // first check if the old password is correct
      // if not, throw an error

      const user = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          password: true,
        },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      // check if the old password if correct

      const isPasswordCorrect = await bcrypt.compare(
        input.oldPassword,
        user.password,
      );

      if (!isPasswordCorrect) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Old password is incorrect",
        });
      }

      // check if the new password and confirm password match

      if (input.newPassword !== input.confirmPassword) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "New password and confirm password do not match",
        });
      }

      // hash the new password and update the user

      const hashedPassword = await bcrypt.hash(input.newPassword, 10);

      await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          password: hashedPassword,
        },
      });

      return true;
    }),
});

export default userRouter;
