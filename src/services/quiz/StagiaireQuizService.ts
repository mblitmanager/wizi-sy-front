
import apiClient from '@/lib/api-client';
import type { Quiz } from '@/types/quiz';
import { quizFormatterService } from './management/QuizFormatterService';

class StagiaireQuizService {
  async getStagiaireQuizzes(): Promise<Quiz[]> {
    try {
      const response = await apiClient.get('/stagiaire/quizzes');
      const quizzes = response.data.data || [];
      const categories = await apiClient.get('/quiz/categories').then(res => res.data);
      
      return Promise.all(
        quizzes.map(quiz => quizFormatterService.formatQuiz(quiz, categories))
      );
    } catch (error) {
      console.error('Error fetching stagiaire quizzes:', error);
      return [];
    }
  }
}

export const stagiaireQuizService = new StagiaireQuizService();
