
import apiClient from '@/lib/api-client';
import type { Question } from '@/types/quiz';

class QuizSubmissionService {
  async getQuizQuestions(quizId: number): Promise<any> {
    try {
      const response = await apiClient.get(`/quiz/${quizId}/questions`);
      const questions = response.data.data || [];
      return questions.map((question: any) => ({
        ...question,
        type: this.mapQuestionType(question.type),
        audioUrl: question.media_url || question.audioUrl
      }));
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      throw new Error('Failed to fetch quiz questions');
    }
  }

  private mapQuestionType(type: string): Question['type'] {
    const typeMap: Record<string, Question['type']> = {
      'multiplechoice': 'choix multiples',
      'multiple-choice': 'choix multiples',
      'truefalse': 'vrai/faux',
      'true-false': 'vrai/faux',
      'fillblank': 'remplir le champ vide',
      'fill-in-blank': 'remplir le champ vide',
      'ordering': 'rearrangement',
      'rearrangement': 'rearrangement',
      'matching': 'correspondance',
      'flash-card': 'carte flash',
      'flashcard': 'carte flash',
      'wordbank': 'banque de mots',
      'word-bank': 'banque de mots',
      'audioquestion': 'question audio',
      'audio-question': 'question audio'
    };
    return typeMap[type] || type as Question['type'];
  }

  async submitQuiz(quizId: string, answers: Record<string, string[]>, timeSpent: number) {
    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        questionId: parseInt(questionId),
        answer: Array.isArray(answer) ? answer.join(',') : answer,
        timeSpent
      }));

      const response = await apiClient.post(`/quizzes/${quizId}/submit`, {
        quizId: parseInt(quizId),
        answers: formattedAnswers
      });

      return response.data;
    } catch (error) {
      console.error('Error submitting quiz:', error);
      throw error;
    }
  }

  async submitQuizResult(quizId: number, result: any) {
    try {
      const response = await apiClient.post(`/quiz/${quizId}/result`, result);
      return response.data;
    } catch (error) {
      console.error('Error submitting quiz result:', error);
      throw error;
    }
  }
}

export const quizSubmissionService = new QuizSubmissionService();
