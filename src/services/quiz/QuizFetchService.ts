
import { Quiz as QuizType, Question as QuestionType } from '@/types/quiz';
import { quizApiService } from './api/QuizApiService';

export class QuizFetchService {
  async getAllQuizzes(): Promise<QuizType[]> {
    try {
      return await quizApiService.get('/quiz');
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      throw error;
    }
  }

  async getQuizById(id: string): Promise<QuizType> {
    try {
      return await quizApiService.get(`/quiz/${id}/questions`);
    } catch (error) {
      console.error(`Error fetching quiz ${id}:`, error);
      throw error;
    }
  }

  async getQuizQuestions(quizId: string): Promise<QuestionType[]> {
    try {
      console.log('Fetching questions for quiz:', quizId);
      const response = await quizApiService.get(`/quiz/${quizId}/questions`);
      
      const questions = Array.isArray(response) ? response : 
                       Array.isArray(response.data) ? response.data : 
                       Array.isArray(response.questions) ? response.questions : [];
      
      console.log('Formatted questions:', questions);
      return questions;
    } catch (error) {
      console.error(`Error fetching questions for quiz ${quizId}:`, error);
      throw error;
    }
  }

  async getQuizDetails(quizId: number): Promise<any> {
    try {
      return await quizApiService.get(`/quiz/${quizId}`);
    } catch (error) {
      console.error('Error fetching quiz details:', error);
      throw error;
    }
  }
  
  async getQuizzesByCategory(categoryId: string): Promise<QuizType[]> {
    try {
      return await quizApiService.get(`/quiz/category/${categoryId}`);
    } catch (error) {
      console.error(`Error fetching quizzes for category ${categoryId}:`, error);
      throw error;
    }
  }
  
  async getCategories(): Promise<any[]> {
    try {
      return await quizApiService.get('/categories');
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
}

export const quizFetchService = new QuizFetchService();
