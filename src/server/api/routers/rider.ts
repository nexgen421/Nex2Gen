import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const riderRouter = createTRPCRouter({
  createContactUser: protectedProcedure
    .input(
      z.object({
        courierType: z.enum([
          "DELHIVERY",
          "ECOMEXPRESS",
          "XPRESSBEES",
          "SHADOWFAX",
        ]),
        name: z.string(),
        phone: z.string(),
        role: z.enum([
          "PICKUP_BOY_1",
          "PICKUP_BOY_2",
          "PICKUP_BOY_3",
          "PICKUP_BOY_4",
          "HUB_INCHARGE",
          "ZONAL_SALES_MANAGER",
        ]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { courierType, name, phone, role } = input;

      try {
        // Check if courier contacts exist for the user
        const courierContacts = await ctx.db.courierContacts.findUnique({
          where: {
            userId: ctx.session.user.id,
          },
          include: {
            contacts: {
              where: {
                courierType: courierType,
                role: role,
              },
            },
          },
        });

        if (!courierContacts) {
          // Create new courier contacts entry with the first contact
          return await ctx.db.courierContacts.create({
            data: {
              userId: ctx.session.user.id,
              contacts: {
                create: {
                  courierType,
                  name,
                  phone,
                  role,
                },
              },
            },
            include: {
              contacts: true,
            },
          });
        } else {
          // Check if contact with same courier type and role already exists
          const existingContact = courierContacts.contacts[0];

          if (existingContact) {
            // Update existing contact
            return await ctx.db.courierContacts.update({
              where: {
                id: courierContacts.id,
              },
              data: {
                contacts: {
                  update: {
                    where: {
                      id: existingContact.id,
                    },
                    data: {
                      name,
                      phone,
                    },
                  },
                },
              },
              include: {
                contacts: true,
              },
            });
          } else {
            // Add new contact to existing courier contacts
            return await ctx.db.courierContacts.update({
              where: {
                id: courierContacts.id,
              },
              data: {
                contacts: {
                  create: {
                    courierType,
                    name,
                    phone,
                    role,
                  },
                },
              },
              include: {
                contacts: true,
              },
            });
          }
        }
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create/update courier contact",
            cause: error,
          });
        }
        throw error;
      }
    }),

  // Get all contacts for a user
  getContacts: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db.courierContacts.findUnique({
        where: {
          userId: ctx.session.user.id,
        },
        include: {
          contacts: true,
        },
      });
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch courier contacts",
      });
    }
  }),

  // Get contacts by courier type
  getContactsByCourierType: protectedProcedure
    .input(
      z.object({
        courierType: z.enum([
          "DELHIVERY",
          "ECOMEXPRESS",
          "XPRESSBEES",
          "SHADOWFAX",
        ]),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const courierContacts = await ctx.db.courierContacts.findUnique({
          where: {
            userId: ctx.session.user.id,
          },
          include: {
            contacts: {
              where: {
                courierType: input.courierType,
              },
            },
          },
        });

        return courierContacts?.contacts ?? [];
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch courier contacts",
        });
      }
    }),
});

export default riderRouter;
