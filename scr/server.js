// importing dotenv
import dotenv from "dotenv";
dotenv.config();

// importing express  


import express from "express";

//* import database connection
import { connectDB } from "./config/db.config.js";

// * importing auth routes
import authRoutes from "./routes/auth.route.js";

// * importing user routes
import userRoutes from "./routes/user.route.js";

// * importing category routes
import categoryRoutes from "./routes/category.route.js";

// * importing brand routes
import brandRoutes from "./routes/brand.route.js";


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

// ! using routes middleware
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);

// ! error handling middleware
// * import error handler middleware
import { errorHandler } from "./middlewares/error_handler.middleware.js";

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


