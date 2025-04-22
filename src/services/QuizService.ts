import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Créer une instance axios avec la configuration de base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Rediriger vers la page de connexion si non authentifié
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export type QuestionType = 
  | 'question audio'
  | 'remplir le champ vide'
  | 'carte flash'
  | 'correspondance'
  | 'choix multiples'
  | 'rearrangement'
  | 'vrai/faux'
  | 'banque de mots';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
  quizCount: number;
  colorClass: string;
}

export interface Quiz {
  id: string;
  titre: string;
  description: string;
  categorie: string;
  categorieId: string;
  niveau: string;
  questions: Question[];
  points: number;
}

export interface Question {
  id: string;
  quizId: string;
  text: string;
  type: QuestionType;
  answers?: Answer[];
  blanks?: Blank[];
  wordbank?: WordBankItem[];
  flashcard?: Flashcard;
  matching?: MatchingItem[];
  audioUrl?: string;
  explication?: string;
  points?: number;
  astuce?: string;
  media_url?: string;
}

export interface Answer {
  id: string;
  text: string;
  isCorrect?: boolean;
  position?: number;
  reponse_correct?: boolean;
}

export interface Blank {
  id: string;
  text: string;
  position?: number;
  bankGroup?: string;
}

export interface WordBankItem {
  id: string;
  text: string;
  isCorrect: boolean;
  bankGroup: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface MatchingItem {
  id: string;
  text: string;
  matchPair: string;
}

export interface QuizSubmission {
  quizId: number;
  answers: {
    questionId: number;
    answer: string;
    timeSpent: number;
  }[];
}

export interface QuizHistory {
  id: number;
  quiz_id: number;
  user_id: number;
  score: number;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export interface QuizStats {
  total_quizzes: number;
  completed_quizzes: number;
  average_score: number;
  total_points: number;
  points_earned: number;
}

class QuizService {
  // Méthode utilitaire pour formater un quiz avec sa catégorie
  private async formatQuiz(quiz: any, categories?: Category[]) {
    // Si les catégories ne sont pas fournies, les récupérer
    if (!categories) {
      categories = await this.getCategories();
    }

    // Déterminer la catégorie en fonction du titre
    let categorieId = '';
    let categorie = '';
    
    const titre = (quiz.titre || quiz.title || '').toLowerCase();
    if (titre.includes('excel') || titre.includes('bureautique')) {
      const bureautique = categories.find(c => c.name.toLowerCase() === 'bureautique');
      if (bureautique) {
        categorieId = bureautique.id;
        categorie = bureautique.name;
      }
    } else if (titre.includes('anglais') || titre.includes('français') || titre.includes('langues')) {
      const langues = categories.find(c => c.name.toLowerCase() === 'langues');
      if (langues) {
        categorieId = langues.id;
        categorie = langues.name;
      }
    }

    // Formater les questions
    const formattedQuestions = (quiz.questions || []).map((question: any) => ({
      ...question,
      type: this.mapQuestionType(question.type),
      audioUrl: question.media_url || question.audioUrl,
      explication: question.explication || '',
      points: question.points || 0,
      astuce: question.astuce || '',
      answers: question.answers?.map((answer: any) => ({
        ...answer,
        isCorrect: answer.reponse_correct || answer.isCorrect
      }))
    }));

    return {
      id: quiz.id,
      titre: quiz.titre || quiz.title || '',
      description: quiz.description || '',
      categorie: quiz.categorie || quiz.category || categorie,
      categorieId: quiz.categorieId || quiz.category_id || quiz.categoryId || categorieId,
      niveau: quiz.niveau || quiz.level || '',
      questions: formattedQuestions,
      points: quiz.points || 0
    };
  }

