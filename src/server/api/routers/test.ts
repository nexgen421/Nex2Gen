import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

const QueryTestValidator = z.object({
  message: z.string(),
});

const MutationTestValidator = z.object({
  message: z.string(),
});

const testRouter = createTRPCRouter({
  testQuery: publicProcedure
    .input(QueryTestValidator)
    .query(async ({ ctx, input }) => {
      return input.message;
    }),

  testMutation: publicProcedure
    .input(MutationTestValidator)
    .mutation(async ({ ctx, input }) => {
      return input.message;
    }),
});

export default testRouter;
