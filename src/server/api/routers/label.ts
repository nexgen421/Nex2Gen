import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  ultraProtectedProcedure,
} from "../trpc";
import { TRPCError } from "@trpc/server";
import bwipjs from "bwip-js";
import { env } from "~/env";
const GetLabelByOrderIdValidator = z.object({
  awbNumber: z.string(),
});

const GetUserLabelByLrValidator = z.object({
  lrNumber: z.number(),
});

const labelRouter = createTRPCRouter({
  getLabelByOrderId: publicProcedure
    .input(GetLabelByOrderIdValidator)
    .mutation(async ({ ctx, input }) => {
      // Get company name first
      let orderDetails
       orderDetails = await ctx.db.order.findFirst({
        where: {
          shipment: {
            awbNumber: input.awbNumber,
          },
        },
        select: {
          id: true,
          pickupLocation: true,
          isInsured: true,
          orderCategory: true,
          orderDate: true,
          orderId: true,
          userAwbDetails: {
            select: {
              awbNumber: true,
            },
          },
          productName: true,
          paymentMode: true,
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
              name: true,
              email: true,
            },
          },
          orderValue: true,
          orderAdressDetails: {
            select: {
              city: true,
              state: true,
              streetName: true,
              famousLandmark: true,
              houseNumber: true,
              pincode: true,
            },
          },
          packageDetails: {
            select: {
              breadth: true,
              length: true,
              height: true,
              physicalWeight: true,
            },
          },
          orderCustomerDetails: {
            select: {
              customerMobile: true,
              customerName: true,
            },
          },
          shipment: {
            select: {
              awbNumber: true,
              courierProvider: true,
            },
          },
        },
      });
      // console.log(orderDetails)
      if (!orderDetails) {
         orderDetails = await ctx.db.order.findFirstOrThrow({
          where: {
            userAwbDetails: {
              awbNumber: Number(input.awbNumber) - +env.USER_AWB_OFFSET,
            },
            // userId: ctx.session.user.id,
          },
          select: {
            id: true,
            pickupLocation: true,
            isInsured: true,
            orderCategory: true,
            orderDate: true,
            orderId: true,
            userAwbDetails: {
              select: {
                awbNumber: true,
              },
            },
            productName: true,
            paymentMode: true,
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
                name: true,
                email: true,
              },
            },
            orderValue: true,
            orderAdressDetails: {
              select: {
                city: true,
                state: true,
                streetName: true,
                famousLandmark: true,
                houseNumber: true,
                pincode: true,
              },
            },
            packageDetails: {
              select: {
                breadth: true,
                length: true,
                height: true,
                physicalWeight: true,
              },
            },
            orderCustomerDetails: {
              select: {
                customerMobile: true,
                customerName: true,
              },
            },
            shipment: {
              select: {
                awbNumber: true,
                courierProvider: true,
              },
            },
          },
        });
        if(!orderDetails){
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "The requested order does not exist! Please Check the Order ID once again",
        });
        }
      }

      // await getPdfFromOrder(orderDetails);
      return { ...orderDetails, url: env.NEXTAUTH_URL };
    }),
  getUserLabelByLr: protectedProcedure
    .input(GetUserLabelByLrValidator)
    .mutation(async ({ ctx, input }) => {
      // Get company name first
      let orderDetails
      // if(String(input.lrNumber).length >! 8){
       orderDetails = await ctx.db.order.findFirstOrThrow({
        where: {
          userAwbDetails: {
            awbNumber: input.lrNumber - +env.USER_AWB_OFFSET,
          },
          userId: ctx.session.user.id,
        },
        select: {
          id: true,
          pickupLocation: true,
          isInsured: true,
          orderCategory: true,
          orderDate: true,
          orderId: true,
          userAwbDetails: {
            select: {
              awbNumber: true,
            },
          },
          productName: true,
          paymentMode: true,
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
              name: true,
              email: true,
            },
          },
          orderValue: true,
          orderAdressDetails: {
            select: {
              city: true,
              state: true,
              streetName: true,
              famousLandmark: true,
              houseNumber: true,
              pincode: true,
            },
          },
          packageDetails: {
            select: {
              breadth: true,
              length: true,
              height: true,
              physicalWeight: true,
            },
          },
          orderCustomerDetails: {
            select: {
              customerMobile: true,
              customerName: true,
            },
          },
          shipment: {
            select: {
              awbNumber: true,
              courierProvider: true,
            },
          },
        },
      });
    // }
      if (!orderDetails) {
        orderDetails = await ctx.db.order.findFirst({
          where: {
            shipment: {
              awbNumber: String(input.lrNumber),
            },
          },
          select: {
            id: true,
            pickupLocation: true,
            isInsured: true,
            orderCategory: true,
            orderDate: true,
            orderId: true,
            userAwbDetails: {
              select: {
                awbNumber: true,
              },
            },
            productName: true,
            paymentMode: true,
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
                name: true,
                email: true,
              },
            },
            orderValue: true,
            orderAdressDetails: {
              select: {
                city: true,
                state: true,
                streetName: true,
                famousLandmark: true,
                houseNumber: true,
                pincode: true,
              },
            },
            packageDetails: {
              select: {
                breadth: true,
                length: true,
                height: true,
                physicalWeight: true,
              },
            },
            orderCustomerDetails: {
              select: {
                customerMobile: true,
                customerName: true,
              },
            },
            shipment: {
              select: {
                awbNumber: true,
                courierProvider: true,
              },
            },
          },
        });
        if(!orderDetails){
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "The requested order does not exist! Please Check the Order ID once again",
        });
      }
      }

      // await getPdfFromOrder(orderDetails);
      return { ...orderDetails, url: env.NEXTAUTH_URL };
    }),
  getBarcode: publicProcedure
    .input(z.object({ data: z.string() }))
    .query(async ({ input }) => {
      const { data } = input;

      try {
        const barcodeBuffer = await bwipjs.toBuffer({
          bcid: "code128",
          text: data,
          scale: 3,
          height: 10,
          includetext: true,
          textxalign: "center",
        });

        return barcodeBuffer;
      } catch (error) {
        throw error;
      }
    }),
});

export default labelRouter;
