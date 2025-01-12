import { TRPCError } from "@trpc/server";
import { createTRPCRouter, ultraProtectedProcedure } from "../trpc";
import { z } from "zod";

const FetchConversationByTicketId = z.object({
  ticketId: z.number(),
});

const adminSupportConversationRouter = createTRPCRouter({
  fetchConversationByTicketId: ultraProtectedProcedure
    .input(FetchConversationByTicketId)
    .query(async ({ input, ctx }) => {
      const conversation = await ctx.db.supportConversation.findUnique({
        where: {
          supportTicketId: input.ticketId,
        },
      });

      if (!conversation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversation not found",
        });
      }

      return conversation;
    }),
});

export default adminSupportConversationRouter;
