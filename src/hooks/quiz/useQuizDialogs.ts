
import { useState, useCallback } from 'react';
import { quizSubmissionService } from '@/services/quiz/QuizSubmissionService';
import { quizManagementService } from '@/services/quiz/QuizManagementService';
import { QuizHistory, QuizStats } from '@/types/quiz';

export const useQuizDialogs = (quizId: string) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [quizHistory, setQuizHistory] = useState<QuizHistory[]>([]);
  const [quizStats, setQuizStats] = useState<QuizStats | null>(null);

  const loadQuizHistory = useCallback(async () => {
    try {
      const history = await quizSubmissionService.getQuizHistory();
      setQuizHistory(history);
    } catch (error) {
      console.error('Error loading quiz history:', error);
    }
  }, []);

  const loadQuizStats = useCallback(async () => {
    try {
      const stats = await quizManagementService.getQuizStatistics(quizId);
      setQuizStats(stats);
    } catch (error) {
      console.error('Error loading quiz stats:', error);
    }
  }, [quizId]);

  const openHistoryDialog = () => {
    loadQuizHistory();
    setIsHistoryOpen(true);
  };

  const openStatsDialog = () => {
    loadQuizStats();
    setIsStatsOpen(true);
  };

  const openResultsDialog = () => {
    setIsResultsOpen(true);
  };

  return {
    isHistoryOpen,
    isStatsOpen,
    isResultsOpen,
    quizHistory,
    quizStats,
    openHistoryDialog,
    closeHistoryDialog: () => setIsHistoryOpen(false),
    openStatsDialog,
    closeStatsDialog: () => setIsStatsOpen(false),
    openResultsDialog,
    closeResultsDialog: () => setIsResultsOpen(false)
  };
};
