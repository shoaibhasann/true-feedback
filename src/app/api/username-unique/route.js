import { ErrorResponse, SuccessResponse } from "@/lib/apiResponse";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/user.model";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    // validate username with zod
    const result = usernameQuerySchema.safeParse(queryParam);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      const message =
        usernameErrors?.length > 0
          ? usernameErrors.join(", ")
          : "Invalid query parameters";
      return Response.json(ErrorResponse(message), { status: 400 });
    }

    const { username } = result.data;

    const isUserExists = await UserModel.findOne({ username });

    if (isUserExists) {
      return Response.json(ErrorResponse("Username already taken"), {
        status: 400,
      });
    }

    return Response.json(SuccessResponse("Username is available"), {
      status: 200,
    });
  } catch (err) {
    console.error("Error: validating username", err);
    Response.json(ErrorResponse("Error checking username"), { status: 500 });
  }
}
