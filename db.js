import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "";

const dbConnection = async () => {
  try {
    console.log("Mongo:", MONGO_URI);
    
    await mongoose.connect(MONGO_URI, {});
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default dbConnection;
