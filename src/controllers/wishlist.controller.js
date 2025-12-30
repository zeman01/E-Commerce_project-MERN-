import CustomError from "../middlewares/error_handler.middleware.js";
import Product from "../models/product.model.js";
import Wishlist from "../models/wishlist.model.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";

//* create
export const create = asyncHandler(async (req, res) => {
  //
  const { product_id } = req.body;
  const { _id: user } = req.user;
  let wishlist = null;
  let new_wishlist = null;
  const product = await Product.findById(product_id);

  if (!product) {
    throw new CustomError("Product not found", 404);
  }
  // check if wishlist already exists

  wishlist = await Wishlist.findOne({ user, product: product_id });

  if (wishlist) {
    await wishlist.deleteOne();
  } else {
    new_wishlist = await Wishlist.create({ user, product: product._id });
  }

  res.status(201).json({
    message: `${product.name} ${
      wishlist ? "removed from wishlist" : "Added to wishlist"
    }`,
    data: new_wishlist,
    status: "success",
  });
});

// get all -> authenticate route -> only user
export const getAll = asyncHandler(async (req, res) => {
  const user = req.user._id;

  const lists = await Wishlist.find({ user })
  .populate("user")
    .populate({
      path: "product",
      populate: {
        path: 'category brand',
      },   
    })
   

  res.status(200).json({
    message: "Wishlist fetched",
    data: lists,
    staus: "success",
  });
});

// clear all
export const clear = asyncHandler(async (req, res) => {
  const user = req.user._id;

  const deleted = await Wishlist.deleteMany({ user });

  if (!deleted) {
    throw new CustomError("Error clearing list", 500);
  }

  res.status(200).json({
    message: "Wishlist cleared",
    data: null,
    staus: "success",
  });
});
