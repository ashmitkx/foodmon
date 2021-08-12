import axios from 'axios';

export const dataAPI = axios.create({
    baseURL: '/api/v1',
    withCredentials: true
});

export const authAPI = axios.create({
    baseURL: '/auth',
    withCredentials: true
});
