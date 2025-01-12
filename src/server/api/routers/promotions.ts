import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  ultraProtectedProcedure,
} from "../trpc";
import { subDays, startOfDay, endOfDay, format } from "date-fns";
import { TRPCError } from "@trpc/server";

const promotionsRouter = createTRPCRouter({
  // fetch all promocodes

  fetchAllPromocodes: ultraProtectedProcedure.query(async ({ ctx }) => {
    const promoCodes = await ctx.db.promoCode.findMany();

    return promoCodes;
  }),

  togglePromocode: ultraProtectedProcedure
    .input(
      z.object({
        promoCodeId: z.number(),
        isActive: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.promoCode.update({
        where: {
          id: input.promoCodeId,
        },
        data: {
          isActive: input.isActive,
        },
      });
    }),

  createPromocode: ultraProtectedProcedure
    .input(z.object({ amount: z.number(), promocode: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const promocode = await ctx.db.promoCode.create({
        data: {
          amount: input.amount,
          code: input.promocode,
        },
      });

      return promocode;
    }),

  fetchPromocodeAnalytics: ultraProtectedProcedure
    .input(
      z.object({
        promoCodeId: z.number(),
        timeframe: z.enum(["weekly", "monthly"]).default("weekly"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { promoCodeId, timeframe } = input;
      const startDate =
        timeframe === "weekly"
          ? subDays(new Date(), 28)
          : subDays(new Date(), 90);

      const promoCodeData = await ctx.db.promoCode.findUnique({
        where: { id: promoCodeId },
        include: {
          userPromoCodes: {
            include: {
              user: { select: { id: true, email: true } },
            },
          },
        },
      });

      if (!promoCodeData) {
        throw new Error("Promo code not found");
      }

      const totalUsageCount = promoCodeData.userPromoCodes.length;
      const totalAmountSaved = totalUsageCount * promoCodeData.amount;

      // Generate time series data
      const timeSeriesData = [];
      let currentDate = startDate;
      while (currentDate <= new Date()) {
        const endDate = endOfDay(currentDate);
        const usageInPeriod = promoCodeData.userPromoCodes.filter(
          (upc) =>
            upc.createdAt >= startOfDay(currentDate) &&
            upc.createdAt <= endDate,
        );

        timeSeriesData.push({
          date: format(currentDate, "yyyy-MM-dd"),
          usageCount: usageInPeriod.length,
          amountSaved: usageInPeriod.length * promoCodeData.amount,
        });

        currentDate =
          timeframe === "weekly"
            ? new Date(currentDate.setDate(currentDate.getDate() + 7))
            : new Date(currentDate.setMonth(currentDate.getMonth() + 1));
      }

      return {
        promoCode: promoCodeData.code,
        discountAmount: promoCodeData.amount,
        isActive: promoCodeData.isActive,
        createdAt: promoCodeData.createdAt,
        updatedAt: promoCodeData.updatedAt,
        totalUsageCount,
        totalAmountSaved,
        users: promoCodeData.userPromoCodes.map((upc) => ({
          userId: upc.user.id,
          email: upc.user.email,
        })),
        timeSeriesData,
      };
    }),

  applyPromocode: protectedProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const promoCode = await ctx.db.promoCode.findFirst({
        where: {
          code: input.code,
          isActive: true,
        },
      });

      if (!promoCode) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid Promo Code Entered! See Again",
        });
      }

      // check if this promocode is already used

      const userPromoCode = await ctx.db.userPromoCode.findFirst({
        where: {
          userId: ctx.session.user.id,
          promoCodeId: promoCode.id,
        },
      });

      if (userPromoCode) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Promo Code Already Used!",
        });
      }

      await ctx.db.userPromoCode.create({
        data: {
          promoCode: {
            connect: {
              id: promoCode.id,
            },
          },
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });

      // add amount to the wallet

      await ctx.db.wallet.update({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          currentBalance: {
            increment: promoCode.amount,
          },
          transactions: {
            create: {
              amount: promoCode.amount,
              status: "SUCCESS",
              type: "CREDIT",
              reason: "Used Promocode " + promoCode.code,
            },
          },
        },
      });
    }),
});

export default promotionsRouter;
