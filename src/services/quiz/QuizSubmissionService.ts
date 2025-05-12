
import { quizAnswerService } from './submission/QuizAnswerService';
import { quizHistoryService } from './submission/QuizHistoryService';
import { rankingService } from './submission/RankingService';
import { userProfileService } from './submission/UserProfileService';
import type { Question, QuizHistory, QuizStats, QuizResult } from '@/types/quiz';

export class QuizSubmissionService {
  async getQuizQuestions(quizId: number): Promise<Question[]> {
    return quizAnswerService.getQuizQuestions(quizId);
  }

  async submitQuiz(quizId: string, answers: Record<string, string[]>, timeSpent: number): Promise<QuizResult> {
    const result = await quizAnswerService.submitQuiz(quizId, answers, timeSpent);
    
    // After submitting the quiz, update the classement with correct answers
    if (result && result.stagiaireId) {
      await this.updateClassement(quizId, result.stagiaireId, result.correctAnswers);
    }
    
    return result;
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

  async updateClassement(quizId: string, stagiaireId: string, correctAnswers: number): Promise<any> {
    // Now we pass correctAnswers instead of a total score
    return rankingService.updateClassement(quizId, stagiaireId, correctAnswers);
  }

  async getClassement(quizId: string): Promise<any> {
    return rankingService.getClassement(quizId);
  }

  async getGlobalClassement(): Promise<any> {
    return rankingService.getGlobalClassement();
  }

  async getStagiaireProfile(): Promise<any> {
    return userProfileService.getStagiaireProfile();
  }

  async getStagiaireQuizzes(): Promise<any[]> {
    return userProfileService.getStagiaireQuizzes();
  }
}

export const quizSubmissionService = new QuizSubmissionService();
