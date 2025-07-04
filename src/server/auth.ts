import {
  getServerSession,
  type User,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { type Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "~/env";
import { db } from "~/server/db";
import bcrypt from "bcrypt";
import { z, ZodError } from "zod";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      approved: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    // ...other properties
    approved: boolean;
  }
}

const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      console.log(token);
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },
  secret: env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    newUser: "/register",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const cred = await loginSchema.parseAsync(credentials);

          const user = await db.user.findFirst({
            where: { email: cred.email },
            select: {
              password: true,
              id: true,
              email: true,
              image: true,
              name: true,
            },
          });

          if (!user) {
            throw new Error("User not found");
          }

          const isValidPassword = bcrypt.compareSync(
            cred.password,
            user.password,
          );

          if (!isValidPassword) {
            throw new Error("Invalid Password");
          }

          return {
            id: user.id,
            email: user.email,
            image: user.image,
            name: user.name,
          } as User;
        } catch (error) {
          if (error instanceof ZodError) {
            throw new Error(error.message);
          } else {
            throw error;
          }
        }
      },
    }),
    // ...add more providers here
  ],
  adapter: PrismaAdapter(db) as Adapter,
  session: {
    strategy: "jwt",
  },
  jwt: {
    maxAge: 365 * 86400,
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
