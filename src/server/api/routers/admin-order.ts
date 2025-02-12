import Tracker from "~/lib/tracking-more";
import { createTRPCRouter, ultraProtectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { type ShipmentStatus } from "@prisma/client";
import { type newShipmentStatus } from "@prisma/client";
import { type TrackingItem } from "~/lib/tracking-more/modules/types";
import { env } from "~/env";
import axios from 'axios';
import { randomBytes } from 'crypto';
const adminOrderRouter = createTRPCRouter({
  approveOrder: ultraProtectedProcedure
    .input(
      z.object({
        awbNumber: z.string(),
        // courierProvider: z.enum([
        //   "delhivery",
        //   "ecom-express",
        //   "xpressbees",
        //   "shadowfax",
        //   "valmo",
        // ]),
        courierProvider: z.string(),
        carrierId: z.string(),
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
              email: true,
              mobile: true,
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
          orderCustomerDetails: true,
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
                  newStatus: "pending"
                    .toString()
                    .toUpperCase() as keyof typeof newShipmentStatus,
                },
              },
            },
          });
          return;
        } catch (error) {
          throw error;
        }
      }

      // const tracker = new Tracker(env.TRACKINGMORE_API_KEY);

      try {
        // const response = await tracker.trackings.createTracking({
        //   courier_code: input.courierProvider,
        //   tracking_number: input.awbNumber,
        //   customer_name: `${order?.user.name} - ${order?.user?.kycDetails?.companyInfo?.companyName}`,
        // });

        // if (!response) {
        //   throw new TRPCError({
        //     code: "INTERNAL_SERVER_ERROR",
        //     message: "Error in approving orders",
        //   });
        // }

        // if (response.meta.code !== 200) {
        //   throw new TRPCError({
        //     code: "INTERNAL_SERVER_ERROR",
        //     message: response.meta.message,
        //   });
        // }
        // TODO: Remove this console.log after testing
        // console.log("TRACKINGMORE RESPONSE CREATED", response.data);
        const generateOrderId = () => {
          const buffer = randomBytes(16); // Generate 16 random bytes
          return buffer.toString('hex');


        }
        const obj = {
          "username": "Yofefa9755@wirelay.com",
          "password": "e10adc3949ba59abbe56e057f20f883e",
          "carrier_id": input.carrierId,
          "awb": input.awbNumber,
          "order_id": generateOrderId(),
          "first_name": order?.user.name,
          "last_name": `-${order?.user?.kycDetails?.companyInfo?.companyName}`,
          "email": order?.user?.email,
          "phone": order?.user.mobile ? order.user.mobile : "7257080852",
          "products": "N/A",
          "company": "Nex Gen Courier Service",
          "shipment_type": "1"
        }
        const response = await axios.post('https://shipway.in/api/PushOrderData', obj, {});
        if (response.data.status == 'Success') {
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
                  trackingId: obj.order_id,
                  status: 'INFORECEIVED',
                },
              },
            },
          });
        } else {

          // if (!response) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error in approving orders",
          });
          // }
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    }),
});

export default adminOrderRouter;
