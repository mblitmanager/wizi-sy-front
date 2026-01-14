import { useEffect, useState } from "react";
import { useQuizData } from "./quiz/useQuizData";
import { useQuizNavigation } from "./quiz/useQuizNavigation";
import { useQuizTimer } from "./quiz/useQuizTimer";
import { useQuizAnswers } from "./quiz/useQuizAnswers";
import { useQuizDialogs } from "./quiz/useQuizDialogs";
import { useQuizSubmission } from "./quiz/useQuizSubmission";
import { Question } from "@/types/quiz";
import apiClient from "@/lib/api-client";

export const useQuizPlay = (quizId: string) => {
  // Get quiz data
  const { quiz, isLoading, error } = useQuizData(quizId);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [isRestored, setIsRestored] = useState(false);

  // Setup answers
  const {
    answers,
    setAnswers,
    submitAnswer,
    reset: resetAnswers,
  } = useQuizAnswers();

  // Process questions based on difficulty level
  useEffect(() => {
    if (!quiz || !quiz.questions || isRestored) return;

    const storageKey = `quiz_session_${quizId}`;
    const savedSession = localStorage.getItem(storageKey);

    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        // Restore questions
        const restoredQuestions = session.questionIds
          .map((id: string) => quiz.questions.find((q) => q.id === id))
          .filter((q: Question | undefined): q is Question => !!q);

        if (restoredQuestions.length > 0) {
          setFilteredQuestions(restoredQuestions);
          setAnswers(session.answers || {});
          setIsRestored(true);
          return;
        }
      } catch (e) {
        console.error("Failed to restore quiz session", e);
        localStorage.removeItem(storageKey);
      }
    }

    // Determine number of questions based on difficulty level
    let questionCount = 5; // default

    if (quiz.niveau && quiz.niveau.toLowerCase() === "intermédiaire") {
      questionCount = 5;
    } else if (quiz.niveau && quiz.niveau.toLowerCase() === "avancé") {
      questionCount = 5;
    }

    // Shuffle the questions array to get random questions
    // If authenticated, try to restore from server first
    const token = localStorage.getItem("token");
    if (token) {
      (async () => {
        try {
          const resp = await apiClient.get(`/quiz/${quizId}/participation/resume`);
          const data = resp?.data || resp;
          if (data) {
            const restoredQuestions = (data.questionIds || data.question_ids || [])
              .map((id: string) => quiz.questions.find((q) => q.id === id))
              .filter((q: Question | undefined): q is Question => !!q);

            if (restoredQuestions.length > 0) {
              setFilteredQuestions(restoredQuestions);
              setAnswers(data.answers || {});
              setIsRestored(true);
              return;
            }
          }
        } catch (e) {
          // proceed to local fallback
        }
      })();
    }
    const shuffledQuestions = [...quiz.questions].sort(
      () => 0.5 - Math.random()
    );

    // Take only the required number of questions
    const selectedQuestions = shuffledQuestions.slice(0, questionCount);

    setFilteredQuestions(selectedQuestions);
  }, [quiz, quizId, isRestored, setAnswers]);

  // Setup navigation with filtered questions
  const navigation = useQuizNavigation(filteredQuestions);

  // Setup timer - use quiz duration if available
  const defaultDuration = 30; // default seconds
  const timer = useQuizTimer(defaultDuration);

  // Setup dialogs
  const dialogs = useQuizDialogs();

  // Setup submission
  const { isSubmitting, submitQuiz } = useQuizSubmission(quizId);

  // Restore navigation and timer state once questions are set
  useEffect(() => {
    if (isRestored && filteredQuestions.length > 0) {
      const storageKey = `quiz_session_${quizId}`;
      const savedSession = localStorage.getItem(storageKey);
      if (savedSession) {
        try {
          const session = JSON.parse(savedSession);
          if (session.currentIndex !== undefined) {
            navigation.setCurrentQuestionIndex(session.currentIndex);
          }
          if (session.timeSpent !== undefined) {
            timer.setTimeSpent(session.timeSpent);
          }
          // We don't restore timeLeft per question as it resets on navigation
        } catch (e) {
          console.error("Failed to restore navigation/timer", e);
        }
      }
    }
  }, [
    isRestored,
    filteredQuestions.length,
    quizId,
    navigation.setCurrentQuestionIndex,
    timer.setTimeSpent,
  ]);

  // Save state to localStorage
  useEffect(() => {
    if (filteredQuestions.length === 0) return;

    const storageKey = `quiz_session_${quizId}`;
    const session = {
      questionIds: filteredQuestions.map((q) => q.id),
      answers,
      currentIndex: navigation.currentQuestionIndex,
      timeSpent: timer.timeSpent,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(storageKey, JSON.stringify(session));
  }, [
    quizId,
    filteredQuestions,
    answers,
    navigation.currentQuestionIndex,
    timer.timeSpent,
  ]);

  // Auto next on timer expire
  useEffect(() => {
    if (timer.timeLeft === 0 && !navigation.isLastQuestion) {
      navigation.goToNextQuestion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.timeLeft]);

  // Reset timer on question change
  useEffect(() => {
    timer.resetTimeLeft(); // <-- NOUVEAU : Réinitialise seulement timeLeft
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation.currentQuestionIndex]);

  // Reset timer when quiz changes
  useEffect(() => {
    if (quiz?.duree) {
      timer.setTimeLeft(quiz.duree);
    }
  }, [quiz, timer]);

  // resetQuiz: resets navigation index, answers and timer
  const resetQuiz = () => {
    localStorage.removeItem(`quiz_session_${quizId}`);
    timer.reset(); // Utiliser le VRAI reset ici (remet timeSpent à 0 pour le nouveau quiz)
    navigation.goToQuestion(0);
    resetAnswers();
    setIsRestored(false); // Allow re-randomization if needed
  };

  const isCurrentQuestionAnswered = () => {
    if (!quiz || filteredQuestions.length === 0) return false;

    const currentQuestion = filteredQuestions[navigation.currentQuestionIndex];
    return (
      !!answers[currentQuestion?.id] && answers[currentQuestion?.id].length > 0
    );
  };

  const handleAnswer = (answer: string[]) => {
    if (!navigation.currentQuestion) return;
    try {
      localStorage.removeItem(`quiz_session_${quizId}`);
      sessionStorage.removeItem(`quiz_session_${quizId}`);
    } catch {}
    submitAnswer(navigation.currentQuestion.id, answer);
  };

  const handleFinish = () => {
    localStorage.removeItem(`quiz_session_${quizId}`);
    submitQuiz(answers, timer.timeSpent, filteredQuestions);
  };

  const calculateTotalPoints = () => filteredQuestions.length * 2;

  return {
    quiz: quiz
      ? {
          ...quiz,
          questions: filteredQuestions,
          points: calculateTotalPoints(),
        }
      : null,
    isLoading: isLoading || isSubmitting,
    error,

    try {
      localStorage.removeItem(`quiz_session_${quizId}`);
      sessionStorage.removeItem(`quiz_session_${quizId}`);
    } catch {}
    currentQuestion: navigation.currentQuestion,
    currentQuestionIndex: navigation.currentQuestionIndex,
    totalQuestions: navigation.totalQuestions,
    isLastQuestion: navigation.isLastQuestion,

    timeLeft: timer.timeLeft,
    timeSpent: timer.timeSpent,
    isPaused: timer.isPaused,
    setIsPaused: timer.setIsPaused,

    answers,

    ...dialogs,

    handleAnswer,
    handleNext: navigation.goToNextQuestion,
    handleBack: navigation.goToPreviousQuestion,
    goToQuestion: navigation.goToQuestion,
    submitQuiz: handleFinish,
    isCurrentQuestionAnswered,
    handleFinish,
    resetQuiz,
    showResults: dialogs.resultsOpen,
    toggleHistory: dialogs.openHistory,
    toggleStats: dialogs.openStats,
    closeResults: dialogs.closeResultsDialog,
  };
};
