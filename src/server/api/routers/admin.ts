import { z } from "zod";
import { createTRPCRouter, ultraProtectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

const FetchAllValidator = z.object({
    cursor: z.number().optional()
});

const ApproveAdminValidator = z.object({
    id: z.string()
})

const adminRouter = createTRPCRouter({
    fetchAll: ultraProtectedProcedure.input(FetchAllValidator).query(async ({ ctx, input }) => {
        const admins = ctx.db.admin.findMany({
            skip: (input.cursor ?? 0) * 10, 
            take: 10, 
            select: {
                id: true, 
                approved: true, 
                email: true, 
                name: true, 
                mobile: true, 
                image: true,
                createdAt: true
            }
        });

        return admins;
    }),
    approve: ultraProtectedProcedure.input(ApproveAdminValidator).mutation(async ({ ctx, input }) => {
        // check whether we are the owner
        const admin = await ctx.db.admin.findUnique({
            where: {
                id: ctx.session.user.id
            }
        });

        if (admin?.isOwner === false) {
            throw new TRPCError({ code: "UNAUTHORIZED", message: "You are not owner to approve this request" });
        }

        await ctx.db.admin.update({
            where: {
                id: input.id
            },
            data: {
                approved: true
            }
        });
    })
})

export default adminRouter;