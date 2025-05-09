
import { useState, useEffect, useMemo } from "react";

interface OrderingAnswer {
  id: string;
  text: string;
  position?: number;
  is_correct?: boolean | number;
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
        .filter((r) => r.is_correct === true || r.is_correct === 1)
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
    [question.reponses]
  );

  const [orderedAnswers, setOrderedAnswers] = useState<OrderingAnswer[]>([]);

  useEffect(() => {
    if (showFeedback) {
      // Affiche dans l'ordre soumis pour feedback
      setOrderedAnswers((prev) =>
        prev.length ? prev : correctAnswers.map((a) => ({ ...a }))
      );
    } else {
      // Mélange au départ pour interaction
      const shuffled = [...correctAnswers].sort(() => Math.random() - 0.5);
      setOrderedAnswers(shuffled);
    }
  }, [correctAnswers, showFeedback]);

  useEffect(() => {
    if (!showFeedback) {
      onAnswer(orderedAnswers.map((a) => a.text));
    }
  }, [orderedAnswers]);

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
