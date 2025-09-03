// Category mappings
export const CATEGORY_LABELS = {
    'all': 'Tất cả sản phẩm',
    'electronics': 'Điện tử',
    'clothing': 'Thời trang',
    'books': 'Sách',
    'home': 'Gia dụng',
    'sports': 'Thể thao',
    'beauty': 'Làm đẹp',
    'toys': 'Đồ chơi',
    'food': 'Thực phẩm'
};

// User roles
export const USER_ROLES = {
    ADMIN: 'Admin',
    USER: 'User'
};

// UI Messages
export const MESSAGES = {
    LOADING: 'Đang tải...',
    LOADING_MORE: 'Đang tải thêm sản phẩm...',
    NO_DATA: 'Không có dữ liệu',
    ERROR: 'Có lỗi xảy ra',
    SUCCESS: 'Thành công',
    LOGIN_SUCCESS: 'Đăng nhập thành công',
    REGISTER_SUCCESS: 'Đăng ký thành công',
    LOGOUT_SUCCESS: 'Đăng xuất thành công',
    UNAUTHORIZED: 'Không có quyền truy cập',
    NETWORK_ERROR: 'Lỗi kết nối mạng',
    VALIDATION_ERROR: 'Dữ liệu không hợp lệ'
};

// Form validation messages
export const VALIDATION_MESSAGES = {
    REQUIRED_EMAIL: 'Vui lòng nhập email!',
    REQUIRED_PASSWORD: 'Vui lòng nhập mật khẩu!',
    REQUIRED_NAME: 'Vui lòng nhập tên!',
    INVALID_EMAIL: 'Email không hợp lệ!',
    PASSWORD_MIN_LENGTH: 'Mật khẩu phải có ít nhất 6 ký tự!',
};

// Local storage keys
export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_INFO: 'user_info',
    THEME: 'theme_preference'
};

// Application status
export const APP_STATUS = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error'
};
