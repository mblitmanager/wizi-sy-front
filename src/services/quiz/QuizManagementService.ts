
import { quizFormatterService } from './management/QuizFormatterService';
import { quizFetchService } from './management/QuizFetchService';
import { quizStatsService } from './management/QuizStatsService';
import { categoryService } from './CategoryService';
import type { Quiz, Question, QuizHistory, QuizStats } from '@/types/quiz';

class QuizManagementService {
  async formatQuiz(quiz: any, categories?: any[]) {
    return quizFormatterService.formatQuiz(quiz, categories);
  }

  async getQuizzesByCategory(categoryId: string): Promise<Quiz[]> {
    return quizFetchService.getQuizzesByCategory(categoryId);
  }

  async getQuizById(quizId: string): Promise<Quiz> {
    return quizFetchService.getQuizById(quizId);
  }

  async getQuizHistory(): Promise<QuizHistory[]> {
    return quizStatsService.getQuizHistory();
  }

  async getQuizStats(): Promise<QuizStats> {
    return quizStatsService.getQuizStats();
  }

  async getCategories() {
    return categoryService.getCategories();
  }
  
  async getQuizStatistics(quizId: string): Promise<any> {
    return quizStatsService.getQuizStatistics(quizId);
  }
  
}

export const quizManagementService = new QuizManagementService();
