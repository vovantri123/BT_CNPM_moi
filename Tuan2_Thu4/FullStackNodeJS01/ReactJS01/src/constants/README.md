# Constants Documentation

## Tổng quan

Folder `constants` chứa các hằng số được sử dụng trong toàn bộ ứng dụng React. Việc tập trung các hằng số này giúp:

-   **Duy trì tính nhất quán**: Tất cả các giá trị đều được quản lý ở một nơi
-   **Dễ bảo trì**: Chỉ cần thay đổi ở một chỗ khi cần cập nhật
-   **Tránh lỗi typo**: Sử dụng constants thay vì hardcode strings
-   **Code dễ đọc hơn**: Tên constants có ý nghĩa rõ ràng

## Cấu trúc

### 1. `index.js` - Constants chính

```javascript
import { CATEGORY_LABELS, MESSAGES, USER_ROLES } from "../constants";
```

**Chứa:**

-   `CATEGORY_LABELS`: Mapping tên danh mục sản phẩm
-   `USER_ROLES`: Vai trò người dùng
-   `MESSAGES`: Thông báo UI
-   `VALIDATION_MESSAGES`: Thông báo validation form
-   `STORAGE_KEYS`: Keys cho localStorage
-   `APP_STATUS`: Trạng thái ứng dụng

### 2. `config.js` - Cấu hình API và ứng dụng

```javascript
import { API_ENDPOINTS, APP_CONFIG, PAGINATION } from "../constants/config";
```

**Chứa:**

-   `API_ENDPOINTS`: Đường dẫn API endpoints
-   `APP_CONFIG`: Cấu hình ứng dụng
-   `PAGINATION`: Cài đặt phân trang

### 3. `constants.js` - Constants bổ sung

```javascript
import { HTTP_STATUS, ROUTES, DEBOUNCE_DELAY } from "../constants/constants";
```

**Chứa:**

-   `HTTP_STATUS`: Mã trạng thái HTTP
-   `ROUTES`: Đường dẫn routes
-   `DEBOUNCE_DELAY`: Thời gian delay cho debounce

## Cách sử dụng

### Import constants

```javascript
// Import từ file chính
import { MESSAGES, CATEGORY_LABELS } from "../constants";

// Import từ config
import { API_ENDPOINTS, PAGINATION } from "../constants/config";

// Import tất cả
import { MESSAGES, API_ENDPOINTS, HTTP_STATUS } from "../constants/constants";
```

### Sử dụng trong components

```javascript
// Thay vì hardcode
<Text>Đang tải...</Text>

// Sử dụng constants
<Text>{MESSAGES.LOADING}</Text>
```

### Sử dụng trong API calls

```javascript
// Thay vì hardcode
const response = await axios.get("/v1/api/products");

// Sử dụng constants
const response = await axios.get(API_ENDPOINTS.PRODUCTS);
```

### Sử dụng trong form validation

```javascript
// Thay vì hardcode
message: "Please input your email!";

// Sử dụng constants
message: VALIDATION_MESSAGES.REQUIRED_EMAIL;
```

## Best Practices

1. **Luôn sử dụng constants thay vì hardcode strings**
2. **Đặt tên constants có ý nghĩa và rõ ràng**
3. **Nhóm các constants liên quan vào cùng một object**
4. **Cập nhật constants khi có thay đổi requirements**
5. **Import chỉ những constants cần thiết để tối ưu bundle size**

## Ví dụ thực tế

### Before (hardcode)

```javascript
const response = await axios.get("/v1/api/products");
localStorage.setItem("access_token", token);
notification.success({ description: "Success" });
```

### After (sử dụng constants)

```javascript
const response = await axios.get(API_ENDPOINTS.PRODUCTS);
localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
notification.success({ description: MESSAGES.SUCCESS });
```

## Lợi ích đã đạt được

✅ **Centralized Management**: Tất cả constants ở một nơi  
✅ **Type Safety**: IntelliSense và autocomplete  
✅ **Consistency**: Đảm bảo tính nhất quán trong toàn ứng dụng  
✅ **Maintainability**: Dễ dàng cập nhật và bảo trì  
✅ **Refactoring**: An toàn khi refactor code
