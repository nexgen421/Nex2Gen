import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

const QueryTestValidator = z.any(); // Accepts anything as input

export const webhookRouter = createTRPCRouter({
    receive: publicProcedure
        .input(QueryTestValidator)
        .mutation(async ({ ctx, input }) => {
            console.log("WEBHOOK LOG =-=-=-=-=-=-=>", input); // Logs the entire request body
            return input;       // Returns whatever was sent
        }),
});
