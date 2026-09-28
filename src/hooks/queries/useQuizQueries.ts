import { useQuery } from "@tanstack/react-query";
import { stagiaireQuizService } from "@/services/quiz/StagiaireQuizService";
import { useUser } from "@/hooks/useAuth";

/**
 * Quiz du stagiaire, partagés par toutes les vues (parcours, liste, accueil).
 * Passer d'une vue à l'autre réutilise le cache au lieu de refaire les appels.
 *
 * Le statut "joué" vient de l'historique (`GET /quiz/history`, table progressions),
 * voir `useQuizHistory` dans useProfileQueries.
 */
export const quizKeys = {
  /** Préfixe commun : l'invalider rafraîchit toutes les variantes. */
  stagiaireQuizzes: ["stagiaire", "quizzes"] as const,
  stagiaireQuizzesSummary: ["stagiaire", "quizzes", "summary"] as const,
};

export type StagiaireQuiz = Awaited<ReturnType<typeof stagiaireQuizService.getStagiaireQuizzes>>[number];

export function useStagiaireQuizzes<T = StagiaireQuiz[]>(select?: (quizzes: StagiaireQuiz[]) => T) {
  const { token } = useUser();
  return useQuery({
    // Version allégée (sans les réponses) : les listes n'ont besoin que du nombre de questions et des points
    queryKey: quizKeys.stagiaireQuizzesSummary,
    queryFn: () => stagiaireQuizService.getStagiaireQuizzes({ summary: true }),
    select,
    enabled: !!token,
  });
}
