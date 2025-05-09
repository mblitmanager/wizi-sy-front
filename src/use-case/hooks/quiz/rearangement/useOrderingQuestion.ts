
import { useState, useEffect, useMemo } from "react";
import { Answer } from "@/types/quiz";

interface OrderingAnswer {
  id: string;
  text: string;
  position?: number;
  is_correct?: boolean | number;
  isCorrect?: boolean | number;
}

interface Question {
  id: number | string;
  type: string;
  reponses: OrderingAnswer[];
}

interface UseOrderingQuestionParams {
  question: Question;
  showFeedback?: boolean;
  onAnswer: (answerIds: string[]) => void;
}

export const useOrderingQuestion = ({
  question,
  showFeedback = false,
  onAnswer,
}: UseOrderingQuestionParams) => {
  const correctAnswers = useMemo(
    () =>
      [...question.reponses]
        .filter((r) => r.is_correct === true || r.is_correct === 1 || r.isCorrect === true)
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
    [question.reponses]
  );

  const [orderedAnswers, setOrderedAnswers] = useState<OrderingAnswer[]>([]);

  useEffect(() => {
    if (showFeedback) {
      // Show in the submitted order for feedback
      setOrderedAnswers((prev) =>
        prev.length ? prev : correctAnswers.map((a) => ({ ...a }))
      );
    } else {
      // Shuffle at the beginning for interaction
      const shuffled = [...correctAnswers].sort(() => Math.random() - 0.5);
      setOrderedAnswers(shuffled);
    }
  }, [correctAnswers, showFeedback]);

  useEffect(() => {
    if (!showFeedback) {
      // Send answer IDs instead of text to match expected format
      onAnswer(orderedAnswers.map((a) => a.id));
    }
  }, [orderedAnswers, onAnswer, showFeedback]);

  const isCorrectPosition = (answer: OrderingAnswer, index: number) => {
    if (!showFeedback) return undefined;
    return correctAnswers[index]?.id === answer.id;
  };

  const droppableId = `droppable-${question.id}`;

  return {
    orderedAnswers,
    setOrderedAnswers,
    isCorrectPosition,
    droppableId,
  };
};
