import apiClient from "@/lib/api-client";
import type { QuizHistory, QuizStats, QuizResult } from "@/types/quiz";
import { useQuery } from "@tanstack/react-query";

// Interface pour le cache
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class QuizHistoryService {
  private cache = new Map<string, CacheItem<any>>();
  private readonly CACHE_DURATION = {
    HISTORY: 2 * 60 * 1000, // 2 minutes
    STATS: 5 * 60 * 1000, // 5 minutes
    RESULT: 10 * 60 * 1000, // 10 minutes
  };

  private preloadPromises = new Map<string, Promise<any>>();
  private pendingRequests = new Map<string, Promise<any>>();

  async getQuizHistory(): Promise<QuizHistory[]> {
    const cacheKey = "quiz-history";

    // 1. Vérifier le cache en premier
    const cached = this.getFromCache<QuizHistory[]>(cacheKey);
    if (cached) {
      console.log("📦 Quiz history served from cache");
      return cached;
    }

    // 2. Éviter les requêtes dupliquées
    if (this.pendingRequests.has(cacheKey)) {
      console.log("🔄 Returning pending quiz history request");
      return this.pendingRequests.get(cacheKey)!;
    }

    try {
      console.time("🕒 Quiz History API Call");

      const requestPromise = apiClient
        .get("/quiz/history", {
          timeout: 8000,
          headers: {
            "Cache-Control": "max-age=120", // 2 minutes cache header
          },
        })
        .then((response) => {
          const history = response.data;

          // Optimisation: Filtrer et trier les données côté client si possible
          const optimizedHistory = this.optimizeHistoryData(history);

          // Mettre en cache
          this.setCache(
            cacheKey,
            optimizedHistory,
            this.CACHE_DURATION.HISTORY
          );

          console.timeEnd("🕒 Quiz History API Call");
          console.log(`📊 Loaded ${optimizedHistory.length} history items`);

          return optimizedHistory;
        });

      // Stocker la promesse pour éviter les doublons
      this.pendingRequests.set(cacheKey, requestPromise);

      const result = await requestPromise;
      return result;
    } catch (error) {
      console.error("❌ Error fetching quiz history:", error);

      // En cas d'erreur, essayer de retourner le cache expiré
      const expiredCache = this.getFromCache<QuizHistory[]>(cacheKey, true);
      if (expiredCache) {
        console.log("🔄 Serving expired cache as fallback");
        return expiredCache;
      }

      throw new Error("Failed to fetch quiz history");
    } finally {
      // Nettoyer la requête en cours
      this.pendingRequests.delete(cacheKey);
    }
  }

  async getQuizStats(): Promise<QuizStats> {
    const cacheKey = "quiz-stats";

    // 1. Vérifier le cache
    const cached = this.getFromCache<QuizStats>(cacheKey);
    if (cached) {
      return cached;
    }

    // 2. Éviter les requêtes dupliquées
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)!;
    }

    try {
      console.time("🕒 Quiz Stats API Call");

      const requestPromise = apiClient
        .get("/quiz/stats", {
          timeout: 5000,
          headers: {
            "Cache-Control": "max-age=300", // 5 minutes cache header
          },
        })
        .then((response) => {
          const stats = response.data;

          // Mettre en cache
          this.setCache(cacheKey, stats, this.CACHE_DURATION.STATS);

          console.timeEnd("🕒 Quiz Stats API Call");
          return stats;
        });

      this.pendingRequests.set(cacheKey, requestPromise);
      const result = await requestPromise;
      return result;
    } catch (error) {
      console.error("❌ Error fetching quiz stats:", error);

      const expiredCache = this.getFromCache<QuizStats>(cacheKey, true);
      if (expiredCache) {
        return expiredCache;
      }

      throw new Error("Failed to fetch quiz stats");
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  async getQuizResult(quizId: string): Promise<QuizResult> {
    const cacheKey = `quiz-result-${quizId}`;

    // 1. Vérifier le cache
    const cached = this.getFromCache<QuizResult>(cacheKey);
    if (cached) {
      return cached;
    }

    // 2. Éviter les requêtes dupliquées
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)!;
    }

    try {
      const requestPromise = apiClient
        .get(`/quiz/${quizId}/result`, {
          timeout: 6000,
        })
        .then((response) => {
          const result = response.data;

          // Mettre en cache
          this.setCache(cacheKey, result, this.CACHE_DURATION.RESULT);

          return result;
        });

      this.pendingRequests.set(cacheKey, requestPromise);
      const result = await requestPromise;
      return result;
    } catch (error) {
      console.error(`❌ Error fetching quiz result for ${quizId}:`, error);
      throw new Error("Failed to fetch quiz result");
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  // Préchargement des données pour une expérience plus fluide
  async preloadData(): Promise<void> {
    const preloadKey = "preload-all";

    if (this.preloadPromises.has(preloadKey)) {
      return this.preloadPromises.get(preloadKey)!;
    }

    const preloadPromise = Promise.allSettled([
      this.getQuizHistory().catch((error) => {
        console.warn("⚠️ Preload history failed:", error);
        return [];
      }),
      this.getQuizStats().catch((error) => {
        console.warn("⚠️ Preload stats failed:", error);
        return null;
      }),
    ]).then(() => {
      console.log("🎯 Quiz data preloaded successfully");
    });

    this.preloadPromises.set(preloadKey, preloadPromise);
    return preloadPromise;
  }

  // Récupération groupée pour éviter les requêtes multiples
  async getCompleteQuizData(): Promise<{
    history: QuizHistory[];
    stats: QuizStats;
  }> {
    try {
      const [history, stats] = await Promise.all([
        this.getQuizHistory(),
        this.getQuizStats(),
      ]);

      return { history, stats };
    } catch (error) {
      console.error("❌ Error fetching complete quiz data:", error);

      // Fallback: retourner ce qui est disponible
      return {
        history: this.getFromCache<QuizHistory[]>("quiz-history") || [],
        stats:
          this.getFromCache<QuizStats>("quiz-stats") || this.getDefaultStats(),
      };
    }
  }

  // Gestion du cache
  private getFromCache<T>(
    key: string,
    includeExpired: boolean = false
  ): T | null {
    const item = this.cache.get(key);

    if (!item) return null;

    const isExpired = Date.now() > item.expiresAt;

    if (!includeExpired && isExpired) {
      this.cache.delete(key);
      return null;
    }

    console.log(`📦 Cache ${isExpired ? "expired" : "hit"} for: ${key}`);
    return item.data as T;
  }

  private setCache<T>(key: string, data: T, duration: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + duration,
    });

    // Nettoyer le cache périodiquement
    this.cleanupCache();
  }

  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt + 60000) {
        // 1 minute après expiration
        this.cache.delete(key);
      }
    }
  }

  // Optimisation des données
  private optimizeHistoryData(history: QuizHistory[]): QuizHistory[] {
    if (!Array.isArray(history)) return [];

    return history
      .filter((item) => item && item.quizId) // Filtrer les éléments invalides
      .map((item) => ({
        ...item,
        // Normaliser les dates pour éviter les conversions répétées
        completedAt: item.completedAt
          ? new Date(item.completedAt).toISOString()
          : undefined,
        // S'assurer que les nombres sont bien des nombres
        score: Number(item.score) || 0,
        correctAnswers: Number(item.correctAnswers) || 0,
        totalQuestions: Number(item.totalQuestions) || 0,
        timeSpent: Number(item.timeSpent) || 0,
      }))
      .sort((a, b) => {
        // Trier par date de completion (plus récent en premier)
        const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  private getDefaultStats(): QuizStats {
    return {
      totalQuizzes: 0,
      averageScore: 0,
      totalTimeSpent: 0,
      bestScore: 0,
      quizzesCompleted: 0,
      successRate: 0,
    };
  }

  // Méthodes de gestion du cache pour l'application
  invalidateCache(pattern?: string): void {
    if (pattern) {
      // Invalider sélectivement
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      // Invalider tout le cache
      this.cache.clear();
    }

    console.log(
      "🗑️ Cache invalidated",
      pattern ? `for pattern: ${pattern}` : "completely"
    );
  }

  getCacheInfo(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

export const quizHistoryService = new QuizHistoryService();

// Hook React Query optimisé
export const useQuizHistory = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["quiz-history"],
    queryFn: () => quizHistoryService.getQuizHistory(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled,
  });
};

export const useQuizStats = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["quiz-stats"],
    queryFn: () => quizHistoryService.getQuizStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    enabled,
  });
};

export const useCompleteQuizData = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["complete-quiz-data"],
    queryFn: () => quizHistoryService.getCompleteQuizData(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled,
  });
};
