import mongoose from "mongoose";

import { ORDER_STATUS, PAYMENT_METHODS } from "../constants/enums.constant.js";

// order model
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHODS),
      default: PAYMENT_METHODS.CASH,
    },
    shippingAddress: {
      type: {
        state: {
          type: String,
          required: [true, "State is required"],
        },
        district: {
          type: String,
          required: [true, "District is required"],
        },
        street: {
          type: String,
          required: [true, "Street is required"],
        },
        postalCode: {
          type: String,
          required: [true, "Postal Code is required"],
        },
      },
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("order", orderSchema);

export default Order;
