
import { useEffect, useState } from 'react';
import { useQuizData } from './quiz/useQuizData';
import { useQuizNavigation } from './quiz/useQuizNavigation';
import { useQuizTimer } from './quiz/useQuizTimer';
import { useQuizAnswers } from './quiz/useQuizAnswers';
import { useQuizDialogs } from './quiz/useQuizDialogs';
import { useQuizSubmission } from './quiz/useQuizSubmission';
import { Question } from '@/types/quiz';

export const useQuizPlay = (quizId: string) => {
  // Get quiz data
  const { quiz, isLoading, error } = useQuizData(quizId);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  
  // Setup answers
  const { answers, submitAnswer } = useQuizAnswers();

  // Process questions based on difficulty level
  useEffect(() => {
    if (!quiz || !quiz.questions) return;
    
    // Determine number of questions based on difficulty level
    let questionCount = 5; // default for beginner
    
    if (quiz.niveau && quiz.niveau.toLowerCase() === 'intermédiaire') {
      questionCount = 10;
    } else if (quiz.niveau && quiz.niveau.toLowerCase() === 'avancé') {
      questionCount = 20;
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
  const defaultDuration = 30 * 60; // 30 minutes in seconds
  const timer = useQuizTimer(quiz?.duree || defaultDuration);
  
  // Setup dialogs
  const dialogs = useQuizDialogs();
  
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
    if (!quiz || filteredQuestions.length === 0) return false;
    
    const currentQuestion = filteredQuestions[navigation.currentQuestionIndex];
    return !!answers[currentQuestion?.id] && answers[currentQuestion?.id].length > 0;
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

  // Calculate points based on filtered questions (2 points per question)
  const calculateTotalPoints = () => {
    return filteredQuestions.length * 2;
  };

  return {
    // Quiz data with filtered questions
    quiz: quiz ? {
      ...quiz,
      questions: filteredQuestions,
      points: calculateTotalPoints() // Update points calculation
    } : null,
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
