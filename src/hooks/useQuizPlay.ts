
import { useEffect } from 'react';
import { useQuizData } from './quiz/useQuizData';
import { useQuizNavigation } from './quiz/useQuizNavigation';
import { useQuizTimer } from './quiz/useQuizTimer';
import { useQuizAnswers } from './quiz/useQuizAnswers';
import { useQuizDialogs } from './quiz/useQuizDialogs';
import { useQuizSubmission } from './quiz/useQuizSubmission';

export const useQuizPlay = (quizId: string) => {
  // Get quiz data
  const { quiz, isLoading, error } = useQuizData(quizId);
  
  // Setup navigation
  const navigation = useQuizNavigation(quiz?.questions || []);
  
  // Setup timer - use quiz duration if available
  const defaultDuration = 30 * 60; // 30 minutes in seconds
  const timer = useQuizTimer(quiz?.duree || defaultDuration);
  
  // Setup answers
  const { answers, submitAnswer } = useQuizAnswers();
  
  // Setup dialogs
  const dialogs = useQuizDialogs(quizId);
  
  // Setup submission
  const { isSubmitting, submitQuiz } = useQuizSubmission(quizId);
  
  // Reset timer when quiz changes
  useEffect(() => {
    if (quiz?.duree) {
      timer.setTimeLeft(quiz.duree);
    }
  }, [quiz, timer]);
  
  // Check if the current question has been answered
  const isCurrentQuestionAnswered = () => {
    if (!quiz || !quiz.questions) return false;
    
    const currentQuestion = quiz.questions[navigation.currentQuestionIndex];
    return !!answers[currentQuestion.id] && answers[currentQuestion.id].length > 0;
  };

  // Handle submitting an answer
  const handleAnswer = (answer: string[]) => {
    if (!navigation.currentQuestion) return;
    submitAnswer(navigation.currentQuestion.id, answer);
  };
  
  // Handle submitting the whole quiz
  const handleFinish = () => {
    submitQuiz(answers, timer.timeSpent);
  };

  return {
    // Quiz data
    quiz,
    isLoading: isLoading || isSubmitting,
    error,
    
    // Current question data
    currentQuestion: navigation.currentQuestion,
    currentQuestionIndex: navigation.currentQuestionIndex,
    totalQuestions: navigation.totalQuestions,
    isLastQuestion: navigation.isLastQuestion,
    
    // Timer data
    timeLeft: timer.timeLeft,
    timeSpent: timer.timeSpent,
    isPaused: timer.isPaused,
    setIsPaused: timer.setIsPaused,
    
    // Answers
    answers,
    
    // Dialog states
    ...dialogs,
    
    // Actions
    submitAnswer: handleAnswer,
    goToNextQuestion: navigation.goToNextQuestion,
    goToPreviousQuestion: navigation.goToPreviousQuestion,
    goToQuestion: navigation.goToQuestion,
    submitQuiz: handleFinish,
    isCurrentQuestionAnswered
  };
};
