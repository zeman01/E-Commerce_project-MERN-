import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  dbName: process.env.DB_NAME,
  serverSelectionTimeoutMS: 5000,
})
.then(() => console.log("DB connected!"))
.catch(err => console.error("DB connection failed:", err));
