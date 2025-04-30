
import apiClient from '@/lib/api-client';
import type { Quiz, QuizHistory, QuizStats } from '@/types/quiz';
import { quizFormatterService } from './QuizFormatterService';
import { categoryService } from '../CategoryService';
import { quizAnswerService } from '../submission/QuizAnswerService';

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
      
      // Get questions directly from the API
      let questions = [];
      try {
        // Try to get detailed questions via the questions endpoint
        const questionsResponse = await apiClient.get(`/quiz/${quizId}/questions`);
        console.log('Questions response:', questionsResponse.data);
        
        if (questionsResponse.data && questionsResponse.data.data) {
          questions = questionsResponse.data.data;
        } else if (Array.isArray(questionsResponse.data)) {
          questions = questionsResponse.data;
        }
        
        // Format each question properly
        if (questions.length > 0) {
          questions = questions.map((q: any) => {
            // Ensure answers/reponses are properly set
            const answers = q.answers || q.reponses || [];
            return {
              ...q,
              id: String(q.id),
              answers: answers.map((a: any) => ({
                ...a,
                id: String(a.id),
                isCorrect: a.is_correct === 1 || a.isCorrect === true
              }))
            };
          });
        }
      } catch (err) {
        console.log('Could not fetch detailed questions, using quiz questions:', err);
        questions = response.data.questions || [];
      }
      
      // Format the quiz with detailed questions
      const quizData = response.data;
      const formattedQuiz = await quizFormatterService.formatQuiz({
        ...quizData,
        questions: questions.length > 0 ? questions : quizData.questions || []
      });
      
      console.log('Formatted quiz:', formattedQuiz);
      return formattedQuiz;
    } catch (error) {
      console.error('Error fetching quiz:', error);
      throw error;
    }
  }

  async getAllQuizzes(): Promise<Quiz[]> {
    try {
      const response = await apiClient.get('/quiz');
      const quizzes = response.data || [];
      const categories = await categoryService.getCategories();
      
      return Promise.all(quizzes.map((quiz: any) => quizFormatterService.formatQuiz(quiz, categories)));
    } catch (error) {
      console.error('Error fetching all quizzes:', error);
      return [];
    }
  }
}

export const quizFetchService = new QuizFetchService();
