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
      console.log("🚀 DEBUT getNextQuiz avec currentQuizId:", currentQuizId);

      const quizzes = await stagiaireQuizService.getStagiaireQuizzes();

      console.log("📥 Tous les quizzes reçus:", quizzes.length);
      console.log(
        "📋 Liste complète des IDs:",
        quizzes.map((q) => ({
          id: q.id,
          titre: q.titre,
          type: typeof q.id,
          currentQuizId,
          isMatch: q.id === currentQuizId,
        }))
      );

      // Vérifier les types d'IDs
      console.log("🔍 Analyse des types:");

      console.log(
        "- currentQuizId type:",
        typeof currentQuizId,
        "value:",
        currentQuizId
      );
      console.log(
        "- Premier quiz ID type:",
        typeof quizzes[0]?.id,
        "value:",
        quizzes[0]?.id
      );

      // Essayer plusieurs méthodes de recherche
      const currentIndex = quizzes.findIndex((quiz) => {
        const match = quiz.id === currentQuizId;
        console.log(
          `🔍 Comparaison: ${quiz.id} === ${currentQuizId} => ${match}`
        );
        return match;
      });

      console.log("📊 Résultat findIndex:", currentIndex);

      if (currentIndex === -1) {
        console.log("❌ Aucun quiz trouvé avec l'ID:", currentQuizId);

        // Essayer avec conversion numérique
        const numericCurrentId = parseInt(currentQuizId);
        if (!isNaN(numericCurrentId)) {
          console.log("🔄 Essai avec conversion numérique...");
          const numericIndex = quizzes.findIndex((quiz) => {
            const quizNum = parseInt(quiz.id);
            return !isNaN(quizNum) && quizNum === numericCurrentId;
          });
          console.log("📊 Résultat findIndex numérique:", numericIndex);

          if (numericIndex !== -1 && numericIndex < quizzes.length - 1) {
            const nextQuiz = quizzes[numericIndex + 1];
            console.log(
              "✅ Quiz suivant trouvé (via conversion numérique):",
              nextQuiz
            );
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
        console.log("ℹ️ C'est le dernier quiz de la liste");
        return null;
      }

      const nextQuiz = quizzes[currentIndex + 1];
      console.log("✅ SUCCES - Quiz suivant trouvé:", nextQuiz);

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
