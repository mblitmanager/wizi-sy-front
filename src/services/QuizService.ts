import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Créer une instance axios avec la configuration de base
const api = axios.create({
  baseURL: API_URL,
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Formation {
  id: number;
  titre: string;
  slug: string | null;
  description: string;
  categorie: string;
  icon: string | null;
  image: string | null;
  statut: number;
  duree: string;
  created_at: string;
  updated_at: string;
  quizzes: Quiz[];
}

export interface Quiz {
  id: number;
  titre: string;
  description: string;
  duree: string;
  niveau: string;
  nb_points_total: string;
  formation_id: number;
  created_at: string;
  updated_at: string;
  questions: Question[];
}

export interface Question {
  id: number;
  quiz_id: number;
  text: string;
  type: string;
  explication: string | null;
  points: string;
  astuce: string | null;
  media_url: string | null;
  created_at: string;
  updated_at: string;
  reponse_correct: string | null;
  reponses: Reponse[];
}

export interface Reponse {
  id: number;
  text: string;
  is_correct: number;
  position: number | null;
  match_pair: string | null;
  bank_group: string | null;
  flashcard_back: string | null;
  question_id: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface QuizSubmission {
  quizId: number;
  answers: {
    questionId: number;
    answer: string;
  }[];
}

class QuizService {
  async getCategories() {
    try {
      const response = await api.get('/quiz/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz categories:', error);
      throw error;
    }
  }

  async getStagiaireFormations() {
    try {
      const response = await api.get('/api/stagiaire/formations');
      return response.data.data as Formation[];
    } catch (error) {
      console.error('Error fetching stagiaire formations:', error);
      throw error;
    }
  }

  async getQuizById(quizId: number) {
    try {
      const formations = await this.getStagiaireFormations();
      const quiz = formations
        .flatMap(formation => formation.quizzes)
        .find(quiz => quiz.id === quizId);
      
      if (!quiz) {
        throw new Error('Quiz not found');
      }
      
      return quiz;
    } catch (error) {
      console.error('Error fetching quiz:', error);
      throw error;
    }
  }

  async getQuizQuestions(quizId: number) {
    try {
      const formations = await this.getStagiaireFormations();
      const quiz = formations
        .flatMap(formation => formation.quizzes)
        .find(quiz => quiz.id === quizId);
      
      if (!quiz) {
        throw new Error('Quiz not found');
      }
      
      return quiz.questions;
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      throw error;
    }
  }

  async submitQuiz(submission: QuizSubmission) {
    try {
      const response = await api.post(`/quizzes/${submission.quizId}/submit`, submission);
      return response.data;
    } catch (error) {
      console.error('Error submitting quiz:', error);
      throw error;
    }
  }

  async getStagiaireQuizzes() {
    try {
      const response = await api.get('/stagiaire/quizzes');
      return response.data;
    } catch (error) {
      console.error('Error fetching stagiaire quizzes:', error);
      throw error;
    }
  }
}

export const quizService = new QuizService(); 