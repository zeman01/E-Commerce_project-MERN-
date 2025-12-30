import { asyncHandler } from "../utils/asyncHandler.utils.js";
import Cart from "../models/cart.model.js";
import CustomError from "../middlewares/error_handler.middleware.js";
import Order from "../models/order.model.js";
import { ORDER_STATUS } from "../constants/enums.constant.js";

// * create order
export const create = asyncHandler(async (req, res) => {
  // user_id  -> req.user
  const user = req.user._id;
  // shipping_address items  -> req.body
  const { shipping_address: address } = req.body;

  const shipping_address = JSON.parse(shipping_address) ?? {};

  // find cart
  const cart = await Cart.findOne({ user });

  if (!cart) {
    throw new CustomError("Cart is empty.", 400);
  }

  // total amount

  if (cart.items.length === 0) {
    throw new CustomError("Cart is empty.", 400);
  }

  const total_amount = cart.items.reduce((acc, item) => {
    return acc + Number(item.product.price) * Number(item.quantity);
  }, 0);

  // create order
  const order = new Order({
    user,
    shipping_address,
    items: cart.items,
    total_amount,
  });

  await order.save();

  // delete cart / empty cart
  await cart.deleteOne();

  // success
  res.status(201).json({
    message: "Order placed.",
    data: order,
    status: "success",
  });
});

//* cancel order
export const cancel = asyncHandler(async (req, res) => {
  const user = req.user._id;
  const { id } = req.params;

  const order = await Order.findOne({ _id: id, user });

  if (!order) {
    throw new CustomError("Order not found", 404);
  }

  if (order.status !== ORDER_STATUS.PENDING) {
    throw new CustomError("Order can not be canceled", 404);
  }

  order.status = ORDER_STATUS.CANCELED;

  await order.save();

  res.status(201).json({
    status: "success",
    data: order,
    message: "Order status changed to canceled",
  });
});

// admin filter -> status, price  , pagination
//* get all orders for admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user", "name email");

  res.status(200).json({
    status: "success",
    data: orders,
    message: "Orders fetched successfully",
  });
});

// user filter -> status, price , pagination
//* all user orders
export const getOrders = asyncHandler(async (req, res) => {
  const user = req.user._id;

  const orders = await Order.find({ user });

  res.status(200).json({
    status: "success",
    data: orders,
    message: "User orders fetched successfully",
  });
});

// admin
//* change status
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status: newStatus } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new CustomError("Order not found", 404);
  }

  order.status = newStatus;

  await order.save();

  res.status(200).json({
    status: "success",
    data: order,
    message: "Order status updated successfully",
  });
});


// user
//* change shipping address
export const changeOrderAddress = asyncHandler(async (req, res) => {
  const user = req.user._id;
  const { orderId } = req.params;
  const { shipping_address: newAddress } = req.body;

  const shipping_address = JSON.parse(newAddress) ?? {};

  const order = await Order.findOne({ _id: orderId, user });

  if (!order) {
    throw new CustomError("Order not found", 404);
  }

  if (order.status !== ORDER_STATUS.PENDING) {
    throw new CustomError("Order address can not be changed", 400);
  }

  order.shipping_address = shipping_address;

  await order.save();

  res.status(200).json({
    status: "success",
    data: order,
    message: "Order address updated successfully",
  });
});