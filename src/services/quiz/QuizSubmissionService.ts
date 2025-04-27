import apiClient from '@/lib/api-client';
import type { Question, QuizResult } from '@/types/quiz';

interface QuizHistory {
  id: string;
  quiz: {
    title: string;
    category: string;
  };
  score: number;
  completedAt: string;
  timeSpent: number;
}

interface QuizStats {
  totalQuizzes: number;
  averageScore: number;
  totalPoints: number;
  averageTimeSpent: number;
}

interface UserProfile {
  user: {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    role: string;
    created_at: string;
    updated_at: string;
    image: string | null;
  };
  stagiaire: {
    id: number;
    prenom: string;
    civilite: string;
    telephone: string;
    adresse: string;
    date_naissance: string;
    ville: string;
    code_postal: string;
    role: string;
    statut: number;
    user_id: number;
    created_at: string;
    updated_at: string;
  };
}

export class QuizSubmissionService {
  private baseUrl = import.meta.env.VITE_API_URL;

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

  async submitQuiz(quizId: string, answers: Record<string, string[]>, timeSpent: number): Promise<QuizResult> {
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

  async getQuizHistory(): Promise<QuizHistory[]> {
    try {
      const response = await apiClient.get('/quiz/history');
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz history:', error);
      throw new Error('Failed to fetch quiz history');
    }
  }

  async getQuizStats(): Promise<QuizStats> {
    try {
      const response = await apiClient.get('/quiz/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz stats:', error);
      throw new Error('Failed to fetch quiz stats');
    }
  }

  async getStagiaireProfile(): Promise<UserProfile> {
    try {
      const response = await apiClient.get('/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Failed to fetch user profile');
    }
  }

  async getStagiaireQuizzes(): Promise<any[]> {
    try {
      const response = await apiClient.get('/quiz/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching stagiaire quizzes:', error);
      throw new Error('Failed to fetch stagiaire quizzes');
    }
  }

  async updateClassement(quizId: string, stagiaireId: string, score: number): Promise<any> {
    const response = await apiClient.post(`/api/quiz/${quizId}/classement`, {
      stagiaire_id: stagiaireId,
      score: score
    });
    return response.data;
  }

  async getClassement(quizId: string): Promise<any> {
    try {
      const response = await apiClient.get(`/quiz/${quizId}/classement`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz ranking:', error);
      throw new Error('Failed to fetch quiz ranking');
    }
  }

  async getGlobalClassement(): Promise<any> {
    try {
      const response = await apiClient.get('/quiz/classement/global');
      return response.data;
    } catch (error) {
      console.error('Error fetching global ranking:', error);
      throw new Error('Failed to fetch global ranking');
    }
  }
}

export const quizSubmissionService = new QuizSubmissionService();
