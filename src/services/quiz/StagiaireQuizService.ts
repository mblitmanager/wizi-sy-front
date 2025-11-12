import apiClient from "@/lib/api-client";
import type { Quiz } from "@/types/quiz";
import { quizManagementService } from "./QuizManagementService";

class StagiaireQuizService {
  private quizzesCache: { data: Quiz[]; timestamp: number } | null = null;
  private participationsCache: { data: any[]; timestamp: number } | null = null;
  private readonly CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

  async getStagiaireQuizzes(): Promise<Quiz[]> {
    // Retourner le cache si valide
    if (
      this.quizzesCache &&
      Date.now() - this.quizzesCache.timestamp < this.CACHE_DURATION
    ) {
      return this.quizzesCache.data;
    }

    try {
      const response = await apiClient.get("/stagiaire/quizzes", {
        timeout: 10000, // Timeout de 10 secondes
      });

      const quizzes = response.data.data || [];

      // Optimisation: Formater en parallèle avec limitation de concurrence
      const mappedQuizzes = await this.formatQuizzesInBatches(quizzes, 5); // 5 en parallèle

      // Mettre en cache
      this.quizzesCache = {
        data: mappedQuizzes,
        timestamp: Date.now(),
      };

      return mappedQuizzes;
    } catch (error) {
      console.error("Error fetching stagiaire quizzes:", error);
      // Retourner le cache même s'il est expiré en cas d'erreur
      return this.quizzesCache?.data || [];
    }
  }

  async getStagiaireQuizJoue(): Promise<any[]> {
    // Retourner le cache si valide
    if (
      this.participationsCache &&
      Date.now() - this.participationsCache.timestamp < this.CACHE_DURATION
    ) {
      return this.participationsCache.data;
    }

    try {
      const response = await apiClient.get("/quiz/history", {
        timeout: 8000, // Timeout plus court pour l'historique
      });

      const participations = response.data;

      // Optimisation: Utiliser Set pour la déduplication (plus rapide que Map)
      const uniqueQuizzes = this.deduplicateQuizzes(participations);

      // Mettre en cache
      this.participationsCache = {
        data: uniqueQuizzes,
        timestamp: Date.now(),
      };

      return uniqueQuizzes;
    } catch (error) {
      console.error("Error fetching quiz participations:", error);
      return this.participationsCache?.data || [];
    }
  }

  // Récupérer les deux ensembles de données en parallèle
  async getStagiaireQuizzesAndParticipations(): Promise<{
    quizzes: Quiz[];
    participations: any[];
  }> {
    try {
      const [quizzes, participations] = await Promise.all([
        this.getStagiaireQuizzes(),
        this.getStagiaireQuizJoue(),
      ]);

      return { quizzes, participations };
    } catch (error) {
      console.error("Error fetching both quizzes and participations:", error);
      return {
        quizzes: this.quizzesCache?.data || [],
        participations: this.participationsCache?.data || [],
      };
    }
  }

  // Forcer l'invalidation du cache si nécessaire
  invalidateCache(): void {
    this.quizzesCache = null;
    this.participationsCache = null;
  }

  // Méthodes privées d'optimisation
  private async formatQuizzesInBatches(
    quizzes: any[],
    batchSize: number
  ): Promise<Quiz[]> {
    const batches = [];

    for (let i = 0; i < quizzes.length; i += batchSize) {
      batches.push(quizzes.slice(i, i + batchSize));
    }

    const results = [];
    for (const batch of batches) {
      const formattedBatch = await Promise.all(
        batch.map((quiz) => quizManagementService.formatStagiaireQuiz(quiz))
      );
      results.push(...formattedBatch);
    }

    return results;
  }

  private deduplicateQuizzes(participations: any[]): any[] {
    const seen = new Set();
    const uniqueQuizzes = [];

    for (const participation of participations) {
      const quizId = participation.quiz?.id;
      if (quizId && !seen.has(quizId)) {
        seen.add(quizId);
        uniqueQuizzes.push(participation.quiz);
      }
    }

    return uniqueQuizzes;
  }
}

export const stagiaireQuizService = new StagiaireQuizService();
