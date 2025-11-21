import Category from "../models/category.model.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { uploadToCloudinary } from "../utils/cloudinary.utils.js";
import CustomError from "../middlewares/error_handler.middleware.js";

// create category
export const createCategory = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;
  const file = req.file;

  const category = new Category({ name, description });

  //   image upload
  if (file) {
    const { path, public_id } = await uploadToCloudinary(
      file.path,
      "/categories"
    );
    category.image = {
      path,
      public_id,
    };
  }

  //   save category
  await category.save();

  res.status(201).json({
    message: "Category created successfully",
    status: "success",
    data: category,
  });
});

// get all categories
export const getAllCategories = asyncHandler(async (req, res, next) => {
  // req query filters
  // add pagination
  const filter = {};
  const { query, page, limit } = req.query;
  const currentPage = parseInt(page) || 1;
  const itemsPerPage = parseInt(limit) || 10;
  const skip = (currentPage - 1) * itemsPerPage;

  // for search with page
  if (query) {
    filter.$or = [
      { name: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }

  const categories = await Category.find(filter).limit(itemsPerPage).skip(skip)
    .sort;

  res.status(200).json({
    message: "Categories fetched successfully",
    status: "success",
    data: categories,
  });
});
// get category by id
export const getCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);

  if (!category) {
    throw new CustomError("Category not found", 404);
  }

  res.status(200).json({
    message: "Category fetched successfully",
    status: "success",
    data: category,
  });
});

// update category
export const updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const file = req.file;

  const category = await Category.findById(id);

  if (!category) {
    throw new CustomError("Category not found", 404);
  }

  if (description) {
  }

  category.name = name || category.name;
  category.description = description || category.description;

  // image upload
  if (file) {
    const { path, public_id } = await uploadToCloudinary(
      file.path,
      "/categories"
    );
    category.image = {
      path,
      public_id,
    };
  }

  // save updated category
  await category.save();

  res.status(200).json({
    message: "Category updated successfully",
    status: "success",
    data: category,
  });
});

// delete category
export const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findOne({ _id: id });

  if (!category) {
    throw new CustomError("Category not found", 404);
  }
  // delete image from cloudinary
  await category.remove();

  res.status(200).json({
    message: "Category deleted successfully",
    status: "success",
    data: null,
  });
});
