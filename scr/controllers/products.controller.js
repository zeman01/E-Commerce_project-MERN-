

import Product from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { uploadToCloudinary } from "../utils/cloudinary.utils.js";
import CustomError from "../middlewares/error_handler.middleware.js";

// get all products
export const getAll = asyncHandler(async (req, res, next) => {
  const products = await Product.find({})
    .populate("category")
    .populate("brand");

  if (!products) {
    throw new CustomError("No products found", 404);
  }

  res.status(200).json({
    message: "Products fetched successfully",
    status: "success",
    data: products,
  });
});

// get product by id
export const getById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id)
    .populate("category")
    .populate("brand");

  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  res.status(200).json({
    message: "Product fetched successfully",
    status: "success",
    data: product,
  });
});

// create new product
export const create = asyncHandler(async (req, res, next) => {
  let imageUrl;
  if (req.file) {
    imageUrl = await uploadToCloudinary(req.file.path, "products");
  }

  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    brand: req.body.brand,
    image: imageUrl ? imageUrl.secure_url : undefined,
  });

  await product.save();

  res.status(201).json({
    message: "Product created successfully",
    status: "success",
    data: product,
  });
});

// update product
export const update = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let imageUrl;

  if (req.file) {
    imageUrl = await uploadToCloudinary(req.file.path, "products");
  }

  const updatedData = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    brand: req.body.brand,
  };

  if (imageUrl) {
    updatedData.image = imageUrl.secure_url;
  }

  const product = await Product.findByIdAndUpdate(id, updatedData, {
    new: true,
  });

  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  res.status(200).json({
    message: "Product updated successfully",
    status: "success",
    data: product,
  });
});

// delete product
export const remove = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  res.status(200).json({
    message: "Product deleted successfully",
    status: "success",
    data: null,
  });
});