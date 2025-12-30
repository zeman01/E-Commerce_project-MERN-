import CustomError from "../middlewares/error_handler.middleware.js";
import Category from "../models/category.model.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { deleteFile, uploadToCloud } from "../utils/cloudinary.utils.js";
import { getPagination } from "../utils/pagination.utils.js";

// create category
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const file = req.file;

  if (!name) {
    throw new CustomError("name is required", 400);
  }

  const category = new Category({ name, description });

  // image
  if (file) {
    const { path, public_id } = await uploadToCloud(file.path, "/categories");
    category.image = {
      path,
      public_id,
    };
  }

  await category.save();

  res.status(201).json({
    message: "Category created",
    status: "success",
    data: category,
  });
});

// get all
export const getAllCategories = asyncHandler(async (req, res) => {
  // req.query

  const filter = {};
  const { query, page = 1, limit = 10 } = req.query;
  const current_page = parseInt(page)
  const per_page_limit  = parseInt(limit)
const skip = (current_page - 1) * per_page_limit



  if (query) {
    filter.$or = [
      {
        name: { $regex: query, $options: "i" },
      },
       {
        description: { $regex: query, $options: "i" },
      },
    ];
  }

  // price range
  // if(){}
  
  // category_id

  // brand

  const categories = await Category.find(filter).limit(per_page_limit).skip(skip).sort({
    createdAt:-1
  
  });
  const total_count = await Category.countDocuments(filter)

// 11 -> 10  -> 2
  const pagination = getPagination(total_count,current_page , per_page_limit )

  res.status(200).json({
    message: "Category fetched",
    status: "success",
    data: categories,
    pagination
  });
});

// get all
export const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findOne({ _id: id });

  if (!category) {
    throw new CustomError("Category not found", 404);
  }

  res.status(200).json({
    message: "Category fetched",
    status: "success",
    data: category,
  });
});

// update
export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const file = req.file;

  const category = await Category.findById(id);

  if (!category) {
    throw new CustomError("Category not found", 404);
  }
  if (name) {
    category.name = name;
  }
  if (description) {
    category.description = description;
  }

  if (file) {
    if (category.image) {
      await deleteFile(category.image?.public_id);
    }
    const { public_id, path } = await uploadToCloud(file.path);
    category.image = {
      public_id,
      path,
    };
  }

  await category.save();

  res.status(200).json({
    message: "Category updated",
    status: "success",
    data: category,
  });
});

// delete
export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findOne({ _id: id });

  if (!category) {
    throw new CustomError("Category not found", 404);
  }

  if (category.image) {
    await deleteFile(category.image?.public_id);
  }

  await category.deleteOne();

  res.status(200).json({
    message: "Category deleted",
    status: "success",
    data: null,
  });
});
