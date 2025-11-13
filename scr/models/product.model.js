import mongoose from "mongoose";
// import Category from "./category.model.js";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    coverImage: {
      type: {
        path: String,
        public_id: String,
      },
      required: [true, "Cover image is required"],
    },
    images: [
      {
        type: {
          path: String,
          public_id: String,
        },
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    newArrival: {
      type: Boolean,
      default: false,
    },

    // use schema references for category and brand
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product must belong to a category"],
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: [true, "Product must belong to a brand"],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
