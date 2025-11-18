import express from "express";

const router = express.Router();

import { USER_ROLES } from "../constants/enums.constant.js";

import {
  create
} from "../controllers/wishlist.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";

// Add to wishlist authenticated route
router.post(
  "/:productId",
  authenticate([USER_ROLES.USER]),
  create
);
// Get wishlist
router.get("/", authenticate([USER_ROLES.USER]), getAll);

// clear wishlist
router.delete("/wishlist", authenticate([USER_ROLES.USER]), clear);


export default router;