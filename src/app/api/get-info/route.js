import { ErrorResponse, SuccessResponse } from "@/lib/apiResponse";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/user.model";
import { usernameValidation } from "@/schemas/signUpSchema";


export async function GET(request){
    await dbConnect();
    try {
      const { searchParams } = new URL(request.url);
      const queryParam = {
        username: searchParams.get("username"),
      };

          const username = queryParam.username;

      if (!username) {
        return Response.json(ErrorResponse("Username required"), {
          status: 400,
        });
      }

      const user = await UserModel.findOne({ username });

      if (!user) {
        return Response.json(ErrorResponse("User not found"), {
          status: 404,
        });
      }

      // mask the email
      const [initialLetters, domain] = [user.email[0] + user.email[1], user.email.split("@")[1]];
      const maskedEmail = `${initialLetters}****@${domain}`;
      const codeExpiry = user.verifyCodeExpiry;

      return Response.json(
        SuccessResponse("Masked email send successfully", { maskedEmail, codeExpiry }),
        { status: 200 }
      );
    } catch (error) {
        console.error("Error: while sending masked email", err);
        return Response.json(ErrorResponse("Error: while sending masked email"), {
          status: 500,
        });
    }
}