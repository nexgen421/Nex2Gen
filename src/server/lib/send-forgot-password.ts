import { sendForgotPasswordEmail } from "~/lib/email";

export const sendForgotPasswordLink = async (
  email: string,
  token: string | null | undefined,
  timestamp: number,
  userFullName: string,
) => {
  try {
    if (!token) {
      throw new Error("Token is missing");
    }
    await sendForgotPasswordEmail(
      email,
      "Forgot Password for Nex Gen Courier Service",
      token,
      timestamp,
      userFullName,
    );
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send OTP");
  }
};
