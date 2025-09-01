import { Resend } from "resend";
import VerificationEmail from "../../emails/VerificationEmail.jsx";
import { ErrorResponse, SuccessResponse } from "@/lib/apiResponse.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailVerification(email, username, verifyCode) {
  try {
    await resend.emails.send({
      from: "oboarding@resend.dev",
      to: email,
      subject: "Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    return SuccessResponse("Verification email send successfully");
  } catch (emailError) {
    console.error("Error: sending verification email", emailError);
    return ErrorResponse("Error while sending verification email", emailError);
  }
}
