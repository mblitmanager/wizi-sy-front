
import { useState } from 'react';

export const useQuizAnswers = () => {
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  const submitAnswer = (questionId: string, selectedAnswers: string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedAnswers
    }));
  };

  return {
    answers,
    submitAnswer
  };
};
