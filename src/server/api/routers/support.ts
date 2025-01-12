import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  ultraProtectedProcedure,
} from "../trpc";
import { TRPCError } from "@trpc/server";
import { env } from "~/env";

const FetchSubReasonsValidator = z.object({
  reasonId: z.number(),
});

const CreateTicketValidator = z.object({
  issue: z.string(),
  reasonId: z.number(),
  userAwbNumber: z.number().optional(),
});

const FetchTicketByIdValidator = z.object({
  ticketId: z.number(),
});

const ChangeTicketStatusValidator = z.object({
  ticketId: z.number(),
  status: z.enum(["OPEN", "RESOLVED", "CLOSED"]),
});

const FetchAllTicketsValidator = z.object({
  cursor: z.number().optional(),
  type: z.enum(["OPEN", "RESOLVED", "CLOSED"]),
});

const DeleteATicketValidator = z.object({
  id: z.number(),
});

const FetchAllUserTicketsValidator = z.object({
  variant: z.enum(["OPEN", "RESOLVED", "CLOSED"]),
});

const InterveneValidator = z.object({
  supportId: z.number(),
});

const supportRouter = createTRPCRouter({
  fetchAllTickets: ultraProtectedProcedure
    .input(FetchAllTicketsValidator)
    .query(async ({ ctx, input }) => {
      const tickets = await ctx.db.supportTicket.findMany({
        skip: (input.cursor ?? 0) * 10,
        take: 10,
        where: {
          ticketStatus: input.type,
        },
        select: {
          id: true,
          userId: true,
          ticketStatus: true,
          intervener: {
            select: {
              name: true,
              email: true,
            },
          },
          user: {
            select: {
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
          },
          userAwbDetails: {
            select: {
              order: {
                select: {
                  shipment: {
                    select: {
                      awbNumber: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return tickets;
    }),
  deleteATicket: ultraProtectedProcedure
    .input(DeleteATicketValidator)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.supportTicket.delete({
        where: {
          id: input.id,
        },
      });

      return true;
    }),
  fetchTicket: ultraProtectedProcedure
    .input(DeleteATicketValidator)
    .query(async ({ ctx, input }) => {
      const ticket = await ctx.db.supportTicket.findUnique({
        where: {
          id: input.id,
        },
      });

      return ticket;
    }),
  fetchUserTicket: protectedProcedure
    .input(DeleteATicketValidator)
    .query(async ({ ctx, input }) => {
      const ticket = await ctx.db.supportTicket.findUnique({
        where: {
          id: input.id,
        },
      });

      if (ticket?.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You can view tickets only which you have created!",
        });
      }
      return ticket;
    }),
  fetchAllUserTickets: protectedProcedure
    .input(FetchAllUserTicketsValidator)
    .query(async ({ ctx, input }) => {
      const variant = await new Promise<"OPEN" | "CLOSED" | "RESOLVED">(
        (resolve, reject) => {
          if (input.variant === "OPEN") {
            resolve("OPEN");
          } else if (input.variant === "CLOSED") {
            resolve("CLOSED");
          } else if (input.variant === "RESOLVED") {
            resolve("RESOLVED");
          } else {
            reject("input does not match the required params");
          }
        },
      );

      const tickets = await ctx.db.supportTicket.findMany({
        where: {
          ticketStatus: variant,
          userId: ctx.session.user.id,
        },
        select: {
          id: true,
          issue: true,
          ticketStatus: true,
          reason: {
            select: {
              description: true,
              reason: true,
              supportReason: {
                select: {
                  title: true,
                  description: true,
                },
              },
            },
          },
          timestamp: true,
          user: {
            select: {
              email: true,
            },
          },
          userId: true,
          conversation: true,
        },
      });

      return tickets;
    }),
  createTicket: protectedProcedure
    .input(CreateTicketValidator)
    .mutation(async ({ ctx, input }) => {
      const { issue, userAwbNumber } = input;

      const userAwbDetails = await ctx.db.userAwbDetails.findFirst({
        where: {
          awbNumber: userAwbNumber
            ? userAwbNumber - +env.USER_AWB_OFFSET
            : undefined,
          order: {
            userId: ctx.session.user.id,
          },
        },
      });

      if (!userAwbDetails) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The current awb does not exist on your account",
        });
      }

      await ctx.db.supportTicket.create({
        data: {
          issue: issue,
          ticketStatus: "OPEN",
          reason: {
            connect: {
              id: input.reasonId,
            },
          },
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          userAwbDetails: {
            connect: {
              id: userAwbDetails.id,
            },
          },
        },
      });
    }),
  intervene: ultraProtectedProcedure
    .input(InterveneValidator)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.supportTicket.update({
        where: {
          id: input.supportId,
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
  fetchTicketById: ultraProtectedProcedure
    .input(FetchTicketByIdValidator)
    .query(async ({ ctx, input }) => {
      const ticket = await ctx.db.supportTicket.findUnique({
        where: {
          id: input.ticketId,
        },
        select: {
          issue: true,
          reason: {
            select: {
              description: true,
              supportReason: true,
              reason: true,
            },
          },
          ticketStatus: true,
          timestamp: true,
          userId: true,
          intervener: {
            select: {
              name: true,
              email: true,
              id: true,
            },
          },
          user: {
            select: {
              name: true,
              email: true,
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
          },
          userAwbNumber: true,
        },
      });

      ticket?.userAwbNumber && (ticket.userAwbNumber += +env.USER_AWB_OFFSET);

      return ticket;
    }),
  changeTicketStatus: ultraProtectedProcedure
    .input(ChangeTicketStatusValidator)
    .mutation(async ({ ctx, input }) => {
      // first check if the user is intervening
      const ticket = await ctx.db.supportTicket.findUnique({
        where: {
          id: input.ticketId,
        },
        select: {
          intervener: true,
        },
      });

      if (ticket?.intervener?.id !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "First intervene then you can change the status of the ticket",
        });
      }

      // change the status now
      await ctx.db.supportTicket.update({
        where: {
          id: input.ticketId,
        },
        data: {
          ticketStatus: input.status,
        },
      });
    }),
  getAdminDashboardData: ultraProtectedProcedure.query(async ({ ctx }) => {
    const openTickets = await ctx.db.supportTicket.count({
      where: {
        ticketStatus: "OPEN",
      },
    });

    const resolvedTickets = await ctx.db.supportTicket.count({
      where: {
        ticketStatus: "RESOLVED",
      },
    });

    const closedTickets = await ctx.db.supportTicket.count({
      where: {
        ticketStatus: "CLOSED",
      },
    });

    return { openTickets, resolvedTickets, closedTickets };
  }),
  getAllReasons: protectedProcedure.query(async ({ ctx }) => {
    const reasons = await ctx.db.supportReason.findMany({});

    return reasons;
  }),
  fetchSubReasons: protectedProcedure
    .input(FetchSubReasonsValidator)
    .mutation(async ({ ctx, input }) => {
      const subReasons = await ctx.db.supportSubReason.findMany({
        where: {
          supportReasonId: input.reasonId,
        },
      });

      return subReasons;
    }),
});

export default supportRouter;
