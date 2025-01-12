import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { env } from "~/env";

const billRouter = createTRPCRouter({
  getUserBill: protectedProcedure
    .input(
      z.object({
        date: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Get the date, or use the current date
      const dateToFind = input.date ?? new Date();

      // Create the start and end of the day
      const dayStart = new Date(dateToFind);
      dayStart.setHours(0, 0, 0, 0); // 00:00:00.000

      const dayEnd = new Date(dateToFind);
      dayEnd.setHours(23, 59, 59, 999); // 23:59:59.999

      // Fetch transactions within the date range
      const transactions = await ctx.db.transaction.findMany({
        where: {
          createdAt: {
            gte: dayStart,
            lte: dayEnd,
          },
          type: "DEBIT",
          wallet: {
            userId: ctx.session.user.id,
          },
        },
        select: {
          amount: true,
          orderPaymentDetails: {
            select: {
              order: {
                select: {
                  id: true,
                  packageDetails: {
                    select: {
                      physicalWeight: true,
                    },
                  },
                  isInsured: true,
                },
              },
            },
          },
        },
      });

      // Fetch user details
      const userDetails = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          name: true,
          rateList: true,
          kycDetails: {
            select: {
              companyInfo: {
                select: {
                  companyName: true,
                },
              },
            },
          },
          pickupLocation: true,
        },
      });

      // Return the transaction, user details, and insurance cost
      return {
        transactions,
        userDetails,
        insuranceCost: env.INSURANCE_COST,
      };
    }),
});

export default billRouter;
