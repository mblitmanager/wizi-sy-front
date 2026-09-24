import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useUser } from "@/hooks/useAuth";
import { rankingService } from "@/services/rankingService";
import { quizService } from "@/services/quizServiceA";
import { quizHistoryService } from "@/services/quiz/submission/QuizHistoryService";
import type { Category, QuizHistory, UserProgress } from "@/types/quiz";

/**
 * Données du profil stagiaire. Les formateurs n'ont ni progression ni badges :
 * les requêtes sont désactivées pour eux et `isLoading` repasse à faux immédiatement
 * (une requête désactivée n'est jamais "en chargement").
 */

export interface Achievement {
  id: number;
  name: string;
  type: string;
  description?: string | null;
  icon?: string | null;
  level?: string | null;
  quiz_id?: number | null;
  code?: string | null;
  unlockedAt?: string | null;
}

export const profileKeys = {
  progress: ["stagiaire", "progress"] as const,
  achievements: ["stagiaire", "achievements"] as const,
  quizCategories: ["quiz", "categories", "profile"] as const,
  /** Partagée avec les listes de quiz (même endpoint, même format). */
  quizHistory: ["quiz-history"] as const,
};

function useIsStagiaire() {
  const { user, role } = useUser();
  return !!user && role === "stagiaire";
}

export function useUserProgress() {
  const enabled = useIsStagiaire();
  return useQuery({
    queryKey: profileKeys.progress,
    queryFn: async (): Promise<UserProgress> => {
      const { total } = await rankingService.getUserProgress();
      return {
        totalScore: total.points || 0,
        completedQuizzes: total.completed_quizzes || 0,
        averageScore: total.average_score || 0,
        level: total.level || 1,
      };
    },
    enabled,
  });
}

export function useUserAchievements() {
  const enabled = useIsStagiaire();
  return useQuery({
    queryKey: profileKeys.achievements,
    queryFn: async (): Promise<Achievement[]> => {
      const res = await api.get("/stagiaire/achievements");
      const list = res.data?.achievements ?? res.data;
      return Array.isArray(list) ? list : [];
    },
    enabled,
  });
}

const CATEGORY_COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];
const CATEGORY_CLASSES = [
  "category-blue-500",
  "category-green-500",
  "category-wizi-accent",
  "category-red-500",
  "category-purple-500",
  "category-pink-500",
];

export function useQuizCategories() {
  const enabled = useIsStagiaire();
  return useQuery({
    queryKey: profileKeys.quizCategories,
    queryFn: async (): Promise<Category[]> => {
      const names = await quizService.getQuizCategories();
      return names.map((name, index) => ({
        id: name || `category-${index}`,
        name,
        description: `Quizzes dans la catégorie ${name}`,
        color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
        colorClass: CATEGORY_CLASSES[index % CATEGORY_CLASSES.length],
        quizCount: 0,
      })) as Category[];
    },
    enabled,
    staleTime: 30 * 60 * 1000,
  });
}

export function useQuizHistory() {
  const { user } = useUser();
  return useQuery({
    queryKey: profileKeys.quizHistory,
    queryFn: (): Promise<QuizHistory[]> => quizHistoryService.getQuizHistory(),
    enabled: !!user,
  });
}
