# 🛒 Cart Library

---

## ✨ Tính năng nổi bật

- UI Components: Input, Button, Modal, Card
- CRUD giỏ hàng: Thêm, sửa, xóa, xóa toàn bộ
- Responsive UI với TailwindCSS
- EJS templates
- MongoDB + Mongoose
- TypeScript ES Modules
- API RESTful
- Có thể publish NPM

---

## 🛠️ Hướng dẫn cài đặt & sử dụng

### Yêu cầu hệ thống

- Node.js >= 16
- MongoDB >= 4.4
- PNPM (hoặc NPM/Yarn)

### Cài đặt

```bash
cd lib_cart
pnpm install
pnpm run seed    # Tạo dữ liệu mẫu
pnpm run dev     # Development
pnpm run build   # Production build
pnpm start       # Run production
```

### Sử dụng như thư viện NPM

```bash
npm install @vovantri27/lib-cart
```

```typescript
import { CartLibrary, CartService, UIComponents } from '@vovantri27/lib-cart';
await CartLibrary.initialize({ mongoUri: 'mongodb://localhost:27017/myapp' });
const cart = await CartService.getCartSummary();
const button = UIComponents.button({ text: 'Add to Cart', variant: 'primary' });
```

---

## 📦 Publish lên NPM

1. Đăng nhập NPM: `npm login`
2. Build: `pnpm run build`
3. Kiểm tra files: `npm pack --dry-run`
4. Publish: `npm publish --access public`
5. Kiểm tra: `npm view @vovantri27/lib-cart`

### Update version

```bash
npm version patch|minor|major
npm publish
```

---

## 🔧 Troubleshooting

- Khi phát triển thư viện, hãy comment đoạn khởi chạy server trong `server.ts` để tránh tự động chạy ứng dụng:
    ```typescript
    // Khởi chạy server
    // const server = new CartLibraryServer();
    // server.start().catch(console.error);
    ```

---
