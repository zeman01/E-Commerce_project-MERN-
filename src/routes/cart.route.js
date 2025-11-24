import express from "express";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { USER_ROLES } from "../constants/enums.constant.js";

// router instance
const router = express.Router();

import {
  create,
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controller.js";

// create cart route
router.post("/", authenticate(USER_ROLES.USER), create);

// get cart route
router.get("/", authenticate(USER_ROLES.USER), getCart);

// add to cart route
router.post("/",  authenticate(USER_ROLES.USER), addToCart);

// update cart item route
router.put("/:itemId", authenticate(USER_ROLES.USER), updateCartItem);

// remove cart item route
router.delete("/:itemId", authenticate(USER_ROLES.USER), removeCartItem);

// clear cart route
router.delete("/", authenticate(USER_ROLES.USER), clearCart);

export default router;
