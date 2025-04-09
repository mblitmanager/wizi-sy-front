import { User, Quiz, Category, QuizResult, UserProgress, LeaderboardEntry } from '../types';

// Base URL of our API
const API_URL = 'http://localhost:8000/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

// Authentication API
export const authAPI = {
  login: async (email: string, password: string): Promise<User> => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  register: async (username: string, email: string, password: string): Promise<User> => {
    const response = await fetch(`${API_URL}/stagiaire/ajouter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });
    return handleResponse(response);
  },

  getCurrentUser: async (): Promise<User> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');
    
    // Nous pourrions utiliser un endpoint dédié pour récupérer l'utilisateur courant
    // Mais comme ce n'est pas explicitement disponible dans les routes fournies,
    // nous devons adapter ce code à votre API spécifique
    const userId = localStorage.getItem('userId');
    if (!userId) throw new Error('User ID not found');
    
    // Supposons que nous puissions récupérer un stagiaire par son ID
    const response = await fetch(`${API_URL}/stagiaires/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  },
};

// Quiz API
export const quizAPI = {
  getCategories: async (): Promise<Category[]> => {
    const response = await fetch(`${API_URL}/formations`);
    return handleResponse(response);
  },

  getQuizzesByCategory: async (categoryId: string): Promise<Quiz[]> => {
    const response = await fetch(`${API_URL}/formations/${categoryId}/quizzes`);
    return handleResponse(response);
  },

  getQuizById: async (quizId: string): Promise<Quiz> => {
    const response = await fetch(`${API_URL}/quizzes/${quizId}`);
    return handleResponse(response);
  },

  submitQuizResult: async (result: Omit<QuizResult, 'id' | 'completedAt'>): Promise<QuizResult> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/stats/quiz/${result.quizId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(result),
    });
    return handleResponse(response);
  },
};

// User progress API
export const progressAPI = {
  getUserProgress: async (userId: string): Promise<UserProgress> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/stagiaire/${userId}/formations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    const response = await fetch(`${API_URL}/classement`);
    return handleResponse(response);
  },

  getUserStats: async (userId: string): Promise<any> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/stats/compare/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};

// Continuer à utiliser le mockAPI pour le développement tant que l'API n'est pas complètement disponible
export { mockAPI } from './mockAPI';
