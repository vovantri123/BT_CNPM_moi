import { Request, Response } from 'express';
import { CartService } from '../services/CartService.js';
import { ProductService } from '../services/ProductService.js';
import { UIComponents } from '../components/UIComponents.js';

export class CartController {
  // Hiển thị trang giỏ hàng
  static async showCartPage(req: Request, res: Response): Promise<void> {
    try {
      const cartSummary = await CartService.getCartSummary();
      const products = await ProductService.getAllProducts();

      res.render('layout', {
        body: await new Promise<string>((resolve, reject) => {
          res.app.render(
            'cart/index',
            {
              cartSummary,
              products,
              UIComponents,
            },
            (err, html) => {
              if (err) reject(err);
              else resolve(html);
            }
          );
        }),
        title: 'Giỏ hàng của bạn',
        UIComponents,
      });
    } catch (error) {
      console.error('Lỗi khi hiển thị giỏ hàng:', error);
      res.status(500).render('error', {
        message: 'Không thể tải giỏ hàng',
        error: error,
        UIComponents,
      });
    }
  }

  // API: Lấy giỏ hàng (JSON)
  static async getCart(req: Request, res: Response): Promise<void> {
    try {
      const cartSummary = await CartService.getCartSummary();
      res.json({
        success: true,
        data: cartSummary,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Không thể lấy giỏ hàng',
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  // API: Thêm sản phẩm vào giỏ hàng
  static async addToCart(req: Request, res: Response): Promise<void> {
    try {
      const { productId, quantity = 1 } = req.body; 

      if (!productId) {
        res.status(400).json({
          success: false,
          message: 'ProductId là bắt buộc',
        });
        return;
      }

      const cartItem = await CartService.addToCart(
        productId,
        parseInt(quantity)
      );

      res.json({
        success: true,
        message: 'Đã thêm vào giỏ hàng',
        data: cartItem,
      });
    } catch (error) { 
      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : 'Lỗi khi thêm vào giỏ hàng',
        error: error,
      });
    }
  }

  // API: Cập nhật số lượng
  static async updateCartItem(req: Request, res: Response): Promise<void> {
    try {
      const { itemId } = req.params;
      const { quantity } = req.body;

      if (!quantity || quantity <= 0) {
        res.status(400).json({
          success: false,
          message: 'Số lượng phải lớn hơn 0',
        });
        return;
      }

      const updatedItem = await CartService.updateCartItem(
        itemId,
        parseInt(quantity)
      );

      if (!updatedItem) {
        res.status(404).json({
          success: false,
          message: 'Không tìm thấy sản phẩm trong giỏ hàng',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Đã cập nhật số lượng',
        data: updatedItem,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Lỗi khi cập nhật',
        error: error,
      });
    }
  }

  // API: Xóa sản phẩm khỏi giỏ hàng
  static async removeFromCart(req: Request, res: Response): Promise<void> {
    try {
      const { itemId } = req.params;

      const result = await CartService.removeFromCart(itemId);

      if (!result) {
        res.status(404).json({
          success: false,
          message: 'Không tìm thấy sản phẩm trong giỏ hàng',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Đã xóa khỏi giỏ hàng',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Lỗi khi xóa',
        error: error,
      });
    }
  }

  // API: Xóa toàn bộ giỏ hàng
  static async clearCart(req: Request, res: Response): Promise<void> {
    try {
      await CartService.clearCart();

      res.json({
        success: true,
        message: 'Đã xóa toàn bộ giỏ hàng',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : 'Lỗi khi xóa giỏ hàng',
        error: error,
      });
    }
  }
}
