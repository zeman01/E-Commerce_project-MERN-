
import mongoose from 'mongoose';

// cart model
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        }
      },
    ],
  },
  { timestamps: true }
);

const Cart = mongoose.model('cart', cartSchema);

export default Cart;