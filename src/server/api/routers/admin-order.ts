import Tracker from "~/lib/tracking-more";
import { createTRPCRouter, ultraProtectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { type ShipmentStatus } from "@prisma/client";
import { type TrackingItem } from "~/lib/tracking-more/modules/types";
import { env } from "~/env";

const adminOrderRouter = createTRPCRouter({
  approveOrder: ultraProtectedProcedure
    .input(
      z.object({
        awbNumber: z.string(),
        courierProvider: z.enum([
          "delhivery",
          "ecom-express",
          "xpressbees",
          "shadowfax",
          "valmo",
        ]),
        dbOrderId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.db.order.findUnique({
        where: {
          id: input.dbOrderId,
        },
        select: {
          user: {
            select: {
              name: true,
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
        },
      });

      if (input.courierProvider === "valmo") {
        try {
          await ctx.db.order.update({
            where: {
              id: input.dbOrderId,
            },
            data: {
              status: "READY_TO_SHIP",
              shipment: {
                create: {
                  awbNumber: input.awbNumber,
                  courierProvider: input.courierProvider,
                  trackingId: "",
                  status: "pending"
                    .toString()
                    .toUpperCase() as keyof typeof ShipmentStatus,
                },
              },
            },
          });
          return;
        } catch (error) {
          throw error;
        }
      }

      const tracker = new Tracker(env.TRACKINGMORE_API_KEY);

      try {
        const response = await tracker.trackings.createTracking({
          courier_code: input.courierProvider,
          tracking_number: input.awbNumber,
          customer_name: `${order?.user.name} - ${order?.user?.kycDetails?.companyInfo?.companyName}`,
        });

        if (!response) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error in approving orders",
          });
        }

        if (response.meta.code !== 200) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: response.meta.message,
          });
        }
        // TODO: Remove this console.log after testing
        console.log("TRACKINGMORE RESPONSE CREATED", response.data);

        await ctx.db.order.update({
          where: {
            id: input.dbOrderId,
          },
          data: {
            status: "READY_TO_SHIP",
            shipment: {
              create: {
                awbNumber: input.awbNumber,
                courierProvider: input.courierProvider,
                trackingId: (response.data as Partial<TrackingItem>).id ?? "",
                status: response.data.delivery_status
                  .toString()
                  .toUpperCase() as keyof typeof ShipmentStatus,
              },
            },
          },
        });
      } catch (error) {
        console.log(error);
        throw error;
      }
    }),
});

export default adminOrderRouter;
