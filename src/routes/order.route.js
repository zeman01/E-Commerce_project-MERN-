import express from "express";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { USER_ROLES } from "../constants/enums.constant.js";
import {
  create,
  cancel,
  getOrders,
  updateOrderStatus,
  changeOrderAddress,
  getAllOrders,
} from "../controllers/order.controller.js";

const router = express.Router();

// place order
router.post("/", authenticate(USER_ROLES.USER), create);

// cancel order
router.put("/:orderId", authenticate(USER_ROLES.USER), cancel);

// get all orders (admin)
router.get("/", authenticate(USER_ROLES.ADMIN), getAllOrders);

// update order status (admin)
router.put(
  "/:orderId/status",
  authenticate(USER_ROLES.ADMIN),
  updateOrderStatus
);

// change order address
router.put(
  "/:orderId/address",
  authenticate(USER_ROLES.USER),
  changeOrderAddress
);

// get user orders
router.get("/user", authenticate(USER_ROLES.USER), getOrders);

export default router;
