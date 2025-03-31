import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string() : z.string().url(),
    ),
    SHIP_24_API_KEY: z.string(),
    SHIP_24_URL: z.string(),
    ADMIN_AUTH_SECRET: z.string(),
    NEXT_AWS_S3_REGION: z.string(),
    NEXT_AWS_S3_ACCESS_KEY_ID: z.string(),
    NEXT_AWS_S3_SECRET_ACCESS_KEY: z.string(),
    NEXT_AWS_S3_BUCKET_NAME: z.string(),
    MONGO_URI: z.string(),
    INSURANCE_COST: z.number(),
    TRACKING_BACKEND_URL: z.string(),
    ADMIN_JWT_EXPIRY: z.string(),
    USER_AWB_OFFSET: z.string(),
    TRACKINGMORE_API_KEY: z.string(),
    EMAIL_USER: z.string(),
    EMAIL_FROM: z.string(),
    EMAIL_PASSWORD: z.string(),
    REDIS_URL: z.string(),
    WEBHOOK_SECRET: z.string(),
    ENCRYPTION_KEY: z.string(),
    HCAPTCHA_SECRET: z.string(),
    SHIPWAY_USERNAME: z.string(),
    SHIPWAY_PASSWORD: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_TRACKING_URL: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_TRACKING_URL: process.env.TRACKING_BACKEND_URL,
    SHIP_24_API_KEY: process.env.SHIP_24_API_KEY,
    SHIP_24_URL: process.env.SHIP_24_URL,
    ADMIN_AUTH_SECRET: process.env.ADMIN_AUTH_SECRET,
    NEXT_AWS_S3_ACCESS_KEY_ID: process.env.NEXT_AWS_S3_ACCESS_KEY_ID,
    NEXT_AWS_S3_REGION: process.env.NEXT_AWS_S3_REGION,
    NEXT_AWS_S3_SECRET_ACCESS_KEY: process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY,
    NEXT_AWS_S3_BUCKET_NAME: process.env.NEXT_AWS_S3_BUCKET_NAME,
    MONGO_URI: process.env.MONGO_URI,
    INSURANCE_COST: +(process.env.INSURANCE_COST ?? 0),
    TRACKING_BACKEND_URL: process.env.TRACKING_BACKEND_URL,
    ADMIN_JWT_EXPIRY: process.env.ADMIN_JWT_EXPIRY,
    USER_AWB_OFFSET: process.env.USER_AWB_OFFSET,
    TRACKINGMORE_API_KEY: process.env.TRACKINGMORE_API_KEY,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    REDIS_URL: process.env.REDIS_URL,
    WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    HCAPTCHA_SECRET: process.env.HCAPTCHA_SECRET,
    SHIPWAY_USERNAME: process.env.SHIPWAY_USERNAME,
    SHIPWAY_PASSWORD: process.env.SHIPWAY_PASSWORD,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
