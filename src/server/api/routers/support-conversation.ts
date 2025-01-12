import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  ultraProtectedProcedure,
} from "../trpc";
import { z } from "zod";

const CreateMessageUserValidator = z.object({
  content: z.string(),
  conversationId: z.number(),
});

const ChangeIntervener = z.object({
  conversationId: z.number(),
});

const CreateConversationValidator = z.object({
  supportTicketId: z.number(),
});

const GetConversationValidator = z.object({
  conversationId: z.number().optional(),
});

const GetConversationAdminValidator = z.object({
  ticketId: z.number().optional(),
});

const supportConversationRouter = createTRPCRouter({
  createMessageUser: protectedProcedure
    .input(CreateMessageUserValidator)
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.db.supportConversation.findUnique({
        where: {
          id: input.conversationId,
        },
        select: {
          supportTicket: true,
        },
      });

      if (response?.supportTicket?.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not allowed to message here brother!",
        });
      }

      const message = await ctx.db.message.create({
        data: {
          content: input.content,
          conversation: {
            connect: {
              id: input.conversationId,
            },
          },
          senderId: ctx.session.user.id,
        },
      });

      return message;
    }),
  createMessageAdmin: ultraProtectedProcedure
    .input(CreateMessageUserValidator)
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.db.supportConversation.findUnique({
        where: {
          id: input.conversationId,
        },
        select: {
          supportTicket: true,
        },
      });

      if (response?.supportTicket?.intervenerId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not allowed to message here brother!",
        });
      }

      await ctx.db.supportConversation.update({
        where: {
          id: input.conversationId,
        },
        data: {
          messages: {
            create: {
              content: input.content,
              senderId: ctx.session.user.id,
            },
          },
        },
      });
    }),
  interveneChange: ultraProtectedProcedure
    .input(ChangeIntervener)
    .mutation(async ({ ctx, input }) => {
      // check if support conversation exists
      const supportConversation = await ctx.db.supportConversation.findUnique({
        where: {
          id: input.conversationId,
        },
        select: {
          supportTicket: true,
        },
      });

      if (!supportConversation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Support conversation not found!",
        });
      }

      // check if user is the owner of the support ticket

      await ctx.db.supportTicket.update({
        where: {
          id: supportConversation.supportTicket.id,
        },
        data: {
          intervener: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),
  createConversationUser: protectedProcedure
    .input(CreateConversationValidator)
    .mutation(async ({ ctx, input }) => {
      const supportTicket = await ctx.db.supportTicket.findUnique({
        where: {
          id: input.supportTicketId,
        },
      });

      if (!supportTicket) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Support ticket not found!",
        });
      }

      if (supportTicket.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not allowed to create a conversation here!",
        });
      }

      await ctx.db.supportConversation.create({
        data: {
          supportTicketId: input.supportTicketId,
        },
      });
    }),
  getConversationUser: protectedProcedure
    .input(GetConversationValidator)
    .query(async ({ ctx, input }) => {
      if (!input.conversationId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Conversation Id not provided!",
          cause: "Validation Error",
        });
      }

      const conversation = await ctx.db.supportConversation.findUnique({
        where: {
          id: input.conversationId,
        },
        select: {
          messages: true,
        },
      });

      if (!conversation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversation not found!",
          cause: "Conversation does not exist in the database",
        });
      }

      return conversation.messages;
    }),
  getConversationAdmin: ultraProtectedProcedure
    .input(GetConversationAdminValidator)
    .query(async ({ ctx, input }) => {
      const conversation = await ctx.db.supportConversation.findFirst({
        where: {
          supportTicketId: input.ticketId,
        },
        select: {
          id: true,
          messages: true,
          supportTicket: {
            select: {
              userId: true,
              reason: {
                select: {
                  reason: true,
                  description: true,
                  supportReason: {
                    select: {
                      title: true,
                      description: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!conversation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversation not found!",
          cause: "Conversation does not exist in the database",
        });
      }

      return conversation;
    }),
});

export default supportConversationRouter;
