
import { quizApiService } from './api/QuizApiService';

export class QuizSubmissionService {
  async getQuizResult(quizId: string): Promise<any> {
    try {
      return await quizApiService.post(`/quiz/${quizId}/result`, {});
    } catch (error) {
      console.error('Error fetching quiz result:', error);
      throw error;
    }
  }

  async submitQuiz(quizId: string, answers: Record<string, any>, timeSpent: number): Promise<any> {
    try {
      return await quizApiService.post(
        `/quiz/${quizId}/result`,
        {
          answers: answers,
          timeSpent: timeSpent
        }
      );
    } catch (error) {
      console.error('Error submitting quiz:', error);
      throw error;
    }
  }

  async getQuizHistory(): Promise<any> {
    try {
      return await quizApiService.get(`/quiz/history`);
    } catch (error) {
      console.error('Error fetching quiz history:', error);
      throw error;
    }
  }

  async getQuizStats(quizId: string): Promise<any> {
    try {
      return await quizApiService.get(`/quiz/${quizId}/statistics`);
    } catch (error) {
      console.error(`Error fetching statistics for quiz ${quizId}:`, error);
      throw error;
    }
  }

  async startQuizParticipation(quizId: number): Promise<any> {
    try {
      return await quizApiService.post(`/quiz/${quizId}/participation`, {});
    } catch (error) {
      console.error('Error starting quiz participation:', error);
      throw error;
    }
  }

  async getCurrentParticipation(quizId: string): Promise<any> {
    try {
      console.log('Fetching current participation for quiz:', quizId);
      return await quizApiService.get(`/quiz/${quizId}/current-participation`);
    } catch (error) {
      console.error('Error getting current participation:', error);
      throw error;
    }
  }

  async completeParticipation(quizId: string, data: {
    score: number;
    correct_answers: number;
    time_spent: number;
  }): Promise<any> {
    try {
      return await quizApiService.post(`/quiz/${quizId}/complete`, data);
    } catch (error) {
      console.error('Error completing participation:', error);
      throw error;
    }
  }

  async getParticipationResume(participationId: number): Promise<any> {
    try {
      return await quizApiService.get(`/quiz-participations/${participationId}/resume`);
    } catch (error) {
      console.error('Error fetching participation resume:', error);
      throw error;
    }
  }
  
  async getStagiaireProfile(): Promise<any> {
    try {
      return await quizApiService.get('/stagiaire/profile');
    } catch (error) {
      console.error('Error fetching stagiaire profile:', error);
      throw error;
    }
  }
  
  async getGlobalClassement(): Promise<any> {
    try {
      return await quizApiService.get('/classement');
    } catch (error) {
      console.error('Error fetching global classement:', error);
      throw error;
    }
  }
}

export const quizSubmissionService = new QuizSubmissionService();
