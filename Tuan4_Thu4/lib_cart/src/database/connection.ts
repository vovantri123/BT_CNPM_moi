import mongoose from 'mongoose';

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnected: boolean = false;

  private constructor() {}

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  async connect(mongoUri: string | undefined = undefined): Promise<void> {
    const uri =
      mongoUri ||
      process.env.MONGODB_URI ||
      'mongodb://localhost:27017/lib_cart';

    // Nếu đã kết nối với cùng URI thì không làm gì
    if (this.isConnected && mongoose.connection.readyState === 1) {
      const currentUri =
        mongoose.connection.host +
        ':' +
        mongoose.connection.port +
        '/' +
        mongoose.connection.name;
      const newUri = uri.replace('mongodb://localhost:27017/', '');
      if (currentUri.includes(newUri)) {
        console.log('Database đã được kết nối với cùng URI');
        return;
      }
      // Nếu URI khác nhau, ngắt kết nối cũ trước
      await mongoose.disconnect();
      this.isConnected = false;
    }

    try {
      await mongoose.connect(uri, {
        // Các options mặc định
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      this.isConnected = true;
      console.log('Kết nối MongoDB thành công:', uri);

      // Xử lý sự kiện disconnect
      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB đã ngắt kết nối');
        this.isConnected = false;
      });

      // Xử lý lỗi kết nối
      mongoose.connection.on('error', (error) => {
        console.error('Lỗi kết nối MongoDB:', error);
        this.isConnected = false;
      });
    } catch (error) {
      console.error('Lỗi khi kết nối MongoDB:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('Đã ngắt kết nối MongoDB');
    } catch (error) {
      console.error('Lỗi khi ngắt kết nối MongoDB:', error);
      throw error;
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  getConnection() {
    return mongoose.connection;
  }
}

// Export instance để sử dụng
export const dbConnection = DatabaseConnection.getInstance();
