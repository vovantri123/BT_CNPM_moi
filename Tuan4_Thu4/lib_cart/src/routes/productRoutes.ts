import express, { Router } from 'express';
import { ProductController } from '../controllers/ProductController.js';

const router: Router = express.Router();

// Routes hiển thị UI
router.get('/', ProductController.showProductsPage);

// API Routes - chỉ cần để hiển thị sản phẩm
router.get('/api/products', ProductController.getProducts);

export default router;
