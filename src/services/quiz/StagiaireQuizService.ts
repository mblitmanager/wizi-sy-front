import apiClient from "@/lib/api-client";
import type { Quiz } from "@/types/quiz";
import { quizManagementService } from "./QuizManagementService";

class StagiaireQuizService {
  async getStagiaireQuizzes(): Promise<Quiz[]> {
    try {
      const response = await apiClient.get("/stagiaire/quizzes");

      const quizzes = response.data.data || [];

      const mappedQuizzes = await Promise.all(
        quizzes.map((quiz) =>
          quizManagementService["formatStagiaireQuiz"](quiz)
        )
      );
      return mappedQuizzes;
    } catch (error) {
      console.error("Error fetching stagiaire quizzes:", error);
      return [];
    }
  }
  async getStagiaireQuizJoue(): Promise<any[]> {
    try {
      const response = await apiClient.get("/quiz/history");
      const participations = response.data;

      // Filtrer les quiz uniques par leur ID
      const uniqueQuizzesMap = new Map();

      for (const participation of participations) {
        const quizId = participation.quiz.id;
        if (!uniqueQuizzesMap.has(quizId)) {
          uniqueQuizzesMap.set(quizId, participation.quiz);
        }
      }

      const mappedData = Array.from(uniqueQuizzesMap.values());
      return mappedData;
    } catch (error) {
      return [];
    }
  }
}

export const stagiaireQuizService = new StagiaireQuizService();
