// services/quiz/NextQuizService.ts - VERSION AVEC DEBUG COMPLET
import { stagiaireQuizService } from "./StagiaireQuizService";

export interface NextQuizInfo {
  id: string;
  titre: string;
  categorie: string;
  niveau: string;
  description?: string;
}

export class NextQuizService {
  static async getNextQuiz(
    currentQuizId: string
  ): Promise<NextQuizInfo | null> {
    try {
      const quizzes = await stagiaireQuizService.getStagiaireQuizzes();

      // Essayer plusieurs méthodes de recherche
      const currentIndex = quizzes.findIndex((quiz) => {
        const match = quiz.id === currentQuizId;

        return match;
      });


      if (currentIndex === -1) {
        // Essayer avec conversion numérique
        const numericCurrentId = parseInt(currentQuizId);
        if (!isNaN(numericCurrentId)) {
          const numericIndex = quizzes.findIndex((quiz) => {
            const quizNum = parseInt(quiz.id);
            return !isNaN(quizNum) && quizNum === numericCurrentId;
          });

          if (numericIndex !== -1 && numericIndex < quizzes.length - 1) {
            const nextQuiz = quizzes[numericIndex + 1];
            return {
              id: nextQuiz.id,
              titre: nextQuiz.titre,
              categorie: nextQuiz.categorie,
              niveau: nextQuiz.niveau,
              description: nextQuiz.description,
            };
          }
        }
        return null;
      }

      if (currentIndex >= quizzes.length - 1) {
        return null;
      }

      const nextQuiz = quizzes[currentIndex + 1];

      return {
        id: nextQuiz.id,
        titre: nextQuiz.titre,
        categorie: nextQuiz.categorie,
        niveau: nextQuiz.niveau,
        description: nextQuiz.description,
      };
    } catch (error) {
      console.error("💥 ERREUR dans getNextQuiz:", error);
      return null;
    }
  }
}
