import mongoose from "mongoose";
import dotenv from "dotenv";
import {ENV} from "../lib/env.js";

dotenv.config();

const connectDB = async () => {
    
    if(mongoose.connection.readyState >= 1){
        return;
    }

    mongoose.connect(ENV.MONGODB_URL)
    .then(() => {
        console.log("Connected successfully to the database");
    })
    .catch((error) => {
        console.error("Error connecting to the database:", error);
    })
}

export default connectDB;