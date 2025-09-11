import mongoose, { Schema, Document } from 'mongoose';
import { CartItem } from '../types/index.js';

interface CartItemDocument extends Omit<CartItem, '_id'>, Document {}

const cartItemSchema = new Schema<CartItemDocument>(
  {
    productId: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    image: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index để tối ưu hóa truy vấn
cartItemSchema.index({ productId: 1 });

export const CartItemModel = mongoose.model<CartItemDocument>(
  'CartItem',
  cartItemSchema
);
