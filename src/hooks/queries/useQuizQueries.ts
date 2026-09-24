import { useQuery } from "@tanstack/react-query";
import { stagiaireQuizService } from "@/services/quiz/StagiaireQuizService";
import { useUser } from "@/hooks/useAuth";

/**
 * Quiz du stagiaire, partagés par toutes les vues (liste, aventure, accueil).
 * Passer d'une vue à l'autre réutilise le cache au lieu de refaire les appels.
 */
export const quizKeys = {
  stagiaireQuizzes: ["stagiaire", "quizzes"] as const,
  participations: ["stagiaire", "participations"] as const,
};

export type StagiaireQuiz = Awaited<ReturnType<typeof stagiaireQuizService.getStagiaireQuizzes>>[number];

export function useStagiaireQuizzes<T = StagiaireQuiz[]>(select?: (quizzes: StagiaireQuiz[]) => T) {
  const { token } = useUser();
  return useQuery({
    queryKey: quizKeys.stagiaireQuizzes,
    queryFn: () => stagiaireQuizService.getStagiaireQuizzes(),
    select,
    enabled: !!token,
  });
}

export function useStagiaireParticipations() {
  const { token } = useUser();
  return useQuery({
    queryKey: quizKeys.participations,
    queryFn: () => stagiaireQuizService.getStagiaireQuizJoue(),
    enabled: !!token,
  });
}
