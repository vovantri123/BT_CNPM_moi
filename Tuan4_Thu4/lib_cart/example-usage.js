// Example: Cách sử dụng Cart Library trong project khác

import express from 'express';
import {
  CartLibrary,
  CartService,
  ProductService,
  UIComponents,
} from '@namtu/lib-cart';

const app = express();

// Setup middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

async function setupApplication() {
  try {
    // 1. Khởi tạo Cart Library
    await CartLibrary.initialize({
      mongoUri: 'mongodb://localhost:27017/my_ecommerce_app',
      // Không cần port vì chúng ta sẽ tích hợp vào app có sẵn
    });

    // 2. Seed dữ liệu mẫu (chỉ chạy lần đầu)
    await CartLibrary.seedData();

    // 3. Tích hợp routes của Cart Library vào app
    const cartMiddleware = await CartLibrary.createMiddleware();
    app.use('/shop', cartMiddleware);

    // 4. Tạo routes tùy chỉnh sử dụng services
    app.get('/', async (req, res) => {
      try {
        const cartSummary = await CartService.getCartSummary();
        const products = await ProductService.getAllProducts();

        res.render('home', {
          cartSummary,
          products: products.slice(0, 4), // 4 sản phẩm nổi bật
          UIComponents,
        });
      } catch (error) {
        res.status(500).send('Error loading homepage');
      }
    });

    // 5. API tùy chỉnh
    app.post('/api/quick-add-to-cart', async (req, res) => {
      try {
        const { productId } = req.body;
        const item = await CartService.addToCart(productId, 1);

        res.json({
          success: true,
          message: 'Added to cart successfully',
          item,
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      }
    });

    // 6. Sử dụng UI Components trong template tùy chỉnh
    app.get('/custom-cart', async (req, res) => {
      const cartSummary = await CartService.getCartSummary();

      // Tạo HTML using UI components
      const cartHTML = cartSummary.items
        .map((item) =>
          UIComponents.card({
            title: item.productName,
            image: item.image,
            content: `
            <p class="text-lg font-bold">${item.price.toLocaleString()} VNĐ</p>
            <p>Số lượng: ${item.quantity}</p>
          `,
            footer: UIComponents.button({
              text: 'Remove',
              variant: 'danger',
              onClick: `removeFromCart('${item._id}')`,
            }),
          })
        )
        .join('');

      res.send(`
        <html>
          <head>
            <title>Custom Cart</title>
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body class="p-8">
            <h1 class="text-3xl mb-8">My Custom Cart</h1>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              ${cartHTML}
            </div>
            <script>
              async function removeFromCart(itemId) {
                const response = await fetch('/shop/cart/api/cart/' + itemId, {
                  method: 'DELETE'
                });
                if (response.ok) {
                  location.reload();
                }
              }
            </script>
          </body>
        </html>
      `);
    });

    // 7. Checkout tùy chỉnh
    app.post('/checkout', async (req, res) => {
      try {
        const cartSummary = await CartService.getCartSummary();

        if (cartSummary.totalItems === 0) {
          return res.status(400).json({
            success: false,
            message: 'Cart is empty',
          });
        }

        // Xử lý thanh toán ở đây
        // ...

        // Xóa giỏ hàng sau khi thanh toán thành công
        await CartService.clearCart();

        res.json({
          success: true,
          message: 'Checkout successful',
          total: cartSummary.totalPrice,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Checkout failed',
        });
      }
    });

    // Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 App running on http://localhost:${PORT}`);
      console.log(`📦 Cart available at http://localhost:${PORT}/shop/cart`);
      console.log(
        `🛍️ Products available at http://localhost:${PORT}/shop/products`
      );
    });
  } catch (error) {
    console.error('❌ Failed to setup application:', error);
    process.exit(1);
  }
}

// Cleanup on exit
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down...');
  try {
    await CartLibrary.cleanup();
    console.log('✅ Cleanup completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
});

// Start the application
setupApplication();
