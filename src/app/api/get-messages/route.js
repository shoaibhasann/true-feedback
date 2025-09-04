import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { ErrorResponse, SuccessResponse } from "@/lib/apiResponse";
import mongoose from "mongoose";

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
    console.log("session", session);
    console.log("user", user);
    // const userId = new mongoose.Types.ObjectId(user._id);
    const userId = user?._id;

    const foundUser = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!foundUser || foundUser.length === 0) {
      return Response.json(ErrorResponse("User not found"), { status: 404 });
    }

    return Response.json(
      SuccessResponse("Messages fetched successfully!", {
        messages: foundUser[0].messages,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error("Error: while fetching messages", err);
    return Response.json(ErrorResponse("Error: while fetching messages"), {
      status: 500,
    });
  }
}
