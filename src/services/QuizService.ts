import axios from 'axios';
import { Quiz as QuizType, Question as QuestionType, Answer as AnswerType } from '@/types/quiz';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface Quiz {
  id: string;
  titre: string;
  description: string;
  duree: number;
  points: number;
  created_at: string;
  updated_at: string;
  questions: Question[];
}

interface Question {
  id: number;
  quiz_id: number;
  text: string;
  type: string;
  explication: string;
  points: string;
  astuce: string;
  media_url: string | null;
  created_at: string;
  updated_at: string;
  reponse_correct: string | null;
  reponses: Answer[];
}

interface Answer {
  id: number;
  text: string;
  is_correct: number | null;
  position: number | null;
  match_pair: string | null;
  bank_group: string | null;
  flashcard_back: string | null;
  question_id: number;
  created_at: string;
  updated_at: string;
}

interface QuizSubmission {
  quiz_id: number;
  answers: Record<number, any>;
  time_spent: number;
}

interface QuizResult {
  score: number;
  total_questions: number;
  correct_answers: number;
  time_spent: number;
  questions: Question[];
}

class QuizService {
  private static instance: QuizService;
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL;
  }

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

  async getAllQuizzes(): Promise<QuizType[]> {
    const response = await fetch(`${this.baseUrl}/quiz`);
    if (!response.ok) {
      throw new Error('Failed to fetch quizzes');
    }
    return response.json();
  }

  async getQuizById(id: string): Promise<QuizType> {
    const response = await fetch(`${this.baseUrl}/quiz/${id}/questions`);
    if (!response.ok) {
      throw new Error(`Failed to fetch quiz ${id}`);
    }
    return response.json();
  }

  async getQuizQuestions(quizId: string): Promise<QuestionType[]> {
    const response = await fetch(`${this.baseUrl}/quiz/${quizId}/questions`);
    if (!response.ok) {
      throw new Error(`Failed to fetch questions for quiz ${quizId}`);
    }
    return response.json();
  }

  async createQuiz(quiz: Omit<QuizType, 'id' | 'questions'>): Promise<QuizType> {
    const response = await fetch(`${this.baseUrl}/quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quiz),
    });
    if (!response.ok) {
      throw new Error('Failed to create quiz');
    }
    return response.json();
  }

  async updateQuiz(id: string, quiz: Partial<QuizType>): Promise<QuizType> {
    const response = await fetch(`${this.baseUrl}/quiz/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quiz),
    });
    if (!response.ok) {
      throw new Error(`Failed to update quiz ${id}`);
    }
    return response.json();
  }

  async deleteQuiz(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/quiz/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete quiz ${id}`);
    }
  }

  async addQuestion(quizId: string, question: Omit<QuestionType, 'id'>): Promise<QuestionType> {
    const response = await fetch(`${this.baseUrl}/quiz/${quizId}/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(question),
    });
    if (!response.ok) {
      throw new Error(`Failed to add question to quiz ${quizId}`);
    }
    return response.json();
  }

  async updateQuestion(quizId: string, questionId: string, question: Partial<QuestionType>): Promise<QuestionType> {
    const response = await fetch(`${this.baseUrl}/quiz/${quizId}/questions/${questionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(question),
    });
    if (!response.ok) {
      throw new Error(`Failed to update question ${questionId}`);
    }
    return response.json();
  }

  async deleteQuestion(quizId: string, questionId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/quiz/${quizId}/questions/${questionId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete question ${questionId}`);
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