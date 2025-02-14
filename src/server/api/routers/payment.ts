import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import axios from 'axios';
import { TRPCError } from "@trpc/server";
// const QueryTestValidator = z.object({
//   message: z.string(),
// });



const paymentRouter = createTRPCRouter({
  paymentCreate: publicProcedure
    .input(
      z.object({
        amount: z.string(),
        order_id: z.string(),
        customerEmail: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const formData = new FormData();
      formData.append('user_token', '1e718255af0d6dc004e4e2d860a90c6f');
      formData.append('amount', input.amount);
      formData.append('order_id', input.order_id);
      formData.append('redirect_url', 'https://nex2-gen-cefs.vercel.app/dashboard');
      formData.append('remark1', ctx.session?.user.email);
      formData.append('remark2', ctx.session?.user.name);

      try {
        const response = await axios.post('https://pay.imb.org.in/api/create-order', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
        if (response.data?.status) {
          const wallet = await ctx.db.wallet.findUnique({
            where: {
              userId: ctx.session?.user.id,
            },
          });

          if (!wallet) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "No wallet associated with given user",
            });
          }

          await ctx.db.walletRequest.create({
            data: {
              amount: Number(input.amount),
              referenceNumber: input.order_id,
              wallet: {
                connect: {
                  id: wallet.id,
                },
              },
            },
          });

        }
        return { data: response.data?.result?.payment_url };  // return the data from the API
      } catch (error) {
        console.error(error, "Error while adding funds");
        throw new Error("Failed to create payment order");
      }
    }),
});


export default paymentRouter;
