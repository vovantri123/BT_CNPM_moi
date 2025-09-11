import express, { Router } from 'express';
import { CartController } from '../controllers/CartController.js';

const router: Router = express.Router();

// Routes hiển thị UI
router.get('/', CartController.showCartPage);

// API Routes cho giỏ hàng
router.get('/api/cart', CartController.getCart);
router.post('/api/cart/add', CartController.addToCart);
router.put('/api/cart/:itemId', CartController.updateCartItem);
router.delete('/api/cart/:itemId', CartController.removeFromCart);
router.delete('/api/cart', CartController.clearCart);

export default router;
