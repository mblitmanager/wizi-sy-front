
import axios from 'axios';

const API_URL = process.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
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

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/login', credentials),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  resetPassword: (data: { token: string; password: string }) =>
    api.post('/auth/reset-password', data),
};

// User services
export const userService = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data: any) => api.put('/user/profile', data),
};

// Quiz services
export const quizService = {
  getQuizzes: () => api.get('/quizzes'),
  getQuiz: (id: string) => api.get(`/quizzes/${id}`),
  getQuestions: (id: string) => api.get(`/quiz/${id}/questions`),
  getCategories: () => api.get('/quiz/categories'),
  playQuiz: (id: string) => api.post(`/quizzes/${id}/play`),
  submitQuiz: (id: string, answers: any, score: number, timeSpent: number) =>
    api.post(`/quizzes/${id}/submit`, { answers, score, timeSpent }),
  getReponsesByQuestion: (questionId: string) => 
    api.get(`/questions/${questionId}/reponses`),
};

// Training services
export const trainingService = {
  getTrainings: () => api.get('/trainings'),
  getTraining: (id: string) => api.get(`/trainings/${id}`),
  getFormationsByCategory: (categoryId: string) => api.get(`/formations/categories/${categoryId}`),
};

// Ranking services
export const rankingService = {
  getRankings: () => api.get('/stagiaire/ranking/global'),
  getTrainingRankings: (trainingId: string) =>
    api.get(`/stagiaire/ranking/formation/${trainingId}`),
  getRewards: () => api.get('/stagiaire/rewards'),
};

// Media services
export const mediaService = {
  getMedia: () => api.get('/media'),
  getMediaItem: (id: string) => api.get(`/media/${id}`),
};

// Sponsorship services
export const sponsorshipService = {
  getLink: () => api.get('/stagiaire/parrainage/link'),
  getReferrals: () => api.get('/stagiaire/parrainage/filleuls'),
  getStats: () => api.get('/stagiaire/parrainage/stats'),
};

// Calendar services
export const calendarService = {
  getCalendar: () => api.get('/calendar'),
  getEvents: () => api.get('/calendar/events'),
};

// Contacts services
export const contactService = {
  getContacts: () => api.get('/stagiaire/contacts'),
  getCommerciaux: () => api.get('/stagiaire/contacts/commerciaux'),
  getFormateurs: () => api.get('/stagiaire/contacts/formateurs'),
  getPoleRelation: () => api.get('/stagiaire/contacts/pole-relation'),
};

// Stagiaire API
export const stagiaireAPI = {
  getFormations: () => api.get('/stagiaire/formations'),
  getFormationById: (formationId: string) => api.get(`/formations/${formationId}`),
  getProgressById: (formationId: string) => api.get(`/stagiaire/progress/${formationId}`),
};

// Export all services
export default api;
