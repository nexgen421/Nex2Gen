import { type Prisma } from "@prisma/client";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

const GetFundHistoryValidator = z.object({
  cursor: z.number(),
  year: z.number(),
  month: z.enum([
    "All",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]),
});

const fundRouter = createTRPCRouter({
  getFundHistory: protectedProcedure
    .input(GetFundHistoryValidator)
    .query(async ({ ctx, input }) => {
      const { cursor, year, month } = input;

      const whereClause: Prisma.TransactionWhereInput = {
        wallet: {
          userId: ctx.session?.user.id,
        },
      };

      if (year) {
        whereClause.createdAt = {
          gte: new Date(`${year}-01-01`),
          lt: new Date(`${year + 1}-01-01`),
        };
      }

      if (month !== "All") {
        const monthIndex = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ].indexOf(month);

        if (monthIndex !== -1) {
          const startDate = new Date(year, monthIndex, 1);
          const endDate = new Date(year, monthIndex + 1, 0);

          whereClause.createdAt = {
            gte: startDate,
            lte: endDate,
          };
        }
      }

      const resp = await ctx.db.wallet.findFirst({
        where: {
          userId: ctx.session?.user.id,
        },
        select: {
          transactions: {
            where: whereClause,
            take: 50,
            skip: cursor * 50,
            orderBy: {
              createdAt: "desc",
            },
            select: {
              amount: true,
              type: true,
              status: true,
              orderPaymentDetails: {
                select: {
                  order: {
                    select: {
                      userAwbDetails: {
                        select: {
                          awbNumber: true,
                        },
                      },
                    },
                  },
                },
              },
              reason: true,
              id: true,
              createdAt: true,
            },
          },
        },
      });

      const transactions = resp?.transactions.map((transaction) => ({
        ...transaction,
        orderPaymentDetails: {
          order: {
            userAwbDetails: {
              awbNumber: transaction.orderPaymentDetails?.order?.userAwbDetails
                ?.awbNumber
                ? transaction.orderPaymentDetails?.order?.userAwbDetails
                    ?.awbNumber + 100000
                : null,
            },
          },
        },
      }));

      return transactions;
    }),
});

export default fundRouter;
