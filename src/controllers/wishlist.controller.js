import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Wishlist from "../models/wishlist.model.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import CustomError from "../middlewares/error_handler.middleware.js";

//* get wishlist
export const getWishlist = asyncHandler(async (req, res) => {
  const { product_Id } = req;

  const wishlist = await Wishlist.findOne({ user: userId }).populate(
    "products"
  );

  res.status(200).json({
    message: "Wishlist fetched",
    status: "success",
    data: wishlist,
  });
});

// create wishlist
export const create = asyncHandler(async (req, res) => {
  const { product_Id } = req;
  const { _id: user } = req.User;
  let wishlist = null;
  let newWishlist = null;

  const product = await Product.findById(product_Id);
  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  //   check if wishlist exists
  wishlist = await Wishlist.findOne({ user, product: product._id });

  if (wishlist) {
    await Wishlist.deleteOne();

    //   remove product from wishlist

    res.status(201).json({
      message: "Wishlist created",
      status: "success",
      data: wishlist,
    });
  }
});

// toggle wishlist
export const toggleWishlist = asyncHandler(async (req, res) => {
  const { product_Id } = req;
  const { _id: user } = req.User;

  const product = await Product.findById(product_Id);
  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  let wishlist = await Wishlist.findOne({ user });

  if (!wishlist) {
    // create wishlist
    wishlist = await Wishlist.create({ user, products: product._id });
  } else {
    // update wishlist
    const productIndex = wishlist.products.indexOf(product._id);
    if (productIndex > -1) {
      // product exists in wishlist, remove it
      wishlist.products.splice(productIndex, 1);
    } else {
      // product not in wishlist, add it
      wishlist.products.push(product._id);
    }
    await wishlist.save();
  }

  res.status(200).json({
    message: "Wishlist updated",
    status: "success",
    data: wishlist,
  });
});


// getAll wishlists
export const getAll = asyncHandler(async (req, res) => {

  const user = req.User._id
  const wishlists = await Wishlist.find(user).populate("User").populate("Products");

  res.status(200).json({
    message: "All wishlists fetched",
    status: "success",
    data: lists,
  });
});

// clear wishlist
export const clear = asyncHandler(async (req, res) => {
 const user = req.User._id;
 const deleted = await Wishlist.deleteMany({user});

 if(!deleted){
    throw new CustomError("Error clearing list",404);
 }
  res.status(200).json({  
    message: "Wishlist cleared",
    status: "success",
    data: null
  });
});