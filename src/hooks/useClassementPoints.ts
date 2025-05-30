import { useEffect, useState } from "react";
import { quizSubmissionService } from "@/services/quiz/QuizSubmissionService";

/**
 * Custom hook to get the user's points from the global classement (ranking).
 * Returns { points, loading, error }
 */
export function useClassementPoints() {
  const [points, setPoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchPoints() {
      setLoading(true);
      setError(null);
      try {
        const [profile, ranking] = await Promise.all([
          quizSubmissionService.getStagiaireProfile(),
          quizSubmissionService.getGlobalClassement(),
        ]);
        const userEntry = (ranking || []).find(
          (entry: any) => entry.stagiaire?.id?.toString() === profile?.stagiaire?.id?.toString()
        );
        if (isMounted) {
          setPoints(userEntry?.totalPoints || 0);
        }
      } catch (err) {
        setError("Erreur lors de la récupération des points du classement.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchPoints();
    return () => {
      isMounted = false;
    };
  }, []);

  return { points, loading, error };
}
