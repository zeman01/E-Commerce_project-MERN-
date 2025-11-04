import dotenv from "dotenv";


import express from "express";

//* import database connection
import { connectDB } from "./config/db.config.js";

// * importing auth routes
import authRoutes from "./routes/auth.route.js";

// app instance
const app = express();

// port number
const PORT = process.env.PORT 
;

// ** connect to database
connectDB();

// using json middleware
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running successfully",
  });
});

// ! using routes middleware
app.use("/api/auth", authRoutes);

// error handling middleware
app.use((error, req, res, next) => {
  const message = error?.message || "Something went wrong";


  // give proper status code
  const statusCode = error?.status || 500;


  res.status(statusCode).json({
    message: message,
    status: "error",
    success: false,
    data: null,
    original
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
