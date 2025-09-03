import axios from './axios.customize';

const createUserApi = (name, email, password) => {
    const URL_API = "/v1/api/register";
    const data = {
        name, email, password
    }
    return axios.post(URL_API, data)
}

const loginApi = (email, password) => {
    const URL_API = "/v1/api/login";
    const data = {
        email, password
    }
    return axios.post(URL_API, data)
}

const getUserApi = (current = 1, pageSize = 5) => {
    const URL_API = `/v1/api/users?current=${current}&pageSize=${pageSize}`;
    return axios.get(URL_API)
}

// Product APIs - với lazy loading
const getProductsByCategoryApi = (category = 'all', skip = 0, limit = 12) => {
    const URL_API = `/v1/api/products?category=${category}&skip=${skip}&limit=${limit}`;
    return axios.get(URL_API)
}

const getCategoriesApi = () => {
    const URL_API = "/v1/api/categories";
    return axios.get(URL_API)
}

const createProductApi = (productData) => {
    const URL_API = "/v1/api/products";
    return axios.post(URL_API, productData)
}

export {
    createUserApi, 
    loginApi, 
    getUserApi,
    getProductsByCategoryApi,
    getCategoriesApi,
    createProductApi
} 