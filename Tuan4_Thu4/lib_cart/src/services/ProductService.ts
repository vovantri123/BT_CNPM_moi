import { ProductModel } from '../models/Product.js';
import { Product } from '../types/index.js';

export class ProductService {
  // Lấy tất cả sản phẩm
  static async getAllProducts(): Promise<Product[]> {
    try {
      const products = await ProductModel.find().sort({ createdAt: -1 });
      return products;
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách sản phẩm: ${error}`);
    }
  }

  // Lấy sản phẩm theo ID
  static async getProductById(id: string): Promise<Product | null> {
    try {
      const product = await ProductModel.findById(id);
      return product;
    } catch (error) {
      throw new Error(`Lỗi khi lấy sản phẩm: ${error}`);
    }
  }

  // Tạo sản phẩm mới
  static async createProduct(
    productData: Omit<Product, '_id' | 'createdAt'>
  ): Promise<Product> {
    try {
      const newProduct = new ProductModel(productData);
      const savedProduct = await newProduct.save();
      return savedProduct;
    } catch (error) {
      throw new Error(`Lỗi khi tạo sản phẩm: ${error}`);
    }
  }

  // Cập nhật sản phẩm
  static async updateProduct(
    id: string,
    productData: Partial<Product>
  ): Promise<Product | null> {
    try {
      const updatedProduct = await ProductModel.findByIdAndUpdate(
        id,
        productData,
        { new: true, runValidators: true }
      );
      return updatedProduct;
    } catch (error) {
      throw new Error(`Lỗi khi cập nhật sản phẩm: ${error}`);
    }
  }

  // Xóa sản phẩm
  static async deleteProduct(id: string): Promise<boolean> {
    try {
      const result = await ProductModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw new Error(`Lỗi khi xóa sản phẩm: ${error}`);
    }
  }

  // Tìm kiếm sản phẩm
  static async searchProducts(keyword: string): Promise<Product[]> {
    try {
      const products = await ProductModel.find({
        $text: { $search: keyword },
      }).sort({ score: { $meta: 'textScore' } });
      return products;
    } catch (error) {
      // Nếu không có text index, tìm kiếm theo tên
      const products = await ProductModel.find({
        name: { $regex: keyword, $options: 'i' },
      });
      return products;
    }
  }

  // Cập nhật tồn kho
  static async updateStock(id: string, stock: number): Promise<Product | null> {
    try {
      if (stock < 0) {
        throw new Error('Số lượng tồn kho không thể âm');
      }

      const updatedProduct = await ProductModel.findByIdAndUpdate(
        id,
        { stock },
        { new: true, runValidators: true }
      );
      return updatedProduct;
    } catch (error) {
      throw new Error(`Lỗi khi cập nhật tồn kho: ${error}`);
    }
  }
}
