import axios from "axios";

const API_URL = process.env.VITE_API_URL || "http://localhost:8000/api";

// Log the current API URL to help with debugging
console.log("Using API URL:", API_URL);

// Déterminer si nous sommes en développement ou en production
const isDevelopment = process.env.NODE_ENV === 'development';
const isPreview = window.location.hostname.includes('lovable.app');

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Désactiver withCredentials en développement et en preview
  withCredentials: !isDevelopment && !isPreview
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized access detected, redirecting to login");
      localStorage.removeItem("token");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (email: string, password: string) => {
    try {
      console.log('Tentative de connexion avec:', { email });
      const response = await api.post('/login', { email, password });
      console.log('Réponse de connexion:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      if (error.response) {
        console.error('Détails de l\'erreur:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      }
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/me');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/logout');
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  },
};

// Export all services
export default api;
