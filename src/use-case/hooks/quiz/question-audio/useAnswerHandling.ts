import { useState } from "react";
import { Question as QuizQuestion } from "@/types/quiz";
export const useAnswerHandling = (
  question: QuizQuestion,
  onAnswer: (answer: { id: string; text: string }) => void,
  showFeedback: boolean
) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleAnswer = (answerId: string) => {
    const answerText =
      question.answers?.find((a) => a.id === answerId)?.text || "";
    setSelectedAnswer(answerId);
    onAnswer({ id: answerId, text: answerText });
  };

  const isCorrectAnswer = (answerId: string) => {
    if (!showFeedback) return undefined;
    const answer = question.answers?.find((a) => a.id === answerId);
    return answer?.isCorrect || answer?.is_correct === 1;
  };

  return { selectedAnswer, handleAnswer, isCorrectAnswer };
};
