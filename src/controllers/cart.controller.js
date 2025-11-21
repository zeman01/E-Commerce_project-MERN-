

import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import CustomError from "../middlewares/error_handler.middleware.js";


// * get cart
export const getCart = asyncHandler(async (req, res) => {
  const { _id: userId } = req.User;

  const cart = await Cart.findOne({ user: userId }).populate("products.product");

  res.status(200).json({
    message: "Cart fetched",
    status: "success",
    data: cart,
  });
});

// add to cart
export const addToCart = asyncHandler(async (req, res) => {
  const { product_Id, quantity } = req.body;
  const { _id: user } = req.User;

  const product = await Product.findById(product_Id);
  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  let cart = await Cart.findOne({ user });

  if (!cart) {
    cart = new Cart({ user, products: [] });
  }

  const productIndex = cart.products.findIndex(
    (item) => item.product.toString() === product_Id
  );

  if (productIndex > -1) {
    cart.products[productIndex].quantity += quantity;
  } else {
    cart.products.push({ product: product_Id, quantity });
  }

  await cart.save();

  res.status(201).json({
    message: "Product added to cart",
    status: "success",
    data: cart,
  });
});

