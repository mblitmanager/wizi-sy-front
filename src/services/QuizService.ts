import axios from "axios";
import {
  Quiz as QuizType,
  Question as QuestionType,
  Answer as AnswerType,
} from "@/types/quiz";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000api";

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

interface QuizParticipation {
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

interface ApiResponse<T> {
  data: T;
}

class QuizService {
  private static instance: QuizService;
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_URL;
  }

  public static getInstance(): QuizService {
    if (!QuizService.instance) {
      QuizService.instance = new QuizService();
    }
    return QuizService.instance;
  }

  private getAuthHeader() {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getAllQuizzes(): Promise<QuizType[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/quiz`, {
        headers: this.getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      throw error;
    }
  }

  async getQuizById(id: string): Promise<QuizType> {
    try {
      const response = await axios.get(`${this.baseUrl}/quiz/${id}/questions`, {
        headers: this.getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching quiz ${id}:`, error);
      throw error;
    }
  }

  async getQuizQuestions(quizId: string): Promise<QuestionType[]> {
    try {
      console.log("Fetching questions for quiz:", quizId);
      console.log("Using base URL:", this.baseUrl);
      const response = await axios.get(
        `${this.baseUrl}/quiz/${quizId}/questions`,
        {
          headers: this.getAuthHeader(),
        }
      );
      console.log("API Response:", response);
      console.log("Response data:", response.data);

      const questions = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data.data)
        ? response.data.data
        : Array.isArray(response.data.questions)
        ? response.data.questions
        : [];

      console.log("Formatted questions:", questions);
      return questions;
    } catch (error) {
      console.error(`Error fetching questions for quiz ${quizId}:`, error);
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
      }
      throw error;
    }
  }

  async createQuiz(
    quiz: Omit<QuizType, "id" | "questions">
  ): Promise<QuizType> {
    try {
      const response = await axios.post(`${this.baseUrl}/quiz`, quiz, {
        headers: {
          ...this.getAuthHeader(),
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating quiz:", error);
      throw error;
    }
  }

  async updateQuiz(id: string, quiz: Partial<QuizType>): Promise<QuizType> {
    try {
      const response = await axios.put(`${this.baseUrl}/quiz/${id}`, quiz, {
        headers: {
          ...this.getAuthHeader(),
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating quiz ${id}:`, error);
      throw error;
    }
  }

  async deleteQuiz(id: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/quiz/${id}`, {
        headers: this.getAuthHeader(),
      });
    } catch (error) {
      console.error(`Error deleting quiz ${id}:`, error);
      throw error;
    }
  }

  async addQuestion(
    quizId: string,
    question: Omit<QuestionType, "id">
  ): Promise<QuestionType> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/quiz/${quizId}/questions`,
        question,
        {
          headers: {
            ...this.getAuthHeader(),
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error adding question to quiz ${quizId}:`, error);
      throw error;
    }
  }

  async updateQuestion(
    quizId: string,
    questionId: string,
    question: Partial<QuestionType>
  ): Promise<QuestionType> {
    try {
      const response = await axios.put(
        `${this.baseUrl}/quiz/${quizId}/questions/${questionId}`,
        question,
        {
          headers: {
            ...this.getAuthHeader(),
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating question ${questionId}:`, error);
      throw error;
    }
  }

  async deleteQuestion(quizId: string, questionId: string): Promise<void> {
    try {
      await axios.delete(
        `${this.baseUrl}/quiz/${quizId}/questions/${questionId}`,
        {
          headers: this.getAuthHeader(),
        }
      );
    } catch (error) {
      console.error(`Error deleting question ${questionId}:`, error);
      throw error;
    }
  }

  async getQuizDetails(quizId: number): Promise<{ data: Quiz }> {
    try {
      const response = await axios.get(`${this.baseUrl}/quiz/${quizId}`, {
        headers: this.getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching quiz details:", error);
      throw error;
    }
  }

  async getQuizResult(quizId: number): Promise<{ data: QuizResult }> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/quiz/${quizId}/result`,
        {},
        {
          headers: {
            ...this.getAuthHeader(),
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching quiz result:", error);
      throw error;
    }
  }

  async submitQuiz(submission: QuizSubmission): Promise<{ data: QuizResult }> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/quiz/${submission.quiz_id}/result`,
        {
          answers: submission.answers,
          timeSpent: submission.time_spent,
        },
        {
          headers: {
            ...this.getAuthHeader(),
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error submitting quiz:", error);
      throw error;
    }
  }

  async getQuizHistory(): Promise<{ data: QuizResult[] }> {
    try {
      const response = await axios.get(`${this.baseUrl}/quiz/history`, {
        headers: this.getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching quiz history:", error);
      throw error;
    }
  }

  async getQuizStatistics(quizId: number): Promise<{ data: any }> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/quiz/${quizId}/statistics`,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching quiz statistics:", error);
      throw error;
    }
  }

  async startQuizParticipation(
    quizId: number
  ): Promise<{ data: QuizParticipation }> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/quiz/${quizId}/participation`,
        {},
        {
          headers: {
            ...this.getAuthHeader(),
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error starting quiz participation:", error);
      throw error;
    }
  }

  async getCurrentParticipation(
    quizId: string
  ): Promise<ApiResponse<Progression>> {
    try {
      console.log("Fetching current participation for quiz:", quizId);
      const response = await axios.get<ApiResponse<Progression>>(
        `${this.baseUrl}/quiz/${quizId}/current-participation`,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error getting current participation:", error);
      throw error;
    }
  }

  async completeParticipation(
    quizId: string,
    data: {
      score: number;
      correct_answers: number;
      time_spent: number;
    }
  ): Promise<ApiResponse<Progression>> {
    try {
      const response = await axios.post<ApiResponse<Progression>>(
        `${this.baseUrl}/quiz/${quizId}/complete`,
        data,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error completing participation:", error);
      throw error;
    }
  }

  async getParticipationResume(participationId: number): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/quiz-participations/${participationId}/resume`,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching participation resume:", error);
      throw error;
    }
  }
}

export default QuizService.getInstance();
