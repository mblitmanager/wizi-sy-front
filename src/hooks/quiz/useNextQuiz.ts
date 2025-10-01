import { useState, useEffect } from "react";
import { NextQuizService, NextQuizInfo } from "@/services/quiz/NextQuizService";

export function useNextQuiz(currentQuizId?: string) {
  const [nextQuiz, setNextQuiz] = useState<NextQuizInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentQuizId) return;

    const fetchNextQuiz = async () => {
      setLoading(true);
      setError(null);
      try {
        const next = await NextQuizService.getNextQuiz(currentQuizId);
        setNextQuiz(next);
      } catch (err) {
        setError("Erreur lors du chargement du quiz suivant");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNextQuiz();
  }, [currentQuizId]);

  return { nextQuiz, loading, error };
}
