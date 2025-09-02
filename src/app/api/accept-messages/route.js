import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { ErrorResponse, SuccessResponse } from "@/lib/apiResponse";

export async function POST(request) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!session && !session.user) {
      return Response.json(ErrorResponse("Unauthorized,Please login first"), {
        status: 401,
      });
    }

    const userId = user._id;
    const { acceptMessages } = await request.json();

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        ErrorResponse("Failed to update message permission"),
        { status: 401 }
      );
    }

    return Response.json(SuccessResponse("Updated messages permission"), {
      status: 200,
    });
  } catch (err) {
    console.error("Error: while toggling message permission", err);
    return Response.json(
      ErrorResponse("Error: while toggling message permission"),
      { status: 500 }
    );
  }
}

export async function GET(request) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!session && !session.user) {
      return Response.json(ErrorResponse("Unauthorized,Please login first"), {
        status: 401,
      });
    }

    const userId = user._id;

    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return Response.json(ErrorResponse("User not found"), { status: 404 });
    }

    return Response.json(
      SuccessResponse("message permission fetched successfully", {
        isAcceptingMessage: foundUser.isAcceptingMessage,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error("Error: while toggling message permission", err);
    return Response.json(
      ErrorResponse("Error: while toggling message permission"),
      { status: 500 }
    );
  }
}
