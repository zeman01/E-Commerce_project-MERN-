import CustomError from "../middlewares/error_handler.middleware.js";
import Product from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import Brand from "../models/brand.model.js";
import { deleteFile, uploadToCloud } from "../utils/cloudinary.utils.js";
import Category from "../models/category.model.js";
import { getPagination } from "../utils/pagination.utils.js";
import mongoose from "mongoose";

const dir = "/products";

//* get all
export const getAll = asyncHandler(async (req, res) => {
  const {
    query,
    page = 1,
    limit = 10,
    category,
    brand,
    minPrice,
    maxPrice,
  } = req.query;
  let filter = {};

  if (query) {
    filter.$or = [
      {
        name: {
          $regex: query,
          $options: "i",
        },
      },
      {
        description: {
          $regex: query,
          $options: "i",
        },
      },
    ];
  }

  //* price range
  if (minPrice || maxPrice) {
    if (minPrice && maxPrice) {
      filter.price.$and = [
        {
          price: {
            $gte: minPrice,
          },
        },
        {
          price: {
            $lte: maxPrice,
          },
        },
      ];
    }

    if (minPrice) {
      filter.price.$gte = minPrice;
    }

    if (maxPrice) {
      filter.price.$lte = maxPrice;
    }
  }

  //* category

  if (category) {
    filter.category = category;
  }

  //* brand
  if (brand) {
    filter.brand = brand;
  }

  const products = await Product.find(filter)
    .populate("category")
    .populate("brand")
    .sort({ createdAt: -1 });

  const total_counts = await Product.countDocuments(filter);

  const pagination = getPagination(total_counts, page, limit);

  res.status(200).json({
    message: "Products fetched",
    status: "success",
    data: products,
    pagination,
  });
});

// get by id
export const getById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid product ID" });
  }
  const product = await Product.findOne({ _id: id })
    .populate("category")
    .populate("brand");
  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  res.status(200).json({
    message: "Product fetched",
    status: "success",
    data: product,
  });
});

// create
export const create = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    stock,
    description,
    is_featured,
    new_arrival,
    category,
    brand,
  } = req.body;

  console.log(req.files);
  const { cover_image, images } = req.files;

  if (!brand) {
    cover_image;
    throw new CustomError("Brand is required", 400);
  }
  if (!category) {
    throw new CustomError("Category is required", 400);
  }

  if (!cover_image) {
    throw new CustomError("Cover image is required", 400);
  }

  const product = new Product({
    name,
    price,
    stock,
    description,
    is_featured,
    new_arrival,
  });

  const product_brand = await Brand.findOne({ _id: brand });

  if (!product_brand) {
    throw new CustomError("Brand not found", 400);
  }

  const product_category = await Category.findOne({ _id: category });

  if (!product_category) {
    throw new CustomError("Category not found", 400);
  }
  product.category = product_category._id;
  product.brand = product_brand._id;

  // cover image
  const { path, public_id } = await uploadToCloud(cover_image[0].path, dir);

  product.cover_image = {
    path,
    public_id,
  };

  // images
  if (images && Array.isArray(images) && images.length > 0) {
    const promises = images.map(
      async (image) => await uploadToCloud(image.path, dir)
    );

    product.images = await Promise.all(promises);

    // product.images = product_images
    // product.images = await Promise.all(images.map(async(image) => await uploadToCloud(image.path,dir)))
  }

  await product.save();

  res.status(201).json({
    message: "Product created",
    data: product,
    status: "success",
  });
});

//* update
export const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    price,
    stock,
    description,
    is_featured,
    new_arrival,
    category,
    brand,
  } = req.body;

  const { cover_image, images } = req.files;

  const product = await Product.findById(id);

  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  if (name) product.name = name;
  if (description) product.description;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (is_featured) product.is_featured = is_featured;
  if (new_arrival) product.new_arrival = new_arrival;

  if (category) {
    const new_category = await Category.findById(category);
    if (!new_category) {
      throw new CustomError("Category not found", 404);
    }

    product.category = new_category._id;
  }

  if (brand) {
    const new_brand = await Brand.findById(brand);
    if (!new_brand) {
      throw new CustomError("Brand not found", 404);
    }

    product.brand = new_brand._id;
  }

  // cover image

  if (cover_image) {
    if (product.cover_image) {
      await deleteFile(product.cover_image.public_id);
    }
    const { path, public_id } = await uploadToCloud(cover_image[0].path, dir);

    product.cover_image = {
      path,
      public_id,
    };
  }

  // images

  if (images && Array.isArray(images) && images.length > 0) {
    if (product.images) {
      const promises = product.images.map(
        async (image) => await deleteFile(image.public_id)
      );
      await Promise.all(promises);

      // await Promise.all(images.map(async (image) => await deleteFile(image.public_id)))
    }

    // upload images

    const new_images = await Promise.all(
      images.map(async (img) => await uploadToCloud(img.path, dir))
    );

    product.images = new_images;
  }

  await product.save();

  res.status(201).json({
    message: "Product updated",
    status: "success",
    data: product,
  });
});

//! delete
export const remove = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findOne({ _id: id });
  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  await deleteFile(product.cover_image.public_id);

  if (product.images) {
    await Promise.all(
      product.images.map(async (image) => await deleteFile(image.public_id))
    );
  }

  await product.deleteOne();

  res.status(200).json({
    message: "Product deleted",
    data: null,
    status: "success",
  });
});

// get by category

export const getByCategory = asyncHandler(async (req, res) => {
  const { category_id } = req.params;
  const products = await Product.find({ category: category_id })
    .populate("category")
    .populate("brand");

  res.status(200).json({
    message: "Products fetched",
    status: "success",
    data: products,
  });
});

// get by brand
export const getByBrand = asyncHandler(async (req, res) => {
  const { brand_id } = req.params;
  const products = await Product.find({ brand: brand_id })
    .populate("category")
    .populate("brand");

  res.status(200).json({
    message: "Products fetched",
    status: "success",
    data: products,
  });
});
// get all featured
export const getAllFeatured = asyncHandler(async (req, res) => {
  const products = await Product.find({ is_featured: true })
    .populate("category")
    .populate("brand");

  res.status(200).json({
    message: "Products fetched",
    status: "success",
    data: products,
  });
});
// get all new arrivals
export const getNewArrivals = asyncHandler(async (req, res) => {
  const products = await Product.find({ new_arrival: true })
    .populate("category")
    .populate("brand");

  res.status(200).json({
    message: "Products fetched",
    status: "success",
    data: products,
  });
});
