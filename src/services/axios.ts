import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://wizi-learn.com/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token d'authentification
axiosInstance.interceptors.request.use(
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

// Intercepteur pour gérer les erreurs d'authentification
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
      if (error.response?.status === 401) {
        // Remove token and emit an SPA event so the app can navigate centrally
        localStorage.removeItem("token");
        try {
          window.dispatchEvent(new CustomEvent("auth:logout"));
        } catch (e) {
          // fallback
          window.location.href = "/login";
        }
      }
    return Promise.reject(error);
  }
);

export default axiosInstance;
