
import { Quiz as QuizType, Question as QuestionType } from '@/types/quiz';
import { quizApiService } from './api/QuizApiService';

export class QuizManagementService {
  async createQuiz(quiz: Omit<QuizType, 'id' | 'questions'>): Promise<QuizType> {
    try {
      return await quizApiService.post('/quiz', quiz);
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw error;
    }
  }

  async updateQuiz(id: string, quiz: Partial<QuizType>): Promise<QuizType> {
    try {
      return await quizApiService.put(`/quiz/${id}`, quiz);
    } catch (error) {
      console.error(`Error updating quiz ${id}:`, error);
      throw error;
    }
  }

  async deleteQuiz(id: string): Promise<void> {
    try {
      await quizApiService.delete(`/quiz/${id}`);
    } catch (error) {
      console.error(`Error deleting quiz ${id}:`, error);
      throw error;
    }
  }

  async addQuestion(quizId: string, question: Omit<QuestionType, 'id'>): Promise<QuestionType> {
    try {
      return await quizApiService.post(`/quiz/${quizId}/questions`, question);
    } catch (error) {
      console.error(`Error adding question to quiz ${quizId}:`, error);
      throw error;
    }
  }

  async updateQuestion(quizId: string, questionId: string, question: Partial<QuestionType>): Promise<QuestionType> {
    try {
      return await quizApiService.put(`/quiz/${quizId}/questions/${questionId}`, question);
    } catch (error) {
      console.error(`Error updating question ${questionId}:`, error);
      throw error;
    }
  }

  async deleteQuestion(quizId: string, questionId: string): Promise<void> {
    try {
      await quizApiService.delete(`/quiz/${quizId}/questions/${questionId}`);
    } catch (error) {
      console.error(`Error deleting question ${questionId}:`, error);
      throw error;
    }
  }
}

export const quizManagementService = new QuizManagementService();
