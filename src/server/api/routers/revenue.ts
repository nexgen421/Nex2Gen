import { createTRPCRouter, ultraProtectedProcedure } from "../trpc";
import { z } from "zod";

const GetMonthWiseRevenueValidator = z.object({
  month: z.number(),
  year: z.number(),
});

const GetYearWiseRevenueValidator = z.object({
  year: z.number(),
});

const revenueRouter = createTRPCRouter({
  getThisMonthRevenue: ultraProtectedProcedure.query(async ({ ctx }) => {
    // get current month

    const today = new Date();
    const firstDay = new Date(today.getFullYear()).setMonth(today.getMonth());
    const lastDay = new Date(today.getFullYear()).setMonth(
      today.getMonth() + 1,
    );

    const revenue = await ctx.db.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        createdAt: {
          gte: new Date(firstDay),
          lte: new Date(lastDay),
        },
        type: "DEBIT",
      },
    });

    return revenue._sum;
  }),

  getMonthWiseRevenue: ultraProtectedProcedure
    .input(GetMonthWiseRevenueValidator)
    .query(async ({ ctx, input }) => {
      const firstDay = new Date(input.year).setMonth(input.month);
      const lastDay = new Date(input.year).setMonth(input.month + 1);

      const revenue = await ctx.db.transaction.aggregate({
        _sum: {
          amount: true,
        },

        where: {
          type: "DEBIT",
          createdAt: {
            gte: new Date(firstDay),
            lt: new Date(lastDay),
          },
        },
      });

      return revenue._sum;
    }),

  getYearWiseRevenue: ultraProtectedProcedure
    .input(GetYearWiseRevenueValidator)
    .query(async ({ ctx, input }) => {
      

      const revenue = await ctx.db.transaction.aggregate({
        _sum: {
          amount: true,
        },

        where: {
          type: "DEBIT",
          // createdAt: {
          //   gte: new Date(firstDay),
          //   lt: new Date(lastDay),
          // },
        },
      });
      const totalRevenue = revenue._sum.amount !== null ? parseFloat(revenue?._sum.amount.toString()) : 0.0;

      return totalRevenue;
    }),

  getDaysOfTheMonthRevenue: ultraProtectedProcedure
    .input(
      z.object({
        year: z.number().optional(),
        month: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const today = new Date();
      const year = input.year ?? today.getFullYear();
      const month = input.month ?? today.getMonth();

      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0); // Last day of the month

      const dailyRevenue = await ctx.db.transaction.groupBy({
        by: ["createdAt"],
        _sum: {
          amount: true,
        },
        where: {
          type: "DEBIT",
          createdAt: {
            gte: firstDay,
            lte: lastDay,
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      // Format the result to return revenue for each day
      const result = Array.from({ length: lastDay.getDate() }, (_, i) => {
        const date = new Date(year, month, i + 1);
        const revenue =
          dailyRevenue.find((r) => r.createdAt.getDate() === date.getDate())
            ?._sum.amount ?? 0;
        return {
          date: date.toISOString().split("T")[0], // Format date as YYYY-MM-DD
          revenue,
        };
      });

      return result;
    }),
});

export default revenueRouter;
