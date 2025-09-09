const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'electronics',
        'clothing',
        'books',
        'home',
        'sports',
        'beauty',
        'toys',
        'food',
      ],
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/300x200',
    },
    stock: {
      type: Number,
      default: 100,
    },
    views: {
      type: Number,
      default: 0,
    },
    promotion: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Index cho tìm kiếm nhanh theo category
productSchema.index({ category: 1, createdAt: -1 });
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ price: 1 });
productSchema.index({ views: -1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
