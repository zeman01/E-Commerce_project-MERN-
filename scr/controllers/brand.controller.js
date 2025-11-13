import Brand from "../models/brand.model.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { uploadToCloudinary } from "../utils/cloudinary.utils.js";
import CustomError from "../middlewares/error_handler.middleware.js";

// ! CRUD Operations
// create brand
export const createBrand = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const file = req.file;

  // create brand instance
  const brand = new Brand({ name, description });

  //   image upload
  if (file) {
    const { path, public_id } = await uploadToCloudinary(file.path, "/brands");
    brand.image = {
      path,
      public_id,
    };
  } else throw new CustomError("Brand image is required", 400);

  //   save brand
  await brand.save();

  res.status(201).json({
    message: "Brand created successfully",
    status: "success",
    data: brand,
  });
});

// get all
export const getAll = asyncHandler(async (req, res) => {
  const brands = await Brand.find({});

  if (!brands) {
    throw new CustomError("No brands found", 404);
  }

  res.status(200).json({
    message: "Brands fetched successfully",
    status: "success",
    data: brands,
  });
});

// get By Id
export const getById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);

  if (!brand) {
    throw new CustomError("Brand not found", 404);
  }

  res.status(200).json({
    message: "Brand fetched successfully",
    status: "success",
    data: brand,
  });
});

// update brand
export const updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const file = req.file;

  const brand = await Brand.findById(id);

  if (!brand) {
    throw new CustomError("Brand not found", 404);
  }

  brand.name = name || brand.name;
  brand.description = description || brand.description;

  //   image upload
  if (file) {
    const { path, public_id } = await uploadToCloudinary(file.path, "/brands");

    if (brand.image) {
      // delete the previous image from cloudinary
      await deleteFromCloudinary(brand.image.public_id);

    }

    brand.image = {
      path,
      public_id,
    };
  }

  //   save brand
  await brand.save();

  res.status(200).json({
    message: "Brand updated successfully",
    status: "success",
    data: brand,
  });
});

// delete brand
export const deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);

  if (!brand) {
    throw new CustomError("Brand not found", 404);
  }

  await brand.remove();

  res.status(200).json({
    message: "Brand deleted successfully",
    status: "success",
    data: null,
  });
});
