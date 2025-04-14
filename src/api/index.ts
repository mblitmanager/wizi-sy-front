
import { User, Quiz, Category, QuizResult, UserProgress, LeaderboardEntry, Question, Answer, QuizSubmitData } from '../types';
import { decodeToken } from '@/utils/tokenUtils';
import axios from 'axios';

// Base URL of our API
const API_URL = 'http://localhost:8000/api';

// Helper function to handle API responses
const handleResponse = async <T>(response: Response): Promise<T> => {
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
    if (!token) throw new Error('Utilisateur non authontifié');
    
    const response = await fetch(`${API_URL}/me`, {
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
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    
      const response = await fetch(`${API_URL}/formation/categories`, { headers });
      const categories = await handleResponse<string[]>(response);
      
      // Transform the string array into Category objects
      return categories.map((name, index) => ({
        id: `cat-${index + 1}`,
        name,
        description: `Quiz de ${name}`,
        image_url: '',
        icon: 'book',
        color: '#4F46E5',
        colorClass: 'bg-indigo-600',
        quizCount: 0
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to mock data if API fails
      return [
        { id: 'cat-1', name: 'Bureautique', description: 'Quiz de Bureautique', image_url: '', icon: 'computer', color: '#4F46E5', colorClass: 'bg-indigo-600', quizCount: 5 },
        { id: 'cat-2', name: 'Internet', description: 'Quiz de Internet', image_url: '', icon: 'globe', color: '#0EA5E9', colorClass: 'bg-sky-600', quizCount: 3 },
        { id: 'cat-3', name: 'Langue', description: 'Quiz de Langue', image_url: '', icon: 'message-square', color: '#10B981', colorClass: 'bg-emerald-600', quizCount: 4 },
        { id: 'cat-4', name: 'Création', description: 'Quiz de Création', image_url: '', icon: 'palette', color: '#F59E0B', colorClass: 'bg-amber-600', quizCount: 2 }
      ];
    }
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
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}/quizzes/${quizId}`, { headers });
      return handleResponse<Quiz>(response);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      throw error;
    }
  },

  getQuizQuestions: async (quizId: string): Promise<Question[]> => {
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}/quiz/${quizId}/questions`, { headers });
      const data = await handleResponse<Question[]>(response);
      return data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      // Return mock questions if the API fails
      return [
        {
          id: `q-${quizId}-1`,
          quiz_id: quizId,
          text: "Question d'exemple 1",
          type: "choix multiples",
          points: 10,
          correct_answer: "0",
          options: ["Réponse A", "Réponse B", "Réponse C"]
        },
        {
          id: `q-${quizId}-2`,
          quiz_id: quizId,
          text: "Question d'exemple 2",
          type: "vrai faux",
          points: 5,
          correct_answer: "1",
        }
      ] as Question[];
    }
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
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}/questions/${questionId}/reponses`, { headers });
      const data = await handleResponse<{ data: Answer[] }>(response);
      return data.data || [];
    } catch (error) {
      console.error('Error fetching responses:', error);
      // Return mock answers if the API fails
      return [
        {
          id: `ans-${questionId}-1`,
          question_id: questionId,
          text: "Réponse A",
          is_correct: 1
        },
        {
          id: `ans-${questionId}-2`,
          question_id: questionId,
          text: "Réponse B",
          is_correct: 0
        },
        {
          id: `ans-${questionId}-3`,
          question_id: questionId,
          text: "Réponse C",
          is_correct: 0
        }
      ] as Answer[];
    }
  },

  submitQuizResult: async (result: QuizSubmitData): Promise<QuizResult> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not authenticated');
    
    const response = await fetch(`${API_URL}/quizzes/${result.quizId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        answers: result.answers,
        score: result.score,
        correctAnswers: result.correctAnswers,
        totalQuestions: result.totalQuestions,
        timeSpent: result.timeSpent
      }),
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

  getUserStats: async (userId: string): Promise<UserProgress> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/stagiaire/progress`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};

// Fonction pour récupérer les réponses d'une question
export const getReponsesByQuestion = async (questionId: string): Promise<Answer[]> => {
  try {
    const response = await axios.get(`${API_URL}/questions/${questionId}/reponses`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return (response.data as { data: Answer[] }).data;
  } catch (error) {
    console.error('Erreur lors de la récupération des réponses:', error);
    // Return mock answers if the API fails
    return [
      {
        id: `ans-${questionId}-1`,
        question_id: questionId,
        text: "Réponse A",
        is_correct: 1
      },
      {
        id: `ans-${questionId}-2`,
        question_id: questionId,
        text: "Réponse B",
        is_correct: 0
      },
      {
        id: `ans-${questionId}-3`,
        question_id: questionId,
        text: "Réponse C",
        is_correct: 0
      }
    ] as Answer[];
  }
};

// Export mockAPI for fallback or development purposes
export { mockAPI } from './mockAPI';
