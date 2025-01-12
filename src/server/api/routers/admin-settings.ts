import { TRPCError } from "@trpc/server";
import { createTRPCRouter, ultraProtectedProcedure } from "../trpc";
import { z } from "zod";

const SetDefaultRateValidator = z.object({
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

export type SetDefaultRateInput = z.infer<typeof SetDefaultRateValidator>;

const adminSettingsRouter = createTRPCRouter({
  getDefaultRate: ultraProtectedProcedure.query(async ({ ctx }) => {
    const defaultRate = await ctx.db.defaultRate.findFirst();

    if (!defaultRate) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Default Rate not found!",
      });
    }

    return defaultRate;
  }),

  setDefaultRate: ultraProtectedProcedure
    .input(SetDefaultRateValidator)
    .mutation(async ({ ctx, input }) => {
      // check if the user is owner of the application

      const user = await ctx.db.admin.findFirst({
        where: {
          id: ctx.session.user.id,
          isOwner: true,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });
      }

      const defaultRate = await ctx.db.defaultRate.findFirst();

      if (!defaultRate) {
        // create default rate

        const newDefaultRate = await ctx.db.defaultRate.create({
          data: input,
        });

        return newDefaultRate;
      } else {
        // update default rate
        const newDefaultRate = await ctx.db.defaultRate.update({
          where: {
            id: defaultRate.id,
          },
          data: input,
        });

        return newDefaultRate;
      }
    }),
});

export default adminSettingsRouter;
