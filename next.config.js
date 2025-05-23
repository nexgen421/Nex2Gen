/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, // Skip type-checking during the build
  },
  images: {
    remotePatterns: [
      {
        hostname: "nexgencourierservice.s3.ap-south-1.amazonaws.com",
      },
    ],
  },
};

export default config;
