
import axios from 'axios';

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Export specific API services for components that import them
export const catalogueFormationApi = {
  getAllCatalogueFormation: (page = 1) => api.get(`/catalogue_formation?page=${page}`),
  getCatalogueFormationById: (id: number) => api.get(`/catalogue_formation/${id}`),
};

export const progressAPI = {
  getUserProgress: () => api.get('/stagiaire/progress')
};

export const stagiaireAPI = {
  getStagiaireData: () => api.get('/stagiaire'),
};

export const rankingService = {
  getGlobalRanking: () => api.get('/quiz/classement/global'),
  getQuizRanking: (quizId: string) => api.get(`/quiz/${quizId}/classement`),
  getUserRankingStats: () => api.get('/stagiaire/ranking-stats'),
};

// Sponsorship service
export const sponsorshipService = {
  getLink: () => api.get('/stagiaire/parrainage/link'),
  getReferrals: () => api.get('/stagiaire/parrainage/filleuls'),
  getStats: () => api.get('/stagiaire/parrainage/stats')
};

// Notification service API endpoints
export const notificationAPI = {
  getSettings: () => api.get('/notifications/settings'),
  updateSettings: (settings: any) => api.post('/notifications/settings', settings),
  registerDevice: (token: string) => api.post('/notifications/register-device', { token }),
  unregisterDevice: (token: string) => api.delete('/notifications/unregister-device', { data: { token } })
};

export default api;
