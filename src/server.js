import express from "express";
import dotenv from "dotenv";

dotenv.config();

import { connectDB } from "./config/db.config.js";
import cors from "cors";
import cookieParser from "cookie-parser";

// * import error handler middleware
import { errorHandler } from "./middlewares/error_handler.middleware.js";

// ! importing routes
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import categoryRoutes from "./routes/category.route.js";
import brandRoutes from "./routes/brand.route.js";
import productRoutes from "./routes/product.route.js";
// import wishlistRoutes from "./routes/wishlist.route.js";

const PORT = process.env.PORT || 8080;
// app instance
const app = express();

// ** connect to database
connectDB();

// middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// test route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running successfully",
  });
});


// ! using routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/brands", brandRoutes);
// app.use("/api/wishlist",wishlistRoutes)

// ! error handling middleware
app.use(errorHandler);

// start server

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
