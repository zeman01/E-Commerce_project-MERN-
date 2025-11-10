import express from "express";


// router instance
const router = express.Router();

import {
  createBrand,
  getAll,
  getById,
  updateBrand,
  deleteBrand,
} from "../controllers/brand.controller.js";

import { uploadFile } from "../middlewares/multer.middleware.js";

// use file upload middleware
const upload = uploadFile();

// create brand route
router.post("/", upload.single("image"), createBrand);

// get all brands route
router.get("/", getAll);

// get brand by id route
router.get("/:id", getById);

// update brand route
router.put("/:id", upload.single("image"), updateBrand);

// delete brand route
router.delete("/:id", deleteBrand);

export default router;