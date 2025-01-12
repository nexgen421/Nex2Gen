import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  ultraProtectedProcedure,
} from "../trpc";
import { z } from "zod";

const GetUserWithRatesValidator = z.object({
  page: z.number().optional(),
});

const CreateRatesForUserValidator = z.object({
  userId: z.string(),
  halfKgPrice: z.number(),
  oneKgPrice: z.number(),
  twoKgPrice: z.number(),
  threeKgPrice: z.number(),
  fiveKgPrice: z.number(),
  sevenKgPrice: z.number(),
  tenKgPrice: z.number(),
  twelveKgPrice: z.number(),
  fifteenKgPrice: z.number(),
  seventeenKgPrice: z.number(),
  twentyKgPrice: z.number(),
  twentyTwoKgPrice: z.number(),
  twentyFiveKgPrice: z.number(),
  twentyEightKgPrice: z.number(),
  thirtyKgPrice: z.number(),
  thirtyFiveKgPrice: z.number(),
  fortyKgPrice: z.number(),
  fortyFiveKgPrice: z.number(),
  fiftyKgPrice: z.number(),
});

const UpdateRateForUserValidator = z.object({
  rateId: z.string(),
  halfKgPrice: z.number(),
  oneKgPrice: z.number(),
  twoKgPrice: z.number(),
  threeKgPrice: z.number(),
  fiveKgPrice: z.number(),
  sevenKgPrice: z.number(),
  tenKgPrice: z.number(),
  twelveKgPrice: z.number(),
  fifteenKgPrice: z.number(),
  seventeenKgPrice: z.number(),
  twentyKgPrice: z.number(),
  twentyTwoKgPrice: z.number(),
  twentyFiveKgPrice: z.number(),
  twentyEightKgPrice: z.number(),
  thirtyKgPrice: z.number(),
  thirtyFiveKgPrice: z.number(),
  fortyKgPrice: z.number(),
  fortyFiveKgPrice: z.number(),
  fiftyKgPrice: z.number(),
});

const GetUserRateByIdValidator = z.object({
  userId: z.string(),
});

const rateRouter = createTRPCRouter({
  getRateById: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      include: {
        rateList: true,
      },
    });

    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found!" });
    }

    if (!user.rateList) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Rate list not updated yet!",
      });
    }

    return user.rateList;
  }),
  getUserWithRates: ultraProtectedProcedure
    .input(GetUserWithRatesValidator)
    .query(async ({ ctx, input }) => {
      const users = await ctx.db.user.findMany({
        where: {
          isApproved: true,
        },
        take: 10,
        skip: input.page ? input.page * 10 : 0,
        select: {
          rateList: true,
          name: true,
          wallet: true,
          id: true,
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
      });

      return users;
    }),
  createRatesForUsers: ultraProtectedProcedure
    .input(CreateRatesForUserValidator)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.update({
        where: {
          id: input.userId,
        },
        data: {
          rateList: {
            create: {
              ...input,
            },
          },
        },
      });

      return true;
    }),
  updateRateForUser: ultraProtectedProcedure
    .input(UpdateRateForUserValidator)
    .mutation(async ({ ctx, input }) => {
      const { rateId, ...rateData } = input;
      await ctx.db.rateList.update({
        where: {
          id: rateId,
        },
        data: {
          ...rateData,
        },
      });
    }),
  getUserRateById: ultraProtectedProcedure
    .input(GetUserRateByIdValidator)
    .query(async ({ input, ctx }) => {
      const userRate = await ctx.db.user.findUnique({
        where: {
          id: input.userId,
        },
        select: {
          rateList: true,
        },
      });

      return userRate;
    }),
});

export default rateRouter;
