import mongoose from "mongoose";

// import config
import { MONGO_CONFIG } from "./config.js";

// ! mongo db connection function

export const connectDB = async () => {
      if (!MONGO_CONFIG.uri) {
      throw new Error("MONGO_CONFIG.uri is missing!");
    }
  
  try {


    await mongoose.connect(MONGO_CONFIG.uri, {
      dbName: MONGO_CONFIG.db_name,
      autoCreate: true,
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // Stop server if DB fails
  }
};
