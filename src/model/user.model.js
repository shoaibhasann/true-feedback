import mongoose, { Schema } from "mongoose";

// message schema
const messageSchema = new Schema({
    content: {
        type: String,
        required: [true, "message is required"]
    }, 
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});


// user schema
const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: [true, "username already exists"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "email already exists"],
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false
  },
  verifyCode: {
    type: String,
    default: false
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verification code expiry is required"]
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true
  },
  messages: [messageSchema]
});

// user model
const User = (mongoose.models.User) || mongoose.model("User", userSchema);

export default User;