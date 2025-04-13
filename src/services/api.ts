import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

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
    api.post('/auth/login', credentials),
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
  playQuiz: (id: string) => api.post(`/quizzes/${id}/play`),
  submitQuiz: (id: string, answers: any) =>
    api.post(`/quizzes/${id}/submit`, { answers }),
};

// Training services
export const trainingService = {
  getTrainings: () => api.get('/trainings'),
  getTraining: (id: string) => api.get(`/trainings/${id}`),
};

// Ranking services
export const rankingService = {
  getRankings: () => api.get('/rankings'),
  getTrainingRankings: (trainingId: string) =>
    api.get(`/rankings/training/${trainingId}`),
  getRewards: () => api.get('/rankings/rewards'),
};

// Media services
export const mediaService = {
  getMedia: () => api.get('/media'),
  getMediaItem: (id: string) => api.get(`/media/${id}`),
};

// Sponsorship services
export const sponsorshipService = {
  getLink: () => api.get('/sponsorship/link'),
  getReferrals: () => api.get('/sponsorship/referrals'),
};

// Calendar services
export const calendarService = {
  getCalendar: () => api.get('/calendar'),
  getEvents: () => api.get('/calendar/events'),
};

// Contacts services
export const contactService = {
  getContacts: () => api.get('/contacts'),
};

// Admin services
export const adminService = {
  // User management
  getUsers: () => api.get('/admin/users'),
  createUser: (data: any) => api.post('/admin/users', data),
  updateUser: (id: string, data: any) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),

  // Quiz management
  createQuiz: (data: any) => api.post('/admin/quizzes', data),
  updateQuiz: (id: string, data: any) => api.put(`/admin/quizzes/${id}`, data),
  deleteQuiz: (id: string) => api.delete(`/admin/quizzes/${id}`),

  // Question management
  createQuestion: (data: any) => api.post('/admin/questions', data),
  updateQuestion: (id: string, data: any) =>
    api.put(`/admin/questions/${id}`, data),
  deleteQuestion: (id: string) => api.delete(`/admin/questions/${id}`),

  // Media management
  uploadMedia: (data: FormData) => api.post('/admin/media', data),
  deleteMedia: (id: string) => api.delete(`/admin/media/${id}`),

  // Statistics
  getStatistics: () => api.get('/admin/statistics'),
};

export default api; 