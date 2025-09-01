import mongoose from "mongoose";

const connection = {};

async function dbConnect(){
    if(connection.isConnected){
        console.log("Already connected to database");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "");
        connection.isConnected = db.connections[0].readyState;

        console.log("✅ Mongodb connected successfully!")
    } catch (error) {
        console.log("❌ Mongodb connection failed!", error);
        process.exit(1);
    }
}

export default dbConnect;