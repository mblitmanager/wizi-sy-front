
import { useState, useEffect, useMemo } from "react";
import { Answer, Question } from "@/types/quiz";

interface OrderingAnswer {
  id: string;
  text: string;
  position?: number;
  is_correct?: boolean | number;
  isCorrect?: boolean | number;
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
  // Ensure we have the reponses property by merging answers and reponses
  const answers = useMemo(() => {
    const responseData = question.reponses || question.answers || [];
    
    // Ensure all answers have an id
    return responseData.map(answer => ({
      ...answer,
      id: answer.id || `answer-${Math.random().toString(36).substring(2, 11)}`
    }));
  }, [question.reponses, question.answers]);

  const correctAnswers = useMemo(
    () =>
      [...answers]
        .filter((r) => r.is_correct === true || r.is_correct === 1 || r.isCorrect === true)
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
    [answers]
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
    if (!showFeedback && orderedAnswers.length > 0) {
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
