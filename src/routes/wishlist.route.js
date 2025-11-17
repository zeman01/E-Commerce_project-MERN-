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
router.get("/wishlist", authenticate, getWishlist);

// // Remove from wishlist
router.delete("/wishlist/:productId", authenticate, removeFromWishlist);

export default router;