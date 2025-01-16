import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import bcrypt from "bcrypt";
import { sendMagicLink } from "~/server/lib/send-verification-link";
import { randomUUID } from "crypto";
import { RedisOperator } from "~/server/lib/redis";
import { sendForgotPasswordLink } from "~/server/lib/send-forgot-password";
import { verify } from "hcaptcha";
import { env } from "~/env";

const ResendTokenValidator = z.object({
  email: z.string().email(),
});

const SubmitKYCValidator = z.object({
  // Banking Details
  // Company Details
  companyName: z.string(),
  companyEmail: z.string(),
  companyMobile: z.string(),
  companyType: z.string(),
  address: z.string(),
  pincode: z.number(),
  city: z.string(),
  state: z.string(),
  famousLandmark: z.string(),
  contactName: z.string(),
  contactMobile: z.string(),
  pickupName: z.string(),
  aadharNumber: z.string(),
  dob: z.date(),
  aadharHolderName: z.string(),
  panNumber: z.string(),
  panHolderName: z.string(),
  fatherName: z.string(),
});

const IsUserApprovedValidator = z.object({
  id: z.string(),
});

const RegisterValidator = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string(),
  mobile: z.string(),
  confirmPassword: z.string(),
  captchaToken: z.string(),
});

const VerifyTokenValidator = z.object({
  email: z.string().email(),
  token: z.string(),
});

const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(RegisterValidator)
    .mutation(async ({ ctx, input }) => {
      const {
        firstName,
        lastName,
        password,
        confirmPassword,
        email,
        mobile,
        captchaToken,
      } = input;

      // verify captcha token

      const captchaResponse = await verify(env.HCAPTCHA_SECRET, captchaToken);

      if (!captchaResponse.success) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Captcha Verification Failed!",
        });
      }

      // first check if user with that email is already present
      const user = await ctx.db.user.findFirst({
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

      if (password !== confirmPassword) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Password & Confirm Password don't match!",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await ctx.db.user.create({
        data: {
          email: email,
          password: hashedPassword,
          name: `${firstName} ${lastName}`,
          mobile:mobile,
          userVerificationDetails: {
            create: {
              token: randomUUID().toString(),
            },
          },
        },
        select: {
          userVerificationDetails: {
            select: {
              token: true,
            },
          },
          name: true,
          id: true,
        },
      });

      // Create wallet now
      await ctx.db.wallet.create({
        data: {
          user: {
            connect: {
              id: newUser.id,
            },
          },
        },
      });

      const defaultRateList = await ctx.db.defaultRate.findFirst({
        select: {
          halfKgPrice: true,
          oneKgPrice: true,
          twoKgPrice: true,
          threeKgPrice: true,
          fiveKgPrice: true,
          tenKgPrice: true,
          fifteenKgPrice: true,
          twentyFiveKgPrice: true,
          thirtyKgPrice: true,
          twentyKgPrice: true,
          fiftyKgPrice: true,
          fortyFiveKgPrice: true,
          fortyKgPrice: true,
          sevenKgPrice: true,
          seventeenKgPrice: true,
          thirtyFiveKgPrice: true,
          twelveKgPrice: true,
          twentyEightKgPrice: true,
          twentyTwoKgPrice: true,
        },
      });

      if (defaultRateList) {
        await ctx.db.rateList.create({
          data: {
            user: {
              connect: {
                id: newUser.id,
              },
            },
            ...defaultRateList,
          },
        });
      }

      await sendMagicLink(
        email,
        newUser.userVerificationDetails?.token,
        newUser.name,
      );

      return true;
    }),
  isUserApproved: publicProcedure
    .input(IsUserApprovedValidator)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: input.id,
        },
      });

      console.log({ user });
      return {
        isApproved: user?.isApproved,
        isKycSubmitted: user?.isKycSubmitted,
      };
    }),
  submitKYC: protectedProcedure
    .input(SubmitKYCValidator)
    .mutation(async ({ ctx, input }) => {
      // check for already present aadhar card

      const aadhar = await ctx.db.kycDetails.findFirst({
        where: {
          aadharInfo: {
            aadharNumber: input.aadharNumber,
          },
        },
      });

      if (aadhar) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Aadhar Number already present!",
        });
      }

      // check for already present pan card

      const pan = await ctx.db.kycDetails.findFirst({
        where: {
          panInfo: {
            panNumber: input.panNumber,
          },
        },
      });

      if (pan) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Pan Number already present!",
        });
      }

      await ctx.db.kycDetails.create({
        data: {
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          companyInfo: {
            create: {
              companyContactNumber: input.companyMobile,
              companyEmail: input.companyEmail,
              companyName: input.companyName,
              companyType: input.companyType,
            },
          },
          aadharInfo: {
            create: {
              aadharNumber: input.aadharNumber,
              dob: input.dob,
              holderName: input.aadharHolderName,
            },
          },
          panInfo: {
            create: {
              fatherName: input.fatherName,
              holderName: input.panHolderName,
              panNumber: input.panNumber,
            },
          },
        },
      });

      await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          isKycSubmitted: true,
        },
      });

      await ctx.db.user.update({
        data: {
          pickupLocation: {
            create: {
              address: input.address,
              pincode: input.pincode,
              city: input.city,
              state: input.state,
              famousLandmark: input.famousLandmark,
              contactName: input.contactName,
              mobileNumber: input.contactMobile,
              name: input.pickupName,
            },
          },
        },
        where: {
          id: ctx.session.user.id,
        },
      });
    }),
  verifyToken: publicProcedure
    .input(VerifyTokenValidator)
    .mutation(async ({ ctx, input }) => {
      const userDetails = await ctx.db.user.findFirst({
        where: {
          email: input.email,
        },
        select: {
          userVerificationDetails: {
            select: {
              token: true,
            },
          },
        },
      });

      if (userDetails?.userVerificationDetails?.token !== input.token) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Invalid Token!",
        });
      }

      await ctx.db.user.update({
        where: {
          email: input.email,
        },
        data: {
          emailVerified: new Date(Date.now()),
        },
      });

      return {
        message: "OTP Verified!",
      };
    }),
  resendOtp: publicProcedure
    .input(ResendTokenValidator)
    .mutation(async ({ input, ctx }) => {
      const userDetails = await ctx.db.user.findFirst({
        where: {
          email: input.email,
        },
        select: {
          userVerificationDetails: {
            select: { token: true },
          },
          name: true,
        },
      });

      if (!userDetails) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User with given email not found",
        });
      }
      await sendMagicLink(
        input.email,
        userDetails.userVerificationDetails?.token,
        userDetails.name,
      );
    }),
  forgotPassword: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          email: input.email,
        },
        select: {
          name: true,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User with given email not found",
        });
      }

      // send email with OTP that expires in 15 mins
      const redis = new RedisOperator();

      const token = randomUUID().toString();

      await redis.set(input.email, token, 300);
      const timestamp = Date.now();

      // send email with token

      await sendForgotPasswordLink(input.email, token, timestamp, user.name);

      return {};
    }),

  changePassword: publicProcedure
    .input(
      z.object({
        token: z.string(),
        email: z.string(),
        password: z.string(),
        confirmPassword: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const redis = new RedisOperator();

      const token = await redis.get(input.email);

      if (token !== input.token) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Invalid Token",
        });
      }

      if (input.password !== input.confirmPassword) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Password & Confirm Password don't match",
        });
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);

      await ctx.db.user.update({
        where: {
          email: input.email,
        },
        data: {
          password: hashedPassword,
        },
      });

      return true;
    }),
});

export default authRouter;
