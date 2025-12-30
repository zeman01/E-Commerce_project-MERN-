import express from "express";

// router instance
const router = express.Router();

import {
  create,
  getAll,
  getById,
  update,
  remove,
} from "../controllers/product.controller.js";

import { uploadFile } from "../middlewares/multer.middleware.js";

// use file upload middleware
const uploader = uploadFile();

// create product route
router.post(
  "/",
  uploader.fields([
    { name: "cover_image", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  create
);

// get all products route
router.get("/",getAll);

// get product by id route
router.get("/:id", getById);

// update product route
router.put("/:id", uploader.single("image"), update);

// delete product route
router.delete("/:id", remove);

export default router;
