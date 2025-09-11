// Export các types
export * from './types/index.js';

// Export các models
export { CartItemModel } from './models/CartItem.js';
export { ProductModel } from './models/Product.js';

// Export các services
export { CartService } from './services/CartService.js';
export { ProductService } from './services/ProductService.js';

// Export UI components
export { UIComponents } from './components/UIComponents.js';

// Export controllers
export { CartController } from './controllers/CartController.js';
export { ProductController } from './controllers/ProductController.js';

// Export database connection
export { DatabaseConnection, dbConnection } from './database/connection.js';

// Export routes
export { default as cartRoutes } from './routes/cartRoutes.js';
export { default as productRoutes } from './routes/productRoutes.js';

// Export server
export { CartLibraryServer } from './server.js';

// Export seeder
export { DataSeeder } from './seedData.js';

// Main library class để sử dụng dễ dàng
export class CartLibrary {
  private server: any = null;
  private static mongoUri?: string;

  /**
   * Khởi tạo thư viện với cấu hình
   */
  static async initialize(
    config: {
      mongoUri?: string;
      port?: number;
    } = {}
  ): Promise<void> {
    const { mongoUri, port } = config;
    CartLibrary.mongoUri = mongoUri;

    try {
      // Kết nối database
      const { dbConnection } = await import('./database/connection.js');
      await dbConnection.connect(mongoUri);
      console.log('✅ Cart Library: Database connected');

      // Tạo server nếu có port
      if (port) {
        const { CartLibraryServer } = await import('./server.js');
        const server = new CartLibraryServer(port, mongoUri);
        await server.start();
        console.log('✅ Cart Library: Server started');
      }
    } catch (error) {
      console.error('❌ Cart Library initialization failed:', error);
      throw error;
    }
  }

  /**
   * Seed dữ liệu mẫu
   */
  static async seedData(): Promise<void> {
    try {
      const { DataSeeder } = await import('./seedData.js');
      await DataSeeder.seedAll(CartLibrary.mongoUri);
      console.log('✅ Cart Library: Sample data seeded');
    } catch (error) {
      console.error('❌ Cart Library seeding failed:', error);
      throw error;
    }
  }

  /**
   * Ngắt kết nối và dọn dẹp
   */
  static async cleanup(): Promise<void> {
    try {
      const { dbConnection } = await import('./database/connection.js');
      await dbConnection.disconnect();
      console.log('✅ Cart Library: Cleanup completed');
    } catch (error) {
      console.error('❌ Cart Library cleanup failed:', error);
      throw error;
    }
  }

  /**
   * Tạo Express middleware để tích hợp vào app có sẵn
   */
  static async createMiddleware(): Promise<any> {
    const express = await import('express');
    const router = express.Router();

    // Import routes dynamically để tránh circular dependency
    const cartRoutes = (await import('./routes/cartRoutes.js')).default;
    const productRoutes = (await import('./routes/productRoutes.js')).default;

    router.use('/cart', cartRoutes);
    router.use('/products', productRoutes);

    return router;
  }
}
