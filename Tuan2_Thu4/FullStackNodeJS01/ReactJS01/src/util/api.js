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

export {
    createUserApi, loginApi, getUserApi
} 