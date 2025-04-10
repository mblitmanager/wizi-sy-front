
import { User, Quiz, Category, QuizResult, UserProgress, LeaderboardEntry, Question, Answer } from '../types';

// Base URL of our API
const API_URL = 'http://laravel.test/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network response was not ok' }));
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
    const data = await handleResponse(response);
    // Assurer que la réponse contient un token et un ID
    if (!data.token) {
      data.token = data.token || 'default-token';
    }
    return data;
  },

  register: async (username: string, email: string, password: string): Promise<User> => {
    const response = await fetch(`${API_URL}/stagiaire/ajouter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await handleResponse(response);
    // Assurer que la réponse contient un token et un ID
    if (!data.token) {
      data.token = data.token || 'default-token';
    }
    return data;
  },

  getCurrentUser: async (): Promise<User> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');
    
    // Nous pourrions utiliser un endpoint dédié pour récupérer l'utilisateur courant
    // Mais comme ce n'est pas explicitement disponible dans les routes fournies,
    // nous devons adapter ce code à votre API spécifique
    const userId = localStorage.getItem('userId');
    if (!userId) throw new Error('User ID not found');
    
    // Validation du userId avant de faire la requête
    if (userId === 'undefined' || userId === 'null') {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      throw new Error('Invalid user ID');
    }
    
    // Supposons que nous puissions récupérer un stagiaire par son ID
    const response = await fetch(`${API_URL}/stagiaires/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    const data = await handleResponse(response);
    // Ajouter le token à l'objet utilisateur pour qu'il soit disponible dans l'application
    data.token = token;
    return data;
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
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}/formations/${categoryId}/quizzes`, { headers });
    return handleResponse(response);
  },

  getQuizById: async (quizId: string): Promise<Quiz> => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}/quizzes/${quizId}`, { headers });
    return handleResponse(response);
  },

  getQuizQuestions: async (quizId: string): Promise<Question[]> => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}/quizzes/${quizId}/questions`, { headers });
    return handleResponse(response);
  },

  getQuestionById: async (questionId: string): Promise<Question> => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}/questions/${questionId}`, { headers });
    return handleResponse(response);
  },

  getResponsesByQuestion: async (questionId: string): Promise<Answer[]> => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}/questions/${questionId}/reponses`, { headers });
    return handleResponse(response);
  },

  submitQuizResult: async (result: Omit<QuizResult, 'id' | 'completedAt'>): Promise<QuizResult> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');
    
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
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}/classement`, { headers });
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

// Export mockAPI for fallback or development purposes
export { mockAPI } from './mockAPI';
