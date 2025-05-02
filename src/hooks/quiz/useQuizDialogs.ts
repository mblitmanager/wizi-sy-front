
import { useState } from "react";
import { quizSubmissionService } from "@/services/quiz/QuizSubmissionService";
import type { QuizHistory, QuizStats } from "@/types/quiz";

export function useQuizDialogs() {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [resultsOpen, setResultsOpen] = useState(false);
  const [history, setHistory] = useState<QuizHistory[]>([]);
  const [stats, setStats] = useState<QuizStats | null>(null);

  const openHistory = async () => {
    try {
      const data = await quizSubmissionService.getQuizHistory();
      setHistory(data);
      setHistoryOpen(true);
    } catch (error) {
      console.error("Error fetching quiz history:", error);
    }
  };

  const openStats = async () => {
    try {
      const data = await quizSubmissionService.getQuizStats();
      setStats(data);
      setStatsOpen(true);
    } catch (error) {
      console.error("Error fetching quiz stats:", error);
    }
  };

  return {
    historyOpen,
    statsOpen,
    resultsOpen,
    history,
    stats,
    setHistoryOpen,
    setStatsOpen,
    setResultsOpen,
    openHistory,
    openStats,
  };
}
