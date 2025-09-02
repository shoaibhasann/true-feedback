import { ErrorResponse, SuccessResponse } from "@/lib/apiResponse";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/user.model";


export async function POST(request){
    dbConnect();

    try {
        const { username, content } = await request.json();

        const userExists = await UserModel.findOne({username});

        if(!userExists){
            return Response.json(ErrorResponse("User not found"), { status: 404 });
        }

        if(!userExists.isAcceptingMessage){
            return Response.json(ErrorResponse("User isn't accepting messages"), {
              status: 400,
            });
        }

        const newMessage = {
            content,
            createdAt: new Date()
        };

        userExists.messages.push(newMessage);
        await userExists.save();

        return Response.json(SuccessResponse("Message sent successfully!", newMessage), {status: 200});


    } catch (err) {
      console.error("Error: while sending messages", err);
      return Response.json(ErrorResponse("Error: while sending message"), {
        status: 500,
      });
    }
}