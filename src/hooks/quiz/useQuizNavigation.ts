
import { useState } from 'react';
import type { Question } from '@/types/quiz';

export const useQuizNavigation = (questions: Question[] = []) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const goToNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
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
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const currentQuestion = questions[currentQuestionIndex] || null;
  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    isLastQuestion,
    goToNextQuestion,
    goToPreviousQuestion,
    goToQuestion
  };
};
