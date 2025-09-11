import { CartItemModel } from '../models/CartItem.js';
import { ProductModel } from '../models/Product.js';
import { CartItem, CartSummary } from '../types/index.js';

export class CartService {
  // Lấy tất cả items trong giỏ hàng
  static async getAllCartItems(): Promise<CartItem[]> {
    try {
      const items = await CartItemModel.find().sort({ createdAt: -1 });
      return items;
    } catch (error) {
      throw new Error(`Lỗi khi lấy giỏ hàng: ${error}`);
    }
  }

  // Thêm sản phẩm vào giỏ hàng
  static async addToCart(
    productId: string,
    quantity: number = 1
  ): Promise<CartItem> {
    try {
      // Kiểm tra sản phẩm có tồn tại không
      const product = await ProductModel.findById(productId);
      if (!product) {
        throw new Error('Sản phẩm không tồn tại');
      }

      // Kiểm tra số lượng tồn kho
      if (product.stock < quantity) {
        throw new Error('Số lượng vượt quá tồn kho');
      }

      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const existingItem = await CartItemModel.findOne({ productId });

      if (existingItem) {
        // Nếu đã có, cập nhật số lượng
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          throw new Error('Tổng số lượng vượt quá tồn kho');
        }

        existingItem.quantity = newQuantity;
        const updatedItem = await existingItem.save();
        return updatedItem;
      } else {
        // Nếu chưa có, tạo mới
        const newCartItem = new CartItemModel({
          productId: product._id,
          productName: product.name,
          price: product.price,
          quantity,
          image: product.image || '',
        });

        const savedItem = await newCartItem.save();
        return savedItem;
      }
    } catch (error) {
      throw new Error(`Lỗi khi thêm vào giỏ hàng: ${error}`);
    }
  }

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  static async updateCartItem(
    itemId: string,
    quantity: number
  ): Promise<CartItem | null> {
    try {
      if (quantity <= 0) {
        throw new Error('Số lượng phải lớn hơn 0');
      }

      const cartItem = await CartItemModel.findById(itemId);
      if (!cartItem) {
        throw new Error('Không tìm thấy sản phẩm trong giỏ hàng');
      }

      // Kiểm tra tồn kho
      const product = await ProductModel.findById(cartItem.productId);
      if (product && quantity > product.stock) {
        throw new Error('Số lượng vượt quá tồn kho');
      }

      cartItem.quantity = quantity;
      const updatedItem = await cartItem.save();
      return updatedItem;
    } catch (error) {
      throw new Error(`Lỗi khi cập nhật giỏ hàng: ${error}`);
    }
  }

  // Xóa sản phẩm khỏi giỏ hàng
  static async removeFromCart(itemId: string): Promise<boolean> {
    try {
      const result = await CartItemModel.findByIdAndDelete(itemId);
      return !!result;
    } catch (error) {
      throw new Error(`Lỗi khi xóa khỏi giỏ hàng: ${error}`);
    }
  }

  // Xóa toàn bộ giỏ hàng
  static async clearCart(): Promise<boolean> {
    try {
      await CartItemModel.deleteMany({});
      return true;
    } catch (error) {
      throw new Error(`Lỗi khi xóa giỏ hàng: ${error}`);
    }
  }

  // Lấy tổng kết giỏ hàng
  static async getCartSummary(): Promise<CartSummary> {
    try {
      const items = await this.getAllCartItems();
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      return {
        items,
        totalItems,
        totalPrice,
      };
    } catch (error) {
      throw new Error(`Lỗi khi tính tổng giỏ hàng: ${error}`);
    }
  }

  // Lấy một item cụ thể
  static async getCartItem(itemId: string): Promise<CartItem | null> {
    try {
      const item = await CartItemModel.findById(itemId);
      return item;
    } catch (error) {
      throw new Error(`Lỗi khi lấy sản phẩm: ${error}`);
    }
  }
}
