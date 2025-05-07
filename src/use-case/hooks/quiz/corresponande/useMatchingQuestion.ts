import { useState, useEffect, useMemo } from "react";
import { Question } from "@/types/quiz";

interface MatchingOption {
  id: string;
  text: string;
}

interface UseMatchingQuestionParams {
  question: Question;
  onAnswer: (matches: Record<string, string>) => void;
  showFeedback?: boolean;
}

export const useMatchingQuestion = ({
  question,
  onAnswer,
  showFeedback = false,
}: UseMatchingQuestionParams) => {
  const [matches, setMatches] = useState<Record<string, string>>({});
  const availableOptions: MatchingOption[] = useMemo(() => {
    return (
      question.answers
        ?.filter((answer) => answer.bank_group === "right")
        .map((answer) => ({
          id: answer.id,
          text: answer.text,
        })) || []
    );
  }, [question.answers]);

  const leftItems = useMemo(() => {
    return (
      question.answers?.filter((answer) => answer.bank_group === "left") || []
    );
  }, [question.answers]);

  // Initialisation des correspondances depuis selectedAnswers
  useEffect(() => {
    if (
      question.selectedAnswers &&
      typeof question.selectedAnswers === "object" &&
      !Array.isArray(question.selectedAnswers)
    ) {
      const initialMatches: Record<string, string> = {};
      Object.entries(question.selectedAnswers).forEach(([key, value]) => {
        if (key !== "destination" && typeof value === "string") {
          initialMatches[key] = value;
        }
      });
      setMatches(initialMatches);
    }
  }, [question]);

  useEffect(() => {
    onAnswer(matches);
  }, [matches]);

  const updateMatch = (leftId: string, rightText: string) => {
    if (rightText === "_empty") {
      const updated = { ...matches };
      delete updated[leftId];
      setMatches(updated);
    } else {
      setMatches((prev) => ({
        ...prev,
        [leftId]: rightText,
      }));
    }
  };

  const isCorrectMatch = (leftId: string): boolean | undefined => {
    if (!showFeedback) return undefined;
    const leftItem = question.answers?.find((a) => a.id === leftId);
    return leftItem && matches[leftId] === leftItem.match_pair;
  };

  const getCorrectMatch = (leftId: string): string => {
    const leftItem = question.answers?.find((a) => a.id === leftId);
    return leftItem?.match_pair || "";
  };

  return {
    leftItems,
    availableOptions,
    matches,
    updateMatch,
    isCorrectMatch,
    getCorrectMatch,
  };
};
