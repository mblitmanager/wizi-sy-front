import { api } from "@/services/api";
import { Quiz, Question, QuizResult, Category } from "@/types/quiz";

interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: string;
}

export const quizService = {
  getQuizCategories: async (): Promise<string[]> => {
    try {
      const response = await api.get<ApiResponse<string[]>>("/quiz/categories");
      return response.data?.data || [];
    } catch (error) {
      console.error("Error fetching quiz categories:", error);
      return [];
    }
  },

  getQuizzesByCategory: async (categoryId: string): Promise<Quiz[]> => {
    try {
      const response = await api.get<ApiResponse<Quiz[]>>(
        `/quiz/category/${categoryId}`
      );
      return response.data?.data || [];
    } catch (error) {
      console.error("Error fetching quizzes by category:", error);
      return [];
    }
  },

  getQuizById: async (quizId: string): Promise<Quiz | null> => {
    try {
      const response = await api.get<ApiResponse<Quiz>>(`/quiz/${quizId}`);

      if (response?.data?.data) {
        return response.data.data;
      }

      return null;
    } catch (error) {
      console.error("Error fetching quiz:", error);

      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }

      return null;
    }
  },

  getQuestions: async (quizId: string): Promise<Question[]> => {
    try {
      const response = await api.get<ApiResponse<Question[]>>(
        `/quiz/${quizId}/questions`
      );

      if (response?.data?.data) {
        return response.data.data;
      }

      return [];
    } catch (error) {
      if (error.response) {
        return [];
      }

      return [];
    }
  },

  submitQuizResult: async (
    quizId: string,
    result: {
      answers: Record<string, string[]>;
      timeSpent: number;
    }
  ): Promise<QuizResult | null> => {
    try {
      const response = await api.post<ApiResponse<QuizResult>>(
        `/quiz/${quizId}/result`,
        result
      );
      return response.data?.data || null;
    } catch (error) {
      console.error("Error submitting quiz result:", error);
      return null;
    }
  },

  getUserResults: async (): Promise<QuizResult[]> => {
    try {
      const response = await api.get<ApiResponse<QuizResult[]>>(
        "/stagiaire/quizzes"
      );

      // Adaptation des données pour correspondre à notre interface QuizResult
      const results = response.data?.data || [];
      return results.map((result) => ({
        ...result,
        quiz_name: result.quiz_name || "Quiz", // Assurons-nous que quiz_name est défini
      }));
    } catch (error) {
      console.error("Error fetching user results:", error);
      return [];
    }
  },

  getLeaderboard: async (): Promise<any[]> => {
    try {
      const response = await api.get<ApiResponse<any[]>>(
        "/stagiaire/ranking/global"
      );
      return response.data?.data || [];
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      return [];
    }
  },
};
