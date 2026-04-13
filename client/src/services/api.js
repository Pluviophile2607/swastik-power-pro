import axios from 'axios';

// Vite environment variables are accessible via import.meta.env
export const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
const API_URL = `${BASE_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for global error handling (optional, e.g., redirect to login on 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Local check: if we're not on the login page already
      if (!window.location.pathname.includes('/login')) {
         localStorage.removeItem('token');
         window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
