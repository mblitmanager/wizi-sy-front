import { api } from './api';
import { Question, Answer, Formation } from '@/types';

interface QuizDataResponse {
    id: number;
    title: string;
    description: string;
    questions: Question[];
    points: number;
}

export interface QuizData {
    id: number;
    title: string;
    description: string;
    questions: Question[];
    duration: number;
    level: 'débutant' | 'intermédiaire' | 'avancé' | 'super';
    mode: 'normal' | 'challenge' | 'discovery';
    category: string;
    categoryId: number;
    points: number;
}

export interface QuizResult {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  completedAt: string;
  timeSpent: number;
  maxStreak: number;
  mode: string;
}

export const quizService = {
  async getQuiz(
    level: string, 
    questionCount: number,
    category?: string
  ): Promise<QuizData> {
    const response = await api.get<QuizData>(`/quizzes/random`, {
      params: {
        level,
        count: questionCount,
        category
      }
    });
    return response.data;
  },

  async submitQuiz(quizId: string, answers: number[]): Promise<{ score: number }> {
    const response = await api.post<{ score: number }>(`/quizzes/${quizId}/submit`, { answers });
    return response.data;
  },

  async saveQuizResult(result: QuizResult): Promise<void> {
    await api.post('/quizzes/results', result);
  },

  async getQuizHistory(): Promise<QuizData[]> {
    const response = await api.get<QuizData[]>('/quizzes/history');
    return response.data;
  },

  async getQuizRanking(): Promise<{ userId: string; score: number; rank: number }[]> {
    const response = await api.get<{ userId: string; score: number; rank: number }[]>('/quizzes/ranking');
    return response.data;
  },

  async getQuizCategories(): Promise<string[]> {
    const response = await api.get<string[]>('/quiz/categories');
    return response.data;
  },

  async getQuizByCategory(category: string): Promise<QuizData> {
    try {
      // Récupérer les formations de la catégorie spécifiée
      const formationsResponse = await api.get<Formation[]>(`/formations/categories/${category}`);
      const formations = formationsResponse.data;

      if (!formations || formations.length === 0) {
        throw new Error('Aucune formation trouvée pour cette catégorie');
      }

      // Récupérer les quiz de toutes les formations de cette catégorie
      const quizzesPromises = formations.map((formation: Formation) => 
        api.get<QuizDataResponse[]>(`/quizzes?formation_id=${formation.id}`)
      );
      const quizzesResponses = await Promise.all(quizzesPromises);
      
      // Fusionner tous les quiz en un seul tableau
      const allQuizzes = quizzesResponses.flatMap(response => response.data);

      if (allQuizzes.length === 0) {
        throw new Error('Aucun quiz trouvé pour cette catégorie');
      }

      // Sélectionner aléatoirement 10 questions parmi tous les quiz
      const selectedQuestions = allQuizzes.flatMap(quiz => quiz.questions)
        .sort(() => 0.5 - Math.random())
        .slice(0, 10);

      // Créer un nouveau quiz avec les questions sélectionnées
      const firstQuiz = allQuizzes[0];
      return {
        id: firstQuiz.id,
        title: firstQuiz.title,
        description: firstQuiz.description,
        questions: selectedQuestions,
        duration: 600, // 10 minutes par défaut
        level: 'intermédiaire', // Niveau par défaut
        mode: 'normal', // Mode par défaut
        category: category,
        categoryId: formations[0].id,
        points: firstQuiz.points || 0
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des quiz par catégorie:', error);
      throw error;
    }
  },

  async getQuizStats(): Promise<{
    totalQuizzes: number;
    averageScore: number;
    bestStreak: number;
    categories: Record<string, number>;
  }> {
    const response = await api.get<{
      totalQuizzes: number;
      averageScore: number;
      bestStreak: number;
      categories: Record<string, number>;
    }>('/quizzes/stats');
    return response.data;
  },

  async getQuizRecommendations(): Promise<QuizData[]> {
    const response = await api.get<QuizData[]>('/quizzes/recommendations');
    return response.data;
  },

  async getQuizChallenges(): Promise<{
    daily: QuizData;
    weekly: QuizData;
    monthly: QuizData;
  }> {
    const response = await api.get<{
      daily: QuizData;
      weekly: QuizData;
      monthly: QuizData;
    }>('/quizzes/challenges');
    return response.data;
  },

  async getFormationsByCategory(category: string): Promise<Formation[]> {
    const response = await api.get<Formation[]>(`/formations/categories/${category}`);
    return response.data;
  },

  async getFormationsByStagiaire(stagiaireId: string): Promise<{ data: Formation[] }> {
    const response = await api.get<{ data: Formation[] }>(`/stagiaire/${stagiaireId}/formations`);
    return response.data;
  }
}; 