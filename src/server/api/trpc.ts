import { parse } from "cookie";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";
import { env } from "~/env";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await getServerAuthSession();
  return {
    db,
    session,
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const ultraProtectedProcedure = t.procedure.use(
  async ({ ctx, next }) => {
    const cookies = ctx.headers.get("cookie");

    if (cookies === null) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const parsedCookies = parse(cookies);

    const token = parsedCookies["admin-token"];

    if (!token) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    const adminId = jwt.verify(token, env.ADMIN_AUTH_SECRET);

    const session = await ctx.db.admin.findUnique({
      where: {
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        id: adminId.toString(),
      },
      select: {
        id: true,
        email: true,
        image: true,
        name: true,
      },
    });

    if (!session) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "The user associated with given token not found",
      });
    }

    return next({
      ctx: {
        session: {
          ...ctx.session,
          user: session,
        },
      },
    });
  },
);

// export const rateLimitedProcedure = t.procedure.use()
