// importing dotenv
import dotenv from "dotenv";
dotenv.config();

// importing express  
import express from "express";

//* import database connection
import { connectDB } from "./config/db.config.js";

// importing cookie parser
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


// app instance
const app = express();

// port number
const PORT = process.env.PORT || 5000
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

// ! using routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/brands", brandRoutes);
// app.use("/api/wishlist",wishlistRoutes)

// ! error handling middleware

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


