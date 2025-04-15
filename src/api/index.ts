import { User, Quiz, Category, QuizResult, UserProgress, LeaderboardEntry, Question, Formation } from '../types';
import { Answer, QuizSubmitData } from '../types/quiz';
import { decodeToken } from '@/utils/tokenUtils';

const API_URL = process.env.VITE_API_URL || 'http://localhost:8000/api';

// Log the current API URL to help with debugging
console.log('Using API URL:', API_URL);

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    // If unauthorized, clear token and redirect to login
    if (response.status === 401) {
      console.log('Unauthorized access, redirecting to login');
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
      throw new Error('Unauthorized, please login again');
    }
    
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
        'Content-Type': 'application/json',
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
        'Content-Type': 'application/json',
      },
    });
    localStorage.removeItem('token');
  },
};

// Quiz API
export const quizAPI = {
  getCategories: async (): Promise<string[]> => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(`${API_URL}/quiz/categories`, { headers });
    return handleResponse(response);
  },
  
  getQuizzesByCategory: async (categoryId: string): Promise<Quiz[]> => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(`${API_URL}/formations/categories/${categoryId}`, { headers });
    return handleResponse(response);
  },

  getQuizById: async (quizId: string): Promise<Quiz> => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(`${API_URL}/quizzes/${quizId}`, { headers });
    return handleResponse(response);
  },

  getQuizQuestions: async (quizId: string): Promise<Question[]> => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(`${API_URL}/quiz/${quizId}/questions`, { headers });
    return handleResponse(response);
  },

  getReponsesByQuestion: async (questionId: string): Promise<Answer[]> => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(`${API_URL}/questions/${questionId}/reponses`, { headers });
    const data = await handleResponse<Answer[]>(response);
    
    // Convert is_correct from 0/1 to boolean for internal use if needed
    return data.map(answer => ({
      ...answer,
      is_correct: answer.is_correct
    }));
  },

  submitQuiz: async (quizId: string, answers: Record<string, string>, score: number, timeSpent: number): Promise<QuizResult> => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Authorization': `Bearer ${token}`,
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
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(`${API_URL}/stagiaire/progress`, { headers });
    return handleResponse(response);
  },

  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(`${API_URL}/stagiaire/ranking/global`, { headers });
    return handleResponse(response);
  },
};

// Formation API
export const formationAPI = {
  getCategories: async (): Promise<string[]> => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(`${API_URL}/formation/categories`, { headers });
    return handleResponse(response);
  },

  getFormationsByStagiaire: async (): Promise<{ data: Formation[] }> => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    
    // First get the stagiaire ID from /api/me
    const meResponse = await fetch(`${API_URL}/me`, { headers });
    const meData = await handleResponse<{ user: any; stagiaire: { id: number } }>(meResponse);
    
    // Then get the formations using the stagiaire ID
    const response = await fetch(`${API_URL}/stagiaire/${meData.stagiaire.id}/formations`, { headers });
    return handleResponse(response);
  },
  
  getFormationsByCategory: async (categoryId: string): Promise<Formation[]> => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(`${API_URL}/formations/categories/${categoryId}`, { headers });
    return handleResponse(response);
  },
  
  getFormationById: async (formationId: string): Promise<Formation> => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    
    const response = await fetch(`${API_URL}/formations/${formationId}`, { headers });
    return handleResponse(response);
  }
};

// Making the function available for component imports
export const getReponsesByQuestion = quizAPI.getReponsesByQuestion;
