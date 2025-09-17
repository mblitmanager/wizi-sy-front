import { useEffect, useState } from "react";
import { useQuizData } from "./quiz/useQuizData";
import { useQuizNavigation } from "./quiz/useQuizNavigation";
import { useQuizTimer } from "./quiz/useQuizTimer";
import { useQuizAnswers } from "./quiz/useQuizAnswers";
import { useQuizDialogs } from "./quiz/useQuizDialogs";
import { useQuizSubmission } from "./quiz/useQuizSubmission";
import { Question } from "@/types/quiz";

export const useQuizPlay = (quizId: string) => {
  // Get quiz data
  const { quiz, isLoading, error } = useQuizData(quizId);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);

  // Setup answers
  const { answers, submitAnswer, reset: resetAnswers } = useQuizAnswers();

  // Process questions based on difficulty level
  useEffect(() => {
    if (!quiz || !quiz.questions) return;

    // Determine number of questions based on difficulty level
    let questionCount = 5; // default

    if (quiz.niveau && quiz.niveau.toLowerCase() === "intermédiaire") {
      questionCount = 5;
    } else if (quiz.niveau && quiz.niveau.toLowerCase() === "avancé") {
      questionCount = 5;
    }

    // Shuffle the questions array to get random questions
    const shuffledQuestions = [...quiz.questions].sort(() => 0.5 - Math.random());

    // Take only the required number of questions
    const selectedQuestions = shuffledQuestions.slice(0, questionCount);

    setFilteredQuestions(selectedQuestions);
  }, [quiz]);

  // Setup navigation with filtered questions
  const navigation = useQuizNavigation(filteredQuestions);

  // Setup timer - use quiz duration if available
  const defaultDuration = 30; // default seconds
  const timer = useQuizTimer(defaultDuration);

  // Setup dialogs
  const dialogs = useQuizDialogs();

  // Setup submission
  const { isSubmitting, submitQuiz } = useQuizSubmission(quizId);

  // Auto next on timer expire
  useEffect(() => {
    if (timer.timeLeft === 0 && !navigation.isLastQuestion) {
      navigation.goToNextQuestion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.timeLeft]);

  // Reset timer on question change
  useEffect(() => {
    timer.reset();
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
    timer.reset();
    navigation.goToQuestion(0);
    resetAnswers();
  };

  const isCurrentQuestionAnswered = () => {
    if (!quiz || filteredQuestions.length === 0) return false;

    const currentQuestion = filteredQuestions[navigation.currentQuestionIndex];
    return !!answers[currentQuestion?.id] && answers[currentQuestion?.id].length > 0;
  };

  const handleAnswer = (answer: string[]) => {
    if (!navigation.currentQuestion) return;
    submitAnswer(navigation.currentQuestion.id, answer);
  };

  const handleFinish = () => {
    submitQuiz(answers, timer.timeSpent);
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
