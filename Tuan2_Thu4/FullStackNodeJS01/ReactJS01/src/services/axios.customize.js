import axios from "axios";
import { APP_CONFIG, API_ENDPOINTS } from "../constants/config";
import { STORAGE_KEYS } from "../constants";

// Set config defaults when creating the instance
const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || APP_CONFIG.API_BASE_URL
});

// Alter defaults after instance has been created
// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    // Chỉ thêm Authorization header nếu có token và không phải là public endpoints
    const publicEndpoints = [API_ENDPOINTS.PRODUCTS, API_ENDPOINTS.CATEGORIES, API_ENDPOINTS.REGISTER, API_ENDPOINTS.LOGIN];
    const isPublicEndpoint = publicEndpoints.some(endpoint => config.url?.includes(endpoint));
    
    if (!isPublicEndpoint) {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (response && response.data) return response.data;
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error?.response?.data) return error?.response?.data;
    return Promise.reject(error);
});

export default instance;