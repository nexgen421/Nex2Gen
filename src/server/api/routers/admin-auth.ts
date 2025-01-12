import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, ultraProtectedProcedure } from "../trpc";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "~/env";

const CreateAdminValidator = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  password: z.string(),
  mobile: z.string()
});

const LoginAdminValidator = z.object({
  email: z.string().email(),
  password: z.string(),
});

const adminAuthRouter = createTRPCRouter({
  createAdmin: publicProcedure
    .input(CreateAdminValidator)
    .mutation(async ({ ctx, input }) => {
      // check if the given email is already present
      const { email, firstName, lastName, password } = input;
      const user = await ctx.db.admin.findFirst({
        where: {
          email: email,
        },
      });

      if (user) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "User with given email already present!",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await ctx.db.admin.create({
        data: {
          email: email,
          name: firstName + " " + lastName,
          password: hashedPassword,
          mobile: input.mobile, 
        },
      });

      return true;
    }),
  login: publicProcedure
    .input(LoginAdminValidator)
    .mutation(async ({ ctx, input }) => {
      const { email, password } = input;
      const user = await ctx.db.admin.findFirst({
        where: {
          email: email,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User with given email not found",
        });
      }

      if (user.approved === false) {
        throw new TRPCError({ code: "FORBIDDEN", message: "User not approved! Contact developer@nexgencourierservice.com" });
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Wrong Password",
        });
      }

      // create jwt
      const token = jwt.sign(user.id, env.ADMIN_AUTH_SECRET);

      return {
        token
      }
    }),
    fetchSession: ultraProtectedProcedure.query(async ({ ctx }) => {
        return ctx.session.user;
    })
});

export default adminAuthRouter;
