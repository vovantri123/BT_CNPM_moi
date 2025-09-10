import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dbConnection } from './database/connection.js';
import cartRoutes from './routes/cartRoutes.js';
import productRoutes from './routes/productRoutes.js';
import { UIComponents } from './components/UIComponents.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class CartLibraryServer {
  private app: express.Application;
  private port: number;

  constructor(port: number = 3000) {
    this.app = express();
    this.port = port;
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    // Body parser
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Static files
    this.app.use('/public', express.static(path.join(__dirname, '../public')));

    // View engine
    this.app.set('view engine', 'ejs');
    this.app.set('views', path.join(__dirname, '../views'));

    // CORS cho API
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
      );
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
      );

      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
      } else {
        next();
      }
    });
  }

  private setupRoutes(): void {
    // Home route - redirect to products
    this.app.get('/', (req, res) => {
      res.redirect('/products');
    });

    // Cart routes
    this.app.use('/cart', cartRoutes);

    // Product routes
    this.app.use('/products', productRoutes);

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).render('error', {
        message: 'Trang không tìm thấy',
        error: { status: 404 },
        UIComponents,
      });
    });

    // Error handler
    this.app.use(
      (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        console.error('Error:', err);
        res.status(err.status || 500).render('error', {
          message: err.message || 'Có lỗi xảy ra',
          error: process.env.NODE_ENV === 'development' ? err : {},
          UIComponents,
        });
      }
    );
  }

  async start(): Promise<void> {
    try {
      // Kết nối database
      await dbConnection.connect();

      // Start server
      this.app.listen(this.port, () => {
        console.log(
          `🚀 Cart Library Server đang chạy tại http://localhost:${this.port}`
        );
        console.log(`📦 API endpoints:`);
        console.log(`   - Cart: http://localhost:${this.port}/cart`);
        console.log(`   - Products: http://localhost:${this.port}/products`);
      });
    } catch (error) {
      console.error('Lỗi khi khởi động server:', error);
      process.exit(1);
    }
  }

  getApp(): express.Application {
    return this.app;
  }
}

// Chạy server
const server = new CartLibraryServer();
server.start().catch(console.error);
