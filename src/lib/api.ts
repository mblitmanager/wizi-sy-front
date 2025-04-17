
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'https://www.wizi-learn.com/public/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add a request interceptor to include the token in all requests
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

// Add a response interceptor for handling token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear local storage and redirect to login if token is invalid
      console.log('Unauthorized access detected, redirecting to login');
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
); 
