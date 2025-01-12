import { sendVerificationEmail } from "~/lib/email";

export const sendMagicLink = async (
  email: string,
  token: string | null | undefined,
  userFullName: string,
) => {
  try {
    if (!token) {
      throw new Error("Token is missing");
    }
    await sendVerificationEmail(
      email,
      "Email Verification for Nex Gen Courier Service",
      token,
      userFullName,
    );
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send OTP");
  }
};
