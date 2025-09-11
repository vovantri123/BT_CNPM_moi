import mongoose, { Schema, Document } from 'mongoose';
import { Product } from '../types/index.js';

interface ProductDocument extends Omit<Product, '_id'>, Document {}

const productSchema = new Schema<ProductDocument>(
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
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: 'text' });

export const ProductModel = mongoose.model<ProductDocument>(
  'Product',
  productSchema
);
