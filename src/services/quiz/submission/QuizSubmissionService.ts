
import { quizAnswerService } from './QuizAnswerService';
import { quizHistoryService } from './QuizHistoryService';
import { rankingService } from './RankingService';
import { userProfileService } from './UserProfileService';
import type { Question, QuizHistory, QuizStats, QuizResult } from '@/types/quiz';

export class QuizSubmissionService {
  async getQuizQuestions(quizId: number): Promise<Question[]> {
    return quizAnswerService.getQuizQuestions(quizId);
  }

  async submitQuiz(quizId: string, answers: Record<string, string[]>, timeSpent: number): Promise<QuizResult> {
    return quizAnswerService.submitQuiz(quizId, answers, timeSpent);
  }

  async getQuizHistory(): Promise<QuizHistory[]> {
    return quizHistoryService.getQuizHistory();
  }

  async getQuizStats(): Promise<QuizStats> {
    return quizHistoryService.getQuizStats();
  }

  async getQuizResult(quizId: string): Promise<QuizResult> {
    return quizHistoryService.getQuizResult(quizId);
  }

  async updateClassement(quizId: string, stagiaireId: string, score: number): Promise<any> {
    return rankingService.updateClassement(quizId, stagiaireId, score);
  }

  async getClassement(quizId: string): Promise<any> {
    return rankingService.getClassement(quizId);
  }

  async getGlobalClassement(period: 'week' | 'month' | 'all' = 'all'): Promise<any> {
    return rankingService.getGlobalClassement(period);
  }

  async getStagiaireProfile(): Promise<any> {
    return userProfileService.getStagiaireProfile();
  }

  async getStagiaireQuizzes(): Promise<any[]> {
    return userProfileService.getStagiaireQuizzes();
  }
}

export const quizSubmissionService = new QuizSubmissionService();
