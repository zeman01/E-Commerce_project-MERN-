import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
    },
    description: {
      type: String,
    },
    // parentCategory: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Category',
    // },

    // image field
    image: {
      type: {
        path: String,
        public_id: String,
      },
    },
  },
  { timestamps: true }
);

// creating category model
const Category = mongoose.model("category", categorySchema);
export default Category;
