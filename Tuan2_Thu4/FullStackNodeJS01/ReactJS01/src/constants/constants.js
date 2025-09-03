// Re-export all constants from different files
export * from './index';
export * from './config';

// Additional utility constants
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    PRODUCTS: '/products',
    USERS: '/users',
    PROFILE: '/profile'
};

export const DEBOUNCE_DELAY = {
    SEARCH: 300,
    RESIZE: 100,
    SCROLL: 50
};
