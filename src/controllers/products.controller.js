import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import Brand from "../models/brand.model.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { uploadToCloudinary } from "../utils/cloudinary.utils.js";
import CustomError from "../middlewares/error_handler.middleware.js";

const dir = "/products";

//* get all
export const getAll = asyncHandler(async (req, res) => {
  // req query filters
  // add pagination
  const filter = {};
  const { query, page, limit, category, price_min, price_max } = req.query;
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
  // filter with category
  if (category) {
    filter.category = category;
  }
  // filter with brand
  if (brand) {
    filter.brand = brand;
  }
  // filter with price range
  if (price_min || price_max) {
    filter.price = {};

    if (price_max && price_min) {
      filter.price.$and = [
        {
          price: {
            $gte: price_min,
          },
          price: {
            $lte: price_max,
          },
        },
      ];
    }

    if (price_min) {
      filter.price.$gte = parseFloat(price_min);
    }
    if (price_max) {
      filter.price.$lte = parseFloat(price_max);
    }
  }

  const products = await Product.find({})
    .populate("Category")
    .populate("Brand")
    .sort({ createdAt: -1 });


    const totalCount = await Product.countDocuments(filter);

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const pagination = getPaginationData(
      currentPage,
      itemsPerPage,
      totalCount,
      totalPages
    );

  res.status(200).json({
    message: "Products fetched",
    status: "success",
    data: products,
  });
});

// get by id
export const getById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOne({ _id: id })
    .populate("Category")
    .populate("Brand");
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
  }

  await product.save();

  res.status(201).json({
    message: "Product created",
    data: product,
    status: "success",
  });
});

// update product
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

  product.name = name || product.name;
  product.price = price || product.price;
  product.stock = stock || product.stock;
  product.description = description || product.description;
  product.is_featured = is_featured || product.is_featured;
  product.new_arrival = new_arrival || product.new_arrival;

  if (brand) {
    const product_brand = await Brand.findOne({ _id: brand });

    if (!product_brand) {
      throw new CustomError("Brand not found", 400);
    }
    product.brand = product_brand._id;
  }

  if (category) {
    const product_category = await Category.findOne({ _id: category });

    if (!product_category) {
      throw new CustomError("Category not found", 400);
    }
    product.category = product_category._id;
  }

  // cover image
  if (cover_image) {
    const { path, public_id } = await uploadToCloud(cover_image[0].path, dir);

    product.cover_image = {
      path,
      public_id,
    };
  }

  // images
  if (images && Array.isArray(images) && images.length > 0) {
    const promises = images.map(
      async (image) => await uploadToCloud(image.path, dir)
    );

    product.images = await Promise.all(promises);
  }

  await product.save();

  res.status(200).json({
    message: "Product updated successfully",
    status: "success",
    data: product,
  });
});

// delete product
export const remove = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findOne({ _id: id });

  if (!product) {
    throw new CustomError("Product not found", 404);
  }

  //delete cover image and images from cloudinary

  await deleteFile(product.cover_image.public_id);
  // delete images from cloudinary
  if (product.images && product.images.length > 0) {
    const deletePromises = product.images.map(
      async (image) => await deleteFile(image.public_id)
    );
    await Promise.all(deletePromises);
  }

  await product.deleteOne();

  res.status(200).json({
    message: "Product deleted successfully",
    status: "success",
    data: null,
  });
});
