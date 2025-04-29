import { api } from './api';
import { Formation } from '@/types/formation';
import { Quiz, Question, Response } from '@/types/quiz';

export const quizFormationService = {
  getFormationWithQuizzes: async (): Promise<Formation[]> => {
    const response = await api.get<{ data: Formation[] }>('/stagiaire/formations');
    return response.data.data;
  },

  getQuizQuestions: async (formationId: number): Promise<Question[]> => {
    const formations = await quizFormationService.getFormationWithQuizzes();
    const formation = formations.find(f => f.id === formationId);
    
    if (!formation || !formation.quizzes || formation.quizzes.length === 0) {
      throw new Error('No quizzes found for this formation');
    }

    // On prend le premier quiz de la formation
    const quiz = formation.quizzes[0];
    return quiz.questions || [];
  },

  getQuestionResponses: async (questionId: number): Promise<Response[]> => {
    const response = await api.get<Response[]>(`/questions/${questionId}/reponses`);
    return response.data;
  }
}; 