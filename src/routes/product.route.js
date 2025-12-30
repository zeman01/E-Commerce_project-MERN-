import express from "express";
const router = express.Router();

import {
  create,
  getAll,
  getById,
  update,
  remove,
  getAllFeatured,
  getNewArrivals,
  getByBrand,
  getByCategory,
} from "../controllers/product.controller.js";

import { uploadFile } from "../middlewares/multer.middleware.js";
const uploader = uploadFile();

// CREATE
router.post(
  "/",
  uploader.fields([
    { name: "cover_image", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  create
);

// LIST ALL
router.get("/", getAll);

// ⭐ MUST COME BEFORE ID ROUTE
router.get("/featured", getAllFeatured);
router.get("/new-arrivals", getNewArrivals);
router.get("/brand/:brand_id", getByBrand);
router.get("/category/:category_id", getByCategory);

// GET BY ID
router.get("/:id", getById);

// UPDATE
router.put("/:id", uploader.single("image"), update);

// DELETE
router.delete("/:id", remove);

export default router;
