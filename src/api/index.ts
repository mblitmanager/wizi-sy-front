
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
    const response = await fetch(`${API_URL}/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};

// Quiz API
export const quizAPI = {
  getCategories: async (): Promise<Category[]> => {
    const response = await fetch(`${API_URL}/formations.json`);
    return handleResponse(response);
  },

  getQuizzesByCategory: async (categoryId: string): Promise<Quiz[]> => {
    const response = await fetch(`${API_URL}/quizzes.json?category=${categoryId}`);
    return handleResponse(response);
  },

  getQuizById: async (quizId: string): Promise<Quiz> => {
    const response = await fetch(`${API_URL}/quizzes/${quizId}.json`);
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

// Mock data for development
export const mockAPI = {
  getCategories: (): Category[] => [
    {
      id: '1',
      name: 'Bureautique',
      color: '#3D9BE9',
      icon: 'file-text',
      description: 'Maîtrisez les outils de bureautique essentiels',
      quizCount: 8,
      colorClass: 'category-bureautique'
    },
    {
      id: '2',
      name: 'Langues',
      color: '#A55E6E',
      icon: 'message-square',
      description: 'Améliorez vos compétences linguistiques',
      quizCount: 6,
      colorClass: 'category-langues'
    },
    {
      id: '3',
      name: 'Internet',
      color: '#FFC533',
      icon: 'globe',
      description: 'Découvrez le monde du web et des réseaux sociaux',
      quizCount: 5,
      colorClass: 'category-internet'
    },
    {
      id: '4',
      name: 'Création',
      color: '#9392BE',
      icon: 'palette',
      description: 'Explorez les outils de création graphique',
      quizCount: 7,
      colorClass: 'category-creation'
    },
  ],

  getQuizzesByCategory: (categoryId: string): Quiz[] => [
    {
      id: '1',
      title: 'Les bases de Word',
      description: 'Apprenez les fondamentaux de Microsoft Word',
      category: '1',
      level: 'débutant',
      questions: [
        {
          id: '1',
          text: 'Comment créer un nouveau document dans Word?',
          answers: [
            { id: '1', text: 'Fichier > Nouveau', isCorrect: true },
            { id: '2', text: 'Edition > Créer', isCorrect: false },
            { id: '3', text: 'Outils > Document', isCorrect: false },
            { id: '4', text: 'Affichage > Nouveau', isCorrect: false },
          ],
        },
        {
          id: '2',
          text: 'Quel raccourci clavier permet de mettre un texte en gras?',
          answers: [
            { id: '1', text: 'Ctrl+G', isCorrect: false },
            { id: '2', text: 'Ctrl+B', isCorrect: true },
            { id: '3', text: 'Ctrl+F', isCorrect: false },
            { id: '4', text: 'Ctrl+I', isCorrect: false },
          ],
        },
      ],
      points: 10,
    },
    {
      id: '2',
      title: 'Excel pour débutants',
      description: 'Les premières étapes avec Microsoft Excel',
      category: '1',
      level: 'débutant',
      questions: [],
      points: 10,
    },
  ],

  getLeaderboard: (): LeaderboardEntry[] => [
    { userId: '1', username: 'JeanDupont', points: 1250, level: 8, rank: 1 },
    { userId: '2', username: 'MarieMartin', points: 980, level: 6, rank: 2 },
    { userId: '3', username: 'PierreDurand', points: 870, level: 5, rank: 3 },
    { userId: '4', username: 'SophieBernard', points: 750, level: 4, rank: 4 },
    { userId: '5', username: 'LucRobert', points: 650, level: 4, rank: 5 },
  ],
};
