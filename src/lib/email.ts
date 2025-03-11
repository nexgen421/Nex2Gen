import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import { env } from "~/env";
import LinkVerification from "./email-templates/LinkVerification";

const baseUrl = process.env.VERCEL_URL
  ? process.env.VERCEL_URL
  : `https://www.nexgencourierservice.in`;

export const sendVerificationEmail = async (
  to: string,
  subject: string,
  token: string,
  userFullName: string,
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASSWORD,
      },
    });

    const otpEmail = await render(
      LinkVerification({
        userFirstName: userFullName,
        verificationLink: `${baseUrl}/register/verify-token?token=${token}&email=${to}`,
      }),
    );

    await transporter.sendMail({
      to: to,
      subject: subject,
      html: otpEmail,
      from: env.EMAIL_FROM,
    });
  } catch (error) {
    throw error;
  }
};

export const sendForgotPasswordEmail = async (
  to: string,
  subject: string,
  token: string,
  timestamp: number,
  userFullName: string,
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASSWORD,
      },
    });

    const otpEmail = await render(
      LinkVerification({
        verificationLink: `${baseUrl}/forgot-password/change-password?token=${token}&email=${to}&timestamp=${timestamp}`,
        userFirstName: userFullName,
      }),
    );

    await transporter.sendMail({
      to: to,
      subject: subject,
      html: otpEmail,
      from: env.EMAIL_FROM,
    });
  } catch (error) {
    throw error;
  }
};
