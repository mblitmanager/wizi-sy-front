
import { User, Quiz, Category, QuizResult, UserProgress, LeaderboardEntry, Question, Formation } from '../types';
import { Answer, QuizSubmitData } from '../types/quiz';
import { decodeToken } from '@/utils/tokenUtils';

const API_URL = process.env.VITE_API_URL || 'http://laravel.test/api';

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network response was not ok' }));
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');
    
    const response = await fetch(`${API_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  logout: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    localStorage.removeItem('token');
  },
};

// Quiz API
export const quizAPI = {
  getCategories: async (): Promise<string[]> => {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    };
    
    const response = await fetch(`${API_URL}/quiz/categories`, { headers });
    return handleResponse(response);
  },
  
  getQuizzesByCategory: async (categoryId: string): Promise<Quiz[]> => {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    };
    
    const response = await fetch(`${API_URL}/formations/categories/${categoryId}`, { headers });
    return handleResponse(response);
  },

  getQuizById: async (quizId: string): Promise<Quiz> => {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    };
    
    const response = await fetch(`${API_URL}/quizzes/${quizId}`, { headers });
    return handleResponse(response);
  },

  getQuizQuestions: async (quizId: string): Promise<Question[]> => {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    };
    
    const response = await fetch(`${API_URL}/quiz/${quizId}/questions`, { headers });
    return handleResponse(response);
  },

  getReponsesByQuestion: async (questionId: string): Promise<Answer[]> => {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    };
    
    const response = await fetch(`${API_URL}/questions/${questionId}/reponses`, { headers });
    return handleResponse(response);
  },

  submitQuiz: async (quizId: string, answers: Record<string, string>, score: number, timeSpent: number): Promise<QuizResult> => {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(`${API_URL}/quizzes/${quizId}/submit`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ answers, score, timeSpent }),
    });
    return handleResponse(response);
  },
};

// Progress API
export const progressAPI = {
  getUserProgress: async (): Promise<UserProgress> => {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    };
    
    const response = await fetch(`${API_URL}/stagiaire/progress`, { headers });
    return handleResponse(response);
  },

  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    const headers: HeadersInit = {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    };
    
    const response = await fetch(`${API_URL}/stagiaire/ranking/global`, { headers });
    return handleResponse(response);
  },
};

// New method for fetching formations by stagiaire
export const getFormationsByStagiaire = async (stagiaireId: string): Promise<any> => {
  const headers: HeadersInit = {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  };
  
  const response = await fetch(`${API_URL}/stagiaire/${stagiaireId}/formations`, { headers });
  return handleResponse(response);
};

// Making the function available for component imports
export const getReponsesByQuestion = quizAPI.getReponsesByQuestion;
