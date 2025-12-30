import express from "express";


// router instance
const router = express.Router();

import {
  create,
  getAll,
  getById,
  update,
  remove,
} from "../controllers/brand.controller.js";

import { uploadFile } from "../middlewares/multer.middleware.js";

// use file upload middleware
const upload = uploadFile();

// create brand route
router.post("/", upload.single("image"), create);

// get all brands route
router.get("/", getAll);

// get brand by id route
router.get("/:id", getById);

// update brand route
router.put("/:id", upload.single("image"), update);

// delete brand route
router.delete("/:id", remove);

export default router;