import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface Quiz {
  id: number;
  titre: string;
  description: string;
  time_limit: number;
  created_at: string;
  updated_at: string;
}

export type QuestionType = 
  | 'choix multiples'
  | 'vrai/faux'
  | 'remplir le champ vide'
  | 'rearrangement'
  | 'banque de mots'
  | 'correspondance'
  | 'question audio'
  | 'flashcard';

export interface BaseAnswer {
  id: number;
  question_id: number;
  created_at: string;
  updated_at: string;
}

export interface MultipleChoiceAnswer extends BaseAnswer {
  text: string;
  is_correct: number;
}

export interface OrderingAnswer extends BaseAnswer {
  text: string;
  position: number;
}

export interface FillInBlankAnswer extends BaseAnswer {
  text: string;
  bank_group: string;
}

export interface WordBankAnswer extends BaseAnswer {
  text: string;
  is_correct?: number;
  bank_group: string;
}

export interface FlashcardAnswer extends BaseAnswer {
  text: string;
  flashcard_back: string;
}

export interface MatchingAnswer extends BaseAnswer {
  text: string;
  match_pair: string;
}

export interface Question {
  id: number;
  quiz_id: number;
  text: string;
  type: QuestionType;
  explication: string;
  points: string;
  astuce: string;
  media_url: string | null;
  created_at: string;
  updated_at: string;
  reponse_correct: string | null;
  reponses: (
    | MultipleChoiceAnswer
    | OrderingAnswer
    | FillInBlankAnswer
    | WordBankAnswer
    | FlashcardAnswer
    | MatchingAnswer
  )[];
}

export interface QuizSubmission {
  quiz_id: number;
  answers: Record<number, any>;
  time_spent: number;
}

export interface QuizResult {
  score: number;
  total_questions: number;
  correct_answers: number;
  time_spent: number;
  questions: Question[];
}

class QuizService {
  private static instance: QuizService;
  private constructor() {}

  public static getInstance(): QuizService {
    if (!QuizService.instance) {
      QuizService.instance = new QuizService();
    }
    return QuizService.instance;
  }

  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getQuizQuestions(quizId: number): Promise<{ data: Question[] }> {
    try {
      const response = await axios.get(`${API_URL}/quiz/${quizId}/questions`, {
        headers: this.getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      throw error;
    }
  }

  async getQuizDetails(quizId: number): Promise<{ data: Quiz }> {
    try {
      const response = await axios.get(`${API_URL}/quiz/${quizId}`, {
        headers: this.getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz details:', error);
      throw error;
    }
  }

  async submitQuiz(submission: QuizSubmission): Promise<{ data: QuizResult }> {
    try {
      const response = await axios.post(
        `${API_URL}/quiz/submit`,
        submission,
        {
          headers: {
            ...this.getAuthHeader(),
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error submitting quiz:', error);
      throw error;
    }
  }

  async getQuizHistory(): Promise<{ data: QuizResult[] }> {
    try {
      const response = await axios.get(`${API_URL}/quiz/history`, {
        headers: this.getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz history:', error);
      throw error;
    }
  }

  async getQuizStatistics(quizId: number): Promise<{ data: any }> {
    try {
      const response = await axios.get(`${API_URL}/quiz/${quizId}/statistics`, {
        headers: this.getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz statistics:', error);
      throw error;
    }
  }
}

export default QuizService.getInstance(); 