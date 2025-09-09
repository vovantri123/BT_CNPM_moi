import axios from './axios.customize';
import { API_ENDPOINTS, PAGINATION } from '../constants/config';

const createUserApi = (name, email, password) => {
  const data = {
    name,
    email,
    password,
  };
  return axios.post(API_ENDPOINTS.REGISTER, data);
};

const loginApi = (email, password) => {
  const data = {
    email,
    password,
  };
  return axios.post(API_ENDPOINTS.LOGIN, data);
};

const getUserApi = (current = 1, pageSize = 5) => {
  const URL_API = `${API_ENDPOINTS.USERS}?current=${current}&pageSize=${pageSize}`;
  return axios.get(URL_API);
};

// Product APIs - với lazy loading
const getProductsByCategoryApi = (
  category = 'all',
  skip = 0,
  limit = PAGINATION.DEFAULT_PAGE_SIZE
) => {
  const URL_API = `${API_ENDPOINTS.PRODUCTS}?category=${category}&skip=${skip}&limit=${limit}`;
  return axios.get(URL_API);
};

const getCategoriesApi = () => {
  return axios.get(API_ENDPOINTS.CATEGORIES);
};

const createProductApi = (productData) => {
  return axios.post(API_ENDPOINTS.PRODUCTS, productData);
};

// Search APIs
const searchProductsApi = (params) => {
  const searchParams = new URLSearchParams();

  Object.keys(params).forEach((key) => {
    if (
      params[key] !== '' &&
      params[key] !== null &&
      params[key] !== undefined
    ) {
      searchParams.append(key, params[key]);
    }
  });

  const URL_API = `${API_ENDPOINTS.PRODUCTS}/search?${searchParams.toString()}`;
  return axios.get(URL_API);
};

const syncProductsToElasticApi = () => {
  return axios.post(`${API_ENDPOINTS.PRODUCTS}/sync`);
};

export {
  createUserApi,
  loginApi,
  getUserApi,
  getProductsByCategoryApi,
  getCategoriesApi,
  createProductApi,
  searchProductsApi,
  syncProductsToElasticApi,
};
