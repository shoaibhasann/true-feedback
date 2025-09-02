import { ErrorResponse, SuccessResponse } from "@/lib/apiResponse";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/user.model";

export async function GET(request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();

    const user = await UserModel.findOne({
      username,
    });

    const isCodeVerified = user.VerifyCode === code;
    const isCodeNotExpired = new Date(user.VerifyCodeExpiry) > new Date();

    if (isCodeVerified && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(SuccessResponse("Account verified successfully"), {
        status: 200,
      });
    } else if (!isCodeNotExpired) {
      return Response.json(
        ErrorResponse("Verification code is expired, please signup again"),
        {
          status: 400,
        }
      );
    } else {
      return Response.json(ErrorResponse("Incorrect verification code"), {
        status: 400,
      });
    }
  } catch (err) {
    console.error("Error: while verifying account", err);
    return Response.json(ErrorResponse("Error: while verifying account"), {
      status: 500,
    });
  }
}
