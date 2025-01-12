import {
  createTRPCRouter,
  publicProcedure,
  ultraProtectedProcedure,
} from "../trpc";
import Tracker from "~/lib/tracking-more";
import { env } from "~/env";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import moment from "moment";
import { type Shipment } from "@prisma/client";

interface TrackingData {
  customer_name: string;
  latest_milestone: string;
  order_status: string;
  awb_number: number;
  milestones:
    | {
        time: Date;
        message: string;
        location: string;
      }[]
    | undefined;
  shipment: Shipment | null;
}

const GetTrackingByOriginalAwbValidator = z.object({
  awbNumber: z.string(),
});

const CreateTrackingValidator = z.object({
  courier_code: z.string(),
  tracking_number: z.string(),
  customer_name: z.string().optional(),
  note: z.string().optional(),
  order_number: z.string().optional(),
  title: z.string().optional(),
});

const GetAllTrackingValidator = z.object({
  cursor: z.string().optional(),
});

const trackingRouter = createTRPCRouter({
  createTracking: ultraProtectedProcedure
    .input(CreateTrackingValidator)
    .mutation(async ({ input }) => {
      const tracker = new Tracker(env.TRACKINGMORE_API_KEY);

      const response = await tracker.trackings.createTracking({
        courier_code: input.courier_code,
        tracking_number: input.tracking_number,
        customer_name: input.customer_name,
        language: "en",
        note: input.note,
        order_number: input.order_number,
        title: input.title,
      });

      if (response?.meta.code === 200) {
        return true;
      } else {
        return false;
      }
    }),
  getAllTracking: ultraProtectedProcedure
    .input(GetAllTrackingValidator)
    .query(async ({ input }) => {
      const tracker = new Tracker(env.TRACKINGMORE_API_KEY);
      const resp = await tracker.trackings.getAllTrackings({
        cursor: +(input.cursor ?? 0),
      });

      if (resp?.meta.code === 200) {
        return resp.data;
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve all trackings",
        });
      }
    }),

  getTrackingByAwb: publicProcedure
    .input(z.object({ trackingNumber: z.number() }))
    .query(async ({ ctx, input }) => {
      // get tracking number first from the whole thing
      const response = await ctx.db.userAwbDetails.findFirst({
        where: {
          awbNumber: input.trackingNumber - +env.USER_AWB_OFFSET,
        },
        select: {
          order: {
            select: {
              id: true,
              shipment: true,
              orderDate: true,
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
          },
        },
      });

      if (!response) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "The Way Bill Number that you just entered does not exist. Double check the whole thing",
        });
      }

      const tracker = new Tracker(env.TRACKINGMORE_API_KEY);

      if (!response.order.shipment?.awbNumber) {
        const trackingResponseToSend: TrackingData = {
          awb_number: input.trackingNumber,
          customer_name: "",
          latest_milestone: `Order booked on ${moment(response.order.orderDate).format("Do-MMMM-YYYY h:mm A")}`,
          milestones: [
            {
              location: "",
              message: "Order Booked",
              time: response.order.orderDate,
            },
          ],
          order_status: "BOOKED",
          shipment: response.order.shipment,
        };

        return trackingResponseToSend;
      }

      console.log(response.order.shipment.awbNumber);

      const trackingResponse = await tracker.trackings.getTrackingByAWB(
        response.order.shipment?.awbNumber,
      );

      if (trackingResponse.meta.code === 200) {
        const trackingResponseToSend: TrackingData = {
          awb_number: input.trackingNumber,
          customer_name: trackingResponse.data[0]?.customer_name ?? "",
          latest_milestone: trackingResponse.data[0]?.latest_event ?? "",
          milestones: trackingResponse.data[0]?.origin_info.trackinfo.map(
            (milestone) => {
              return {
                location: milestone.location ?? "",
                message: milestone.tracking_detail ?? "",
                time: new Date(milestone.checkpoint_date) ?? new Date(),
              };
            },
          ),
          order_status: trackingResponse.data[0]?.status_info ?? "BOOKED",
          shipment: response.order.shipment,
        };

        trackingResponseToSend.milestones?.sort((a, b) => {
          // sort them according to the date
          return a.time.getTime() - b.time.getTime();
        });

        trackingResponseToSend.milestones?.reverse();

        trackingResponseToSend.milestones?.push({
          location: "",
          message: "Order Booked",
          time: response.order.orderDate,
        });

        trackingResponseToSend.milestones?.reverse();
        console.log(trackingResponseToSend);

        return trackingResponseToSend;
      } else {
        console.log(trackingResponse);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: trackingResponse.meta.message,
        });
      }
    }),

  getTrackingByOriginalAwb: ultraProtectedProcedure
    .input(GetTrackingByOriginalAwbValidator)
    .query(async ({ input }) => {
      const tracker = new Tracker(env.TRACKINGMORE_API_KEY);

      try {
        const trackingResponse = await tracker.trackings.getTrackingByAWB(
          input.awbNumber,
        );

        return trackingResponse;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error as string,
        });
      }
    }),
});

export default trackingRouter;
