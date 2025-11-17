import express from "express";

import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

import { uploadFile } from "../middlewares/multer.middleware.js";

// use file upload middleware
const uploader = uploadFile();

// router instance
const router = express.Router();

// create category route
router.post("/", uploader.single("image"), createCategory);

// get all categories route
router.get("/", getAllCategories);

// get category by id route
router.get("/:id", getCategoryById);

// update category route
router.put("/:id", uploader.single("image"), updateCategory);

// delete category route
router.delete("/:id", deleteCategory);

export default router;
