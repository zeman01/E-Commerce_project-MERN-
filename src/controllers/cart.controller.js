import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import CustomError from "../middlewares/error_handler.middleware.js";

//! create cart
export const create = asyncHandler(async (req, res) => {
  const user = req.User._id;
  const { product_Id, quantity } = req.body;

  let cart = null;

  cart = await Cart.findOne({ user });

  // check if product exists
  const product = await Product.findById(product_Id);
  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  // if cart exists &  update it if it consists of the product
  if (cart) {
    const already_exists = cart.items.find(
      (item) => item.product.toString() === product._id.toString()
    );
    if (already_exists) {
      already_exists.quantity = Number(quantity);
    } else {
      cart.items.push({ product: product._id, quantity: Number(quantity) });
    }
  } else {
    cart = new Cart({
      user,
      items: [
        {
          product: product._id,
          quantity: Number(quantity),
        },
      ],
    });
  }

  await cart.save();

  res.status(201).json({
    message: "Product added to cart",
    data: cart,
    status: "success",
  });
});

// ! get cart
export const getCart = asyncHandler(async (req, res) => {
  const user = req.User._id;

  const cart = await Cart.findOne({ user })
    .populate("user")
    .populate({ "items.product": "product" });

  if (!cart) {
    throw new CustomError("Cart not found", 404);
  }

  //! total price calculation using forEach
  // let totalPrice = 0;
  // cart.items.forEach((item) => {
  //   totalPrice += item.product.price * item.quantity;
  // });

  //! total price calculation using reduce
  const totalPrice = cart.items.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);

  res.status(200).json({
    message: "Cart fetched",
    status: "success",
    data: cart,
  });
});

//! add to cart
export const addToCart = asyncHandler(async (req, res) => {
  const { product_Id, quantity } = req.body;
  const { _id: user } = req.User;

  const product = await Product.findById(product_Id);
  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  let cart = await Cart.findOne({ user });

  if (cart) {
    const already_exists = cart.items.find(
      (item) => item.product.toString() === product._id.toString()
    );
    if (already_exists) {
      already_exists.quantity = Number(quantity);
    } else {
      cart.items.push({ product: product._id, quantity: Number(quantity) });
    }
  } else {
    cart = new Cart({
      user,
      items: [
        {
          product: product._id,
          quantity: Number(quantity),
        },
      ],
    });
  }

  await cart.save();

  res.status(201).json({
    message: "Product added to cart",
    status: "success",
    data: cart,
  });
});

//! remove item from cart
export const removeCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { _id: user } = req.User;

  const cart = await Cart.findOne({ user });
  if (!cart) {
    throw new CustomError("Cart not found", 404);
  }

  const itemIndex = cart.items.findIndex(
    (item) => item._id.toString() === itemId.toString()
  );
  if (itemIndex === -1) {
    throw new CustomError("Item not found in cart", 404);
  }

  cart.items.splice(itemIndex, 1);
  await cart.save();

  res.status(200).json({
    message: "Item removed from cart",
    status: "success",
    data: cart,
  });
});

//! update cart item
export const updateCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  const { _id: user } = req.User;

  const cart = await Cart.findOne({ user });
  if (!cart) {
    throw new CustomError("Cart not found", 404);
  }

  const item = cart.items.find(
    (item) => item._id.toString() === itemId.toString()
  );
  if (!item) {
    throw new CustomError("Item not found in cart", 404);
  }

  item.quantity = Number(quantity);
  await cart.save();

  res.status(200).json({
    message: "Cart item updated",
    status: "success",
    data: cart,
  });
});

//! clear cart
export const clearCart = asyncHandler(async (req, res) => {
  const { _id: user } = req.User;

  const cart = await Cart.findOne({ user });
  if (!cart) {
    throw new CustomError("Cart not found", 404);
  }

  cart.products = [];
  await cart.save();

  res.status(200).json({
    message: "Cart cleared",
    status: "success",
    data: cart,
  });
});
