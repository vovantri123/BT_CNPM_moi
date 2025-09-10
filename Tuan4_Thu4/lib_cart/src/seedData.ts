import { dbConnection } from './database/connection.js';
import { ProductService } from './services/ProductService.js';
import { CartService } from './services/CartService.js';
import { Product } from './types/index.js';

const sampleProducts: Omit<Product, '_id' | 'createdAt'>[] = [
  {
    name: 'iPhone 15 Pro Max',
    price: 29999000,
    description: 'Điện thoại iPhone 15 Pro Max 256GB - Titan Tự Nhiên',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300',
    stock: 50,
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    price: 26999000,
    description: 'Samsung Galaxy S24 Ultra 512GB - Phantom Black',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300',
    stock: 30,
  },
  {
    name: 'MacBook Pro M3',
    price: 45999000,
    description: 'MacBook Pro 14-inch với chip M3, 16GB RAM, 512GB SSD',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300',
    stock: 25,
  },
  {
    name: 'Dell XPS 13',
    price: 28999000,
    description: 'Dell XPS 13 9320, Intel Core i7, 16GB RAM, 512GB SSD',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300',
    stock: 20,
  },
  {
    name: 'Sony WH-1000XM5',
    price: 7999000,
    description: 'Tai nghe chống ồn Sony WH-1000XM5 Wireless',
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300',
    stock: 100,
  },
  {
    name: 'AirPods Pro Gen 2',
    price: 6499000,
    description: 'Apple AirPods Pro thế hệ 2 với chip H2',
    image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=300',
    stock: 75,
  },
  {
    name: 'iPad Pro 12.9"',
    price: 26999000,
    description: 'iPad Pro 12.9 inch M2 WiFi 128GB - Space Gray',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300',
    stock: 40,
  },
  {
    name: 'Apple Watch Series 9',
    price: 8999000,
    description: 'Apple Watch Series 9 GPS 41mm Pink Aluminum Case',
    image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=300',
    stock: 60,
  },
  {
    name: 'Nintendo Switch OLED',
    price: 8999000,
    description: 'Máy chơi game Nintendo Switch OLED màn hình 7 inch',
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300',
    stock: 45,
  },
  {
    name: 'PlayStation 5',
    price: 13999000,
    description: 'Sony PlayStation 5 Console với Disc Drive',
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300',
    stock: 15,
  },
];

export class DataSeeder {
  static async seedProducts(): Promise<void> {
    try {
      console.log('🌱 Bắt đầu seeding dữ liệu sản phẩm...');

      // Xóa dữ liệu cũ
      const existingProducts = await ProductService.getAllProducts();
      if (existingProducts.length > 0) {
        console.log('🗑️  Xóa dữ liệu sản phẩm cũ...');
        for (const product of existingProducts) {
          if (product._id) {
            await ProductService.deleteProduct(product._id.toString());
          }
        }
      }

      // Thêm dữ liệu mới
      console.log('📦 Thêm dữ liệu sản phẩm mới...');
      for (const productData of sampleProducts) {
        const product = await ProductService.createProduct(productData);
        console.log(`   ✅ Đã tạo: ${product.name}`);
      }

      console.log('🎉 Seeding sản phẩm hoàn thành!');
    } catch (error) {
      console.error('❌ Lỗi khi seeding sản phẩm:', error);
      throw error;
    }
  }

  static async seedCartItems(): Promise<void> {
    try {
      console.log('🛒 Bắt đầu seeding dữ liệu giỏ hàng...');

      // Xóa giỏ hàng cũ
      await CartService.clearCart();

      // Lấy một số sản phẩm để thêm vào giỏ hàng
      const products = await ProductService.getAllProducts();
      if (products.length === 0) {
        console.log('⚠️  Không có sản phẩm nào để thêm vào giỏ hàng');
        return;
      }

      // Thêm 3-5 sản phẩm ngẫu nhiên vào giỏ hàng
      const numberOfItems = Math.min(2, products.length); // Lấy số lượng sản phẩm tối đa là 2 (nếu có ít hơn 2 sản phẩm thì lấy hết).
      const selectedProducts = products.slice(0, numberOfItems);

      for (const product of selectedProducts) {
        if (product._id) {
          const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 items
          await CartService.addToCart(product._id.toString(), quantity);
          console.log(
            `   ✅ Đã thêm ${quantity}x ${product.name} vào giỏ hàng`
          );
        }
      }

      console.log('🎉 Seeding giỏ hàng hoàn thành!');
    } catch (error) {
      console.error('❌ Lỗi khi seeding giỏ hàng:', error);
      throw error;
    }
  }

  static async seedAll(): Promise<void> {
    try {
      console.log('🚀 Bắt đầu seeding toàn bộ dữ liệu...');

      await this.seedProducts();
      await this.seedCartItems();

      console.log('✨ Seeding hoàn thành! Dữ liệu mẫu đã được tạo.');

      // Hiển thị tổng kết
      const cartSummary = await CartService.getCartSummary();
      console.log(`📊 Tổng kết:`);
      console.log(`   - Sản phẩm: ${sampleProducts.length}`);
      console.log(
        `   - Giỏ hàng: ${
          cartSummary.totalItems
        } items, ${cartSummary.totalPrice.toLocaleString('vi-VN')} VNĐ`
      );
    } catch (error) {
      console.error('❌ Lỗi khi seeding:', error);
      throw error;
    }
  }
}

// Chạy seeding nếu file này được gọi trực tiếp
async function runSeeder() {
  try {
    // Kết nối database
    await dbConnection.connect();

    // Run seeding
    await DataSeeder.seedAll();

    // Ngắt kết nối
    await dbConnection.disconnect();

    console.log('🏁 Hoàn thành!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Seeding thất bại:', error);
    process.exit(1);
  }
}

runSeeder();
