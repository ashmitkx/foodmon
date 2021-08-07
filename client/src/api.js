import axios from 'axios';

export const dataAPI = axios.create({
    baseURL: 'http://localhost:5000/api/v1'
});

export const authAPI = axios.create({
    baseURL: 'http://localhost:5000/auth'
});
