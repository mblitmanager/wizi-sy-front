
import { quizApiService } from './api/QuizApiService';

interface QuizSubmission {
  quiz_id: number;
  answers: Record<number, any>;
  time_spent: number;
}

interface Progression {
  id: number;
  stagiaire_id: number;
  quiz_id: number;
  termine: boolean;
  created_at: string;
  updated_at: string;
  score: number;
  correct_answers: number;
  total_questions: number;
  time_spent: number;
  completion_time: string;
}

export class QuizSubmissionService {
  async getQuizResult(quizId: string): Promise<any> {
    try {
      return await quizApiService.post(`/quiz/${quizId}/result`, {});
    } catch (error) {
      console.error('Error fetching quiz result:', error);
      throw error;
    }
  }

  async submitQuiz(submission: QuizSubmission): Promise<any> {
    try {
      return await quizApiService.post(
        `/quiz/${submission.quiz_id}/result`,
        {
          answers: submission.answers,
          timeSpent: submission.time_spent
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

  async getQuizStatistics(quizId: number): Promise<any> {
    try {
      return await quizApiService.get(`/quiz/${quizId}/statistics`);
    } catch (error) {
      console.error('Error fetching quiz statistics:', error);
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
}

export const quizSubmissionService = new QuizSubmissionService();
