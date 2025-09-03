// API endpoints configuration
export const API_ENDPOINTS = {
    // Auth endpoints
    REGISTER: '/v1/api/register',
    LOGIN: '/v1/api/login',
    USERS: '/v1/api/users',
    ACCOUNT: '/v1/api/account',
    
    // Product endpoints
    PRODUCTS: '/v1/api/products',
    CATEGORIES: '/v1/api/categories'
};

// App configuration
export const APP_CONFIG = {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8888',
    APP_NAME: 'ReactJS Product Store',
    VERSION: '1.0.0'
};

// Pagination constants
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 12,
    MAX_PAGE_SIZE: 50
};
