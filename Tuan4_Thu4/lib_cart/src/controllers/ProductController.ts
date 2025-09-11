import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService.js';
import { UIComponents } from '../components/UIComponents.js';

export class ProductController {
  // Hiển thị danh sách sản phẩm
  static async showProductsPage(req: Request, res: Response): Promise<void> {
    try {
      const products = await ProductService.getAllProducts();

      res.render('layout', {
        body: await new Promise<string>((resolve, reject) => {
          res.app.render(
            'products/index',
            {
              products,
              UIComponents,
            },
            (err, html) => {
              if (err) reject(err);
              else resolve(html);
            }
          );
        }),
        title: 'Danh sách sản phẩm',
        UIComponents,
      });
    } catch (error) {
      console.error('Lỗi khi hiển thị sản phẩm:', error);
      res.status(500).render('error', {
        message: 'Không thể tải danh sách sản phẩm',
        error: error,
        UIComponents,
      });
    }
  }

  // API: Lấy danh sách sản phẩm
  static async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await ProductService.getAllProducts();
      res.json({
        success: true,
        data: products,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Không thể lấy danh sách sản phẩm',
        error: error instanceof Error ? error.message : error,
      });
    }
  }
}
