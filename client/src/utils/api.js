import axios from 'axios';

const isProduction = import.meta.env.PROD;

const API_BASE_URL = isProduction
    ? 'https://hospital-management-system-backend-one.vercel.app/api' // Replace with your actual backend URL later
    : 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export default api;
