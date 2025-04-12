import { User, Quiz, Category, QuizResult, UserProgress, LeaderboardEntry, Question, Answer } from '../types';
import { decodeToken } from '@/utils/tokenUtils';

// Base URL of our API
const API_URL = 'http://localhost:8000/api';

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
    
    // If token exists, decode it to extract user information
    if (data.token) {
      const decodedToken = decodeToken(data.token);
      
      // If token contains user ID, ensure it's set in the return data
      if (decodedToken && decodedToken.id && !data.id) {
        data.id = decodedToken.id;
      }
      
      // If token contains role information, ensure it's set in the return data
      if (decodedToken && decodedToken.role && !data.role) {
        data.role = decodedToken.role;
      }
    } else {
      // Fallback for testing/development
      data.token = data.token || 'default-token';
    }
    
    return data;
  },

  register: async (username: string, email: string, password: string): Promise<User> => {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await handleResponse(response);
    
    // If token exists, decode it to extract user information
    if (data.token) {
      const decodedToken = decodeToken(data.token);
      
      // If token contains user ID, ensure it's set in the return data
      if (decodedToken && decodedToken.id && !data.id) {
        data.id = decodedToken.id;
      }
      
      // If token contains role information, ensure it's set in the return data
      if (decodedToken && decodedToken.role && !data.role) {
        data.role = decodedToken.role;
      }
    } else {
      // Fallback for testing/development
      data.token = data.token || 'default-token'; 
    }
    
    return data;
  },

  getCurrentUser: async (): Promise<User> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');
    
    const response = await fetch(`${API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    const data = await handleResponse(response);
    
    // If response doesn't include role but token does, add it
    if (!data.role) {
      const decodedToken = decodeToken(token);
      if (decodedToken && decodedToken.role) {
        data.role = decodedToken.role;
      }
    }
    
    // Add token to user object
    data.token = token;
    return data;
  },

  logout: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  },
};

// Quiz API
export const quizAPI = {
  getCategories: async (): Promise<Category[]> => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  
    const response = await fetch(`${API_URL}/formation/categories`, { headers });
    return handleResponse(response);
  },
  
  getQuizzesByCategory: async (categoryId: string): Promise<Quiz[]> => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}/formations/categories/${categoryId}`, { headers });
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
    
    const response = await fetch(`${API_URL}/quizzes/${result.quizId}/submit`, {
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
    const response = await fetch(`${API_URL}/stagiaire/formations`, {
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
    
    const response = await fetch(`${API_URL}/stagiaire/ranking/global`, { headers });
    return handleResponse(response);
  },

  getUserStats: async (userId: string): Promise<any> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/stagiaire/progress`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};

// Export mockAPI for fallback or development purposes
export { mockAPI } from './mockAPI';