  private mapQuestionType(type: string): QuestionType {
    const typeMap: Record<string, QuestionType> = {
      'multiple-choice': 'choix multiples',
      'true-false': 'vrai/faux',
      'fill-in-blank': 'remplir le champ vide',
      'rearrangement': 'rearrangement',
      'matching': 'correspondance',
      'flash-card': 'carte flash',
      'word-bank': 'banque de mots',
      'audio-question': 'question audio'
    };
    return typeMap[type] || type as QuestionType;
  }

  async getCategories() {
    try {
      const response = await api.get('/quiz/categories');
      console.log('API Response for categories:', response.data);
      
      const categories = response.data.data || response.data || [];
      
      const formattedCategories = categories.map(category => ({
        id: category.id,
        name: category.name || category.nom || '',
        color: category.color || category.couleur || '#3B82F6',
        icon: category.icon || category.icone || '',
        description: category.description || '',
        quizCount: category.quizCount || category.quiz_count || 0,
        colorClass: category.colorClass || ''
      }));

      console.log('Formatted categories:', formattedCategories);
      return formattedCategories;
    } catch (error) {
      console.error('Error fetching quiz categories:', error);
      return [];
    }
  }

  async getQuizzesByCategory(categoryId: string) {
    try {
      const response = await api.get(`/quiz/category/${categoryId}`);
      const quizzes = response.data || [];
      const categories = await this.getCategories();
      
      const formattedQuizzes = await Promise.all(
        quizzes.map(quiz => this.formatQuiz(quiz, categories))
      );
      
      return formattedQuizzes;
    } catch (error) {
      console.error('Error fetching quizzes by category:', error);
      return [];
    }
  }

  async getQuizHistory() {
    try {
      const response = await api.get('/quiz/history');
      return response.data.data as QuizHistory[];
    } catch (error) {
      console.error('Error fetching quiz history:', error);
      throw new Error('Failed to fetch quiz history');
    }
  }

  async getQuizStats() {
    try {
      const response = await api.get('/quiz/stats');
      return response.data.data as QuizStats;
    } catch (error) {
      console.error('Error fetching quiz stats:', error);
      throw new Error('Failed to fetch quiz stats');
    }
  }

  async getQuizById(quizId: string) {
    try {
      const response = await api.get(`/quiz/${quizId}`);
      const quizData = response.data;
      return await this.formatQuiz(quizData);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      throw error;
    }
  }

  async getQuizQuestions(quizId: number) {
    try {
      const response = await api.get(`/quiz/${quizId}/questions`);
      const questions = response.data.data || [];
      return questions.map((question: any) => ({
        ...question,
        type: this.mapQuestionType(question.type),
        audioUrl: question.media_url || question.audioUrl
      })) as Question[];
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      throw new Error('Failed to fetch quiz questions');
    }
  }

  async submitQuiz(quizId: string, answers: Record<string, string[]>, timeSpent: number) {
    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        questionId: parseInt(questionId),
        answer: Array.isArray(answer) ? answer.join(',') : answer,
        timeSpent
      }));

      const response = await api.post(`/quizzes/${quizId}/submit`, {
        quizId: parseInt(quizId),
        answers: formattedAnswers
      });

      return response.data;
    } catch (error) {
      console.error('Error submitting quiz:', error);
      throw error;
    }
  }

  async submitQuizResult(quizId: number, result: any) {
    try {
      const response = await api.post(`/quiz/${quizId}/result`, result);
      return response.data;
    } catch (error) {
      console.error('Error submitting quiz result:', error);
      throw error;
    }
  }

  async getStagiaireQuizzes() {
    try {
      const response = await api.get('/stagiaire/quizzes');
      const quizzes = response.data.data || [];
      const categories = await this.getCategories();
      
      const formattedQuizzes = await Promise.all(
        quizzes.map(quiz => this.formatQuiz(quiz, categories))
      );
      
      return formattedQuizzes;
    } catch (error) {
      console.error('Error fetching stagiaire quizzes:', error);
      return [];
    }
  }
}

export const quizService = new QuizService(); 