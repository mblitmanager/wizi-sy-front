
import apiClient from '@/lib/api-client';
import type { Quiz, QuizHistory, QuizStats } from '@/types/quiz';
import { quizFormatterService } from './QuizFormatterService';
import { categoryService } from '../CategoryService';

export class QuizFetchService {
  async getQuizzesByCategory(categoryId: string): Promise<Quiz[]> {
    try {
      const response = await apiClient.get(`/quiz/category/${categoryId}`);
      const quizzes = response.data || [];
      const categories = await categoryService.getCategories();
      
      return Promise.all(quizzes.map((quiz: any) => quizFormatterService.formatQuiz(quiz, categories)));
    } catch (error) {
      console.error('Error fetching quizzes by category:', error);
      return [];
    }
  }

  async getQuizById(quizId: string): Promise<Quiz> {
    try {
      console.log('Fetching quiz with ID:', quizId);
      const response = await apiClient.get(`/quiz/${quizId}`);
      console.log('Quiz response:', response.data);
      const formattedQuiz = await quizFormatterService.formatQuiz(response.data);
      console.log('Formatted quiz:', formattedQuiz);
      return formattedQuiz;
    } catch (error) {
      console.error('Error fetching quiz:', error);
      throw error;
    }
  }
}

export const quizFetchService = new QuizFetchService();
