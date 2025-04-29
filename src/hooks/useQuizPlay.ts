
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizManagementService } from '@/services/quiz/QuizManagementService';
import { quizSubmissionService } from '@/services/quiz/QuizSubmissionService';
import { useToast } from '@/hooks/use-toast';
import type { Quiz, Question } from '@/types/quiz';

export const useQuizPlay = (quizId: string) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // State for quiz data
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for quiz timer
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // State for dialogs
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  
  // State for quiz history and stats
  const [quizHistory, setQuizHistory] = useState([]);
  const [quizStats, setQuizStats] = useState(null);

  // Load quiz history and stats
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

  // Load quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setIsLoading(true);
        const quizData = await quizManagementService.getQuizById(quizId);
        
        if (!quizData) {
          setError('Quiz not found');
          return;
        }
        
        if (!quizData.questions || quizData.questions.length === 0) {
          setError('No questions found for this quiz');
          return;
        }
        
        setQuiz(quizData);
        
        // Initialize timer with quiz duration (default to 30 minutes if not specified)
        const duration = quizData.duree || 30 * 60; // 30 minutes in seconds
        setTimeLeft(duration);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching quiz:', error);
        setError('Failed to load quiz. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  // Timer logic
  useEffect(() => {
    if (!isLoading && quiz && timeLeft > 0 && !isPaused) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        setTimeSpent(prev => prev + 1);
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isLoading, quiz, timeLeft, isPaused]);

  // Handle submitting an answer
  const submitAnswer = (questionId: string, selectedAnswers: string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedAnswers
    }));
  };

  // Navigation methods
  const goToNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (quiz && nextIndex < quiz.questions!.length) {
      setCurrentQuestionIndex(nextIndex);
    }
  };

  const goToPreviousQuestion = () => {
    const prevIndex = currentQuestionIndex - 1;
    if (prevIndex >= 0) {
      setCurrentQuestionIndex(prevIndex);
    }
  };

  const goToQuestion = (index: number) => {
    if (quiz && index >= 0 && index < quiz.questions!.length) {
      setCurrentQuestionIndex(index);
    }
  };

  // Submit the whole quiz
  const submitQuiz = async () => {
    if (!quiz) return;
    
    try {
      setIsLoading(true);
      const result = await quizSubmissionService.submitQuiz(
        quizId,
        answers,
        timeSpent
      );
      
      setIsLoading(false);
      
      // Navigate to results page
      navigate(`/quiz/${quizId}/results`, { state: { result } });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to submit quiz. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Check if the current question has been answered
  const isCurrentQuestionAnswered = () => {
    if (!quiz || !quiz.questions) return false;
    
    const currentQuestion = quiz.questions[currentQuestionIndex];
    return !!answers[currentQuestion.id] && answers[currentQuestion.id].length > 0;
  };

  // Dialog control methods
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

  const currentQuestion = quiz?.questions?.[currentQuestionIndex] || null;
  const totalQuestions = quiz?.questions?.length || 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return {
    quiz,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    isLastQuestion,
    answers,
    isLoading,
    error,
    timeLeft,
    timeSpent,
    isPaused,
    isHistoryOpen,
    isStatsOpen,
    isResultsOpen,
    quizHistory,
    quizStats,
    setIsPaused,
    submitAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    goToQuestion,
    submitQuiz,
    isCurrentQuestionAnswered,
    openHistoryDialog,
    closeHistoryDialog: () => setIsHistoryOpen(false),
    openStatsDialog,
    closeStatsDialog: () => setIsStatsOpen(false),
    openResultsDialog,
    closeResultsDialog: () => setIsResultsOpen(false),
  };
};
