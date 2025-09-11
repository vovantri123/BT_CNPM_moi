import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import {
  CartLibrary,
  CartService,
  ProductService,
  UIComponents,
} from '@vovantri27/lib-cart';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

async function setupApp() {
  try {
    // Khởi tạo thư viện với database riêng
    await CartLibrary.initialize({
      mongoUri: 'mongodb://localhost:27017/test_lib_cart',
    });

    // Seed dữ liệu mẫu nếu cần
    // await CartLibrary.seedData();

    // Tích hợp routes của thư viện
    const cartMiddleware = await CartLibrary.createMiddleware();
    app.use('/shop', cartMiddleware);

    // Trang chủ demo giao diện và service
    app.get('/', async (req, res) => {
      const cartSummary = await CartService.getCartSummary();
      const products = await ProductService.getAllProducts();
      res.render('home', {
        cartSummary,
        products: products.slice(0, 6),
        UIComponents,
      });
    });

    // Trang giỏ hàng chi tiết
    app.get('/cart', async (req, res) => {
      const cartSummary = await CartService.getCartSummary();
      res.render('cart', {
        cartSummary,
        UIComponents,
      });
    });

    // API thêm nhanh vào giỏ
    app.post('/api/quick-add-to-cart', async (req, res) => {
      try {
        const { productId } = req.body;
        const item = await CartService.addToCart(productId, 1);
        res.json({ success: true, item });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
    });

    app.listen(3001, () => {
      console.log('🚀 Test app running on http://localhost:3001');
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

setupApp();
