import axios from 'axios';

const isProduction = import.meta.env.PROD;

const API_BASE_URL = isProduction
    ? 'https://hospital-management-git-764aba-jayanisrimali666-2764s-projects.vercel.app/api'
    : 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export default api;
