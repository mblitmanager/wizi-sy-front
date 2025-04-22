import axios from "axios";

const API_URL = process.env.VITE_API_URL || "http://localhost:8000/api";

// Log the current API URL to help with debugging
console.log("Using API URL:", API_URL);

// Déterminer si nous sommes en développement ou en production
const isDevelopment = process.env.NODE_ENV === 'development';
const isPreview = window.location.hostname.includes('lovable.app');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Désactiver withCredentials en développement et en preview
  withCredentials: !isDevelopment && !isPreview
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
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
      console.log("Unauthorized access detected, redirecting to login");
      localStorage.removeItem("token");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (email: string, password: string) => {
    try {
      console.log('Tentative de connexion avec:', { email });
      const response = await api.post('/login', { email, password });
      console.log('Réponse de connexion:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      if (error.response) {
        console.error('Détails de l\'erreur:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      }
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/me');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/logout');
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  },
};

interface QuestionData {
  text: string;
  type: string;
  category_id: number;
  difficulty: number;
  points: number;
  reponses: Array<{
    text: string;
    is_correct: boolean;
  }>;
}

interface QuizAnswer {
  questionId: string;
  answer: string;
}

interface SponsorshipData {
  code: string;
  email: string;
}

// Service pour les questions
const questionService = {
  // Récupérer toutes les questions
  getAllQuestions: async () => {
    const response = await api.get('/questions');
    return response.data;
  },
  
  // Récupérer une question par ID
  getQuestionById: async (id: string) => {
    const response = await api.get(`/questions/${id}`);
    return response.data;
  },
  
  // Récupérer les réponses d'une question
  getQuestionResponses: async (questionId: string) => {
    const response = await api.get(`/questions/${questionId}/reponses`);
    return response.data;
  },
  
  // Créer une nouvelle question
  createQuestion: async (questionData: QuestionData) => {
    const response = await api.post('/questions', questionData);
    return response.data;
  },
  
  // Mettre à jour une question
  updateQuestion: async (id: string, questionData: QuestionData) => {
    const response = await api.patch(`/questions/${id}`, questionData);
    return response.data;
  },
  
  // Supprimer une question
  deleteQuestion: async (id: string) => {
    const response = await api.delete(`/questions/${id}`);
    return response.data;
  }
};

// Service pour les réponses
const responseService = {
  // Récupérer toutes les réponses
  getAllResponses: async () => {
    const response = await api.get('/reponses');
    return response.data;
  },
  
  // Récupérer une réponse par ID
  getResponseById: async (id: string) => {
    const response = await api.get(`/reponses/${id}`);
    return response.data;
  },
  
  // Créer une nouvelle réponse
  createResponse: async (responseData: QuestionData['reponses'][0]) => {
    const response = await api.post('/reponses', responseData);
    return response.data;
  },
  
  // Mettre à jour une réponse
  updateResponse: async (id: string, responseData: QuestionData['reponses'][0]) => {
    const response = await api.patch(`/reponses/${id}`, responseData);
    return response.data;
  },
  
  // Supprimer une réponse
  deleteResponse: async (id: string) => {
    const response = await api.delete(`/reponses/${id}`);
    return response.data;
  }
};

// Service pour les quiz
const quizService = {
  // Récupérer tous les quiz
  getAllQuizzes: async () => {
    const response = await api.get('/quizzes');
    return response.data;
  },
  
  // Récupérer un quiz par ID
  getQuizById: async (id: string) => {
    const response = await api.get(`/quizzes/${id}`);
    return response.data;
  },
  
  // Récupérer les questions d'un quiz
  getQuizQuestions: async (quizId: string) => {
    const response = await api.get(`/quiz/${quizId}/questions`);
    return response.data;
  },
  
  // Soumettre un quiz
  submitQuiz: async (quizId: string, answers: QuizAnswer[]) => {
    const response = await api.post(`/quizzes/${quizId}/submit`, answers);
    return response.data;
  },
  
  // Récupérer les catégories de quiz
  getQuizCategories: async () => {
    const response = await api.get('/quiz/categories');
    return response.data;
  }
};

// Service pour le parrainage
const sponsorshipService = {
  // Récupérer le lien de parrainage
  getLink: async () => {
    const response = await api.get('/stagiaire/parrainage/link');
    return response.data;
  },
  
  // Générer un lien de parrainage
  generateLink: async () => {
    const response = await api.post('/stagiaire/parrainage/generate-link');
    return response.data;
  },
  
  // Récupérer les statistiques de parrainage
  getStats: async () => {
    const response = await api.get('/stagiaire/parrainage/stats');
    return response.data;
  },
  
  // Récupérer l'historique de parrainage
  getHistory: async () => {
    const response = await api.get('/stagiaire/parrainage/history');
    return response.data;
  },
  
  // Récupérer les filleuls
  getFilleuls: async () => {
    const response = await api.get('/stagiaire/parrainage/filleuls');
    return response.data;
  },
  
  // Récupérer les récompenses
  getRewards: async () => {
    const response = await api.get('/stagiaire/parrainage/rewards');
    return response.data;
  },
  
  // Accepter un parrainage
  acceptSponsorship: async (data: SponsorshipData) => {
    const response = await api.post('/stagiaire/parrainage/accept', data);
    return response.data;
  }
};

export {
  api,
  questionService,
  responseService,
  quizService,
  sponsorshipService
};
