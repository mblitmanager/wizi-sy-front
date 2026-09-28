import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { rankingService } from "@/services/quiz/submission/RankingService";
import { useUser } from "@/hooks/useAuth";

interface RankingEntry {
  stagiaire?: { id?: string | number };
  totalPoints?: number;
  points?: number;
  score?: number;
}

/** Réponse de `GET /users/me/points` (RankingController::getUserPoints). */
export interface UserPoints {
  /** Somme des points du classement : même valeur que le classement global "all". */
  totalPoints: number;
  /** Niveaux accessibles calculés par le backend (seuils 50 et 100 points). */
  accessibleLevels: string[];
}

export const pointsKeys = {
  me: ["stagiaire", "points"] as const,
  globalRanking: ["quiz", "classement", "global", "all"] as const,
};

/** Classement global (toutes périodes) : réservé aux pages de classement. */
export function useGlobalRanking({ enabled = true }: { enabled?: boolean } = {}) {
  const { token } = useUser();
  return useQuery({
    queryKey: pointsKeys.globalRanking,
    queryFn: async (): Promise<RankingEntry[]> => {
      const data = await rankingService.getGlobalClassement("all");
      return Array.isArray(data) ? data : data?.data ?? [];
    },
    enabled: enabled && !!token,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Points du stagiaire connecté.
 * Endpoint dédié et léger, au lieu de télécharger tout le classement global
 * pour n'en garder qu'une ligne.
 */
export function useStagiairePoints() {
  const { user } = useUser();
  return useQuery({
    queryKey: pointsKeys.me,
    queryFn: async (): Promise<UserPoints> => {
      const { data } = await api.get("/users/me/points");
      return {
        totalPoints: Number(data?.totalPoints) || 0,
        accessibleLevels: Array.isArray(data?.accessibleLevels) ? data.accessibleLevels : [],
      };
    },
    enabled: !!user?.stagiaire?.id,
    staleTime: 60 * 1000,
  });
}

/** Points de l'utilisateur connecté (barre du haut, pages quiz). */
export function useClassementPoints() {
  const { data, isLoading, isError } = useStagiairePoints();
  return {
    points: data?.totalPoints ?? 0,
    loading: isLoading,
    error: isError ? "Erreur lors de la récupération des points du classement." : null,
  };
}
