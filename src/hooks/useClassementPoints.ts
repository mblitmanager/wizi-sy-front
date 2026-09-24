import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { rankingService } from "@/services/quiz/submission/RankingService";
import { useUser } from "@/hooks/useAuth";

interface RankingEntry {
  stagiaire?: { id?: string | number };
  totalPoints?: number;
  points?: number;
  score?: number;
}

/** Classement global (toutes périodes), partagé par la navbar et les pages quiz. */
export function useGlobalRanking({ enabled = true }: { enabled?: boolean } = {}) {
  const { token } = useUser();
  return useQuery({
    queryKey: ["quiz", "classement", "global", "all"],
    queryFn: async (): Promise<RankingEntry[]> => {
      const data = await rankingService.getGlobalClassement("all");
      return Array.isArray(data) ? data : data?.data ?? [];
    },
    enabled: enabled && !!token,
    staleTime: 2 * 60 * 1000,
  });
}

/** Points de l'utilisateur connecté dans le classement global. */
export function useClassementPoints() {
  const { user } = useUser();
  const stagiaireId = user?.stagiaire?.id?.toString();
  const { data: ranking, isLoading, isError } = useGlobalRanking({ enabled: !!stagiaireId });

  const points = useMemo(() => {
    const entry = ranking?.find((e) => e.stagiaire?.id?.toString() === stagiaireId);
    return entry?.totalPoints ?? entry?.points ?? entry?.score ?? 0;
  }, [ranking, stagiaireId]);

  return {
    points,
    loading: isLoading,
    error: isError ? "Erreur lors de la récupération des points du classement." : null,
  };
}
