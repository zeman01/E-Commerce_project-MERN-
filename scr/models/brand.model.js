

import mongoose from 'mongoose'

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Brand name is required'],
      unique: true,
    },
    description: {
      type: String,
    },
    // image field
    image: {
      type: {
        path: String,
        public_id: String,
      },
    },
  },
  { timestamps: true }
)

// creating brand model
const Brand = mongoose.model('Brand', brandSchema)
export default Brand