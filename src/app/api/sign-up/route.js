import dbConnect from "@/lib/dbConnect";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { ErrorResponse, SuccessResponse } from "@/lib/apiResponse";
import { UserModel } from "@/model/user.model";
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
      await dbConnect();

      const { email, username, password } = await request.json();

      const existingUserByUsername = await UserModel.findOne({
        username,
        isVerified: true,
      });

      if (existingUserByUsername) {
        return Response.json(ErrorResponse("Username already taken"), {
          status: 400,
        });
      }

      const existingUserByEmail = await UserModel.findOne({ email });
      const otp = Math.floor(100000 + Math.random() * 90000).toString();

      if (existingUserByEmail) {
        if(existingUserByEmail.isVerified){
            return Response.json(ErrorResponse("User already exists!"), { status: 400 });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyCode = otp;
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
            await existingUserByEmail.save();
        }
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);

        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        const newUser = new UserModel({
          username,
          email,
          password: hashedPassword,
          verifyCode: otp,
          verifyCodeExpiry: expiryDate,
          isAcceptingMessage: true,
          isVerified: false,
          messages: [],
        });

        await newUser.save();
      }

      // sending verification email
      const emailResponse = await sendVerificationEmail(email, username, otp);

      if (!emailResponse.success) {
        return Response.json(
          ErrorResponse(
            "Error: while sending verification email",
            emailResponse.message
          ),
          { status: 500 }
        );
      }

      return Response.json(
        SuccessResponse(
          "User registered successfully, Please verify your email"
        ),
        { status: 201 }
      );
  } catch (error) {
    console.error("Error: registering user", error);
    return Response.json(ErrorResponse("Error: registering user", error), {
      status: 500,
    });
  }
}
