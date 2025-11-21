
import mongoose from 'mongoose';

// cart model
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        totalPrice: {
            type: Number,
            required: true,
        }
      },
    ],
  },
  { timestamps: true }
);

const Cart = mongoose.model('cart', cartSchema);

export default Cart;