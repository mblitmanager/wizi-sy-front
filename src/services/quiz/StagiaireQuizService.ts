import { api } from "@/lib/api";
import type { Quiz } from "@/types/quiz";
import { quizManagementService } from "./QuizManagementService";

class StagiaireQuizService {
  /**
   * @param options.summary questions allégées (id, points) sans les réponses :
   *   suffisant pour les listes, beaucoup plus léger. Par défaut : format complet.
   */
  async getStagiaireQuizzes(options: { summary?: boolean } = {}): Promise<Quiz[]> {
    try {
      const response = await api.get("/stagiaire/quizzes", {
        params: options.summary ? { summary: 1 } : undefined,
      });

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
      const response = await api.get("/quiz/history");
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
