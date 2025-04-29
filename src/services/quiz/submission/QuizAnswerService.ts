
import apiClient from '@/lib/api-client';
import type { Question } from '@/types/quiz';

export class QuizAnswerService {
  async getQuizQuestions(quizId: number): Promise<Question[]> {
    try {
      const response = await apiClient.get(`/quiz/${quizId}/questions`);
      console.log('API response for quiz questions:', response.data);
      
      const questions = response.data.data || [];
      return questions.map((question: any) => ({
        ...question,
        id: String(question.id),
        type: this.mapQuestionType(question.type || ''),
        audioUrl: question.media_url || question.audioUrl,
        answers: (question.reponses || []).map((reponse: any) => ({
          id: String(reponse.id),
          text: reponse.text || '',
          isCorrect: Boolean(reponse.is_correct)
        }))
      }));
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      throw new Error('Failed to fetch quiz questions');
    }
  }

  async submitQuiz(quizId: string, answers: Record<string, string[]>, timeSpent: number): Promise<any> {
    try {
      console.log('Submitting quiz answers:', { quizId, answers, timeSpent });
      
      // Format answers for API
      const formattedAnswers: Record<string, any> = {};
      Object.entries(answers).forEach(([questionId, answerIds]) => {
        formattedAnswers[questionId] = answerIds;
      });

      const response = await apiClient.post(`/quiz/${quizId}/result`, {
        answers: formattedAnswers,
        timeSpent
      });

      console.log('Quiz submission response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error submitting quiz:', error);
      throw error;
    }
  }

  private mapQuestionType(type: string): Question['type'] {
    const typeMap: Record<string, Question['type']> = {
      'multiplechoice': 'choix multiples',
      'multiple-choice': 'choix multiples',
      'multiple_choice': 'choix multiples',
      'multiple choice': 'choix multiples',
      'truefalse': 'vrai/faux',
      'true-false': 'vrai/faux',
      'true_false': 'vrai/faux',
      'true false': 'vrai/faux',
      'fillblank': 'remplir le champ vide',
      'fill-in-blank': 'remplir le champ vide',
      'fill_in_blank': 'remplir le champ vide',
      'fill in blank': 'remplir le champ vide',
      'ordering': 'rearrangement',
      'order': 'rearrangement',
      'rearrangement': 'rearrangement',
      'matching': 'correspondance',
      'match': 'correspondance',
      'flash-card': 'carte flash',
      'flashcard': 'carte flash',
      'flash_card': 'carte flash',
      'flash card': 'carte flash',
      'wordbank': 'banque de mots',
      'word-bank': 'banque de mots',
      'word_bank': 'banque de mots',
      'word bank': 'banque de mots',
      'audioquestion': 'question audio',
      'audio-question': 'question audio',
      'audio_question': 'question audio',
      'audio question': 'question audio'
    };
    return typeMap[type.toLowerCase()] || type as Question['type'];
  }
}

export const quizAnswerService = new QuizAnswerService();
