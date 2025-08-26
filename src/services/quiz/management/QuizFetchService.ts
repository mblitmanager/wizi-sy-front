import apiClient from "@/lib/api-client";
import type { Quiz, QuizHistory, QuizStats } from "@/types/quiz";
import { quizFormatterService } from "./QuizFormatterService";
import { categoryService } from "../CategoryService";
import { quizAnswerService } from "../submission/QuizAnswerService";

export class QuizFetchService {
  async getQuizzesByCategory(categoryId: string): Promise<Quiz[]> {
    try {
      const response = await apiClient.get(`/quiz/category/${categoryId}`);
      const quizzes = response.data || [];
      const categories = await categoryService.getCategories();

      return Promise.all(
        quizzes.map((quiz: any) =>
          quizFormatterService.formatQuiz(quiz, categories)
        )
      );
    } catch (error) {
      console.error("Error fetching quizzes by category:", error);
      return [];
    }
  }

  async getQuizById(quizId: string): Promise<Quiz> {
    try {
      const response = await apiClient.get(`/quiz/${quizId}`);

      // Obtenir les questions directement de l'API
      let questions = [];
      try {
        // Essayer de récupérer des questions détaillées via l'endpoint des questions
        const questionsResponse = await apiClient.get(
          `/quiz/${quizId}/questions`
        );
        if (questionsResponse.data && questionsResponse.data.data) {
          questions = questionsResponse.data.data.map((q: any) =>
            quizAnswerService["formatQuestion"](q)
          );
        }
      } catch (err) {
        questions = response.data.questions || [];
      }

      // Formater le quiz avec les questions détaillées
      const quizData = response.data;
      const formattedQuiz = {
        ...quizData,
        id: String(quizData.id),
        questions: questions.length > 0 ? questions : quizData.questions || [],
      };

      return formattedQuiz;
    } catch (error) {
      console.error("Erreur lors de la récupération du quiz:", error);
      throw error;
    }
  }
}

export const quizFetchService = new QuizFetchService();
