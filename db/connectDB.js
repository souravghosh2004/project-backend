import mongoose from "mongoose";
import { DB_NAME } from "../constation.js";

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(`${process.env.MONGO_DB_URI}/${DB_NAME}`);
        console.log("Welcome to the database ",connect.connection.host);
    } catch (error) {
        console.log("Database connection failed !!!!!",error);
        process.exit(1);
    }
}

export default connectDB;