import { useState, useEffect, useMemo } from "react";
import { Question } from "@/types/quiz";

interface MatchingOption {
  id: string;
  text: string;
  bank_group: string;
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

  // Extraction des éléments left et right basés sur match_pair
  const { leftItems, rightItems } = useMemo(() => {
    const left = question.answers?.filter((a) => a.match_pair === "left") || [];
    const right =
      question.answers?.filter((a) => a.match_pair === "right") || [];
    return { leftItems: left, rightItems: right };
  }, [question.answers]);

  // Options disponibles pour le select (right items)
  const availableOptions: MatchingOption[] = useMemo(() => {
    return rightItems.map((item) => ({
      id: item.id,
      text: item.text,
      bank_group: item.bank_group,
    }));
  }, [rightItems]);

  // Initialisation des correspondances
  useEffect(() => {
    if (
      question.selectedAnswers &&
      typeof question.selectedAnswers === "object"
    ) {
      const initialMatches: Record<string, string> = {};

      Object.entries(question.selectedAnswers).forEach(
        ([leftId, rightText]) => {
          if (typeof rightText === "string" && rightText !== "destination") {
            initialMatches[leftId] = rightText;
          }
        }
      );

      setMatches(initialMatches);
    }
  }, [question]);

  // Callback quand les matches changent
  useEffect(() => {
    onAnswer(matches);
  }, [matches, onAnswer]);

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

  // Vérifie si la correspondance est correcte
  const isCorrectMatch = (leftId: string): boolean | undefined => {
    if (!showFeedback) return undefined;

    const leftItem = leftItems.find((item) => item.id === leftId);
    if (!leftItem) return false;

    const selectedRightText = matches[leftId];
    if (!selectedRightText) return false;

    const rightItem = rightItems.find(
      (item) => item.text === selectedRightText
    );

    // La correspondance est correcte si les bank_group sont identiques
    return rightItem?.bank_group === leftItem.bank_group;
  };

  // Retourne la bonne correspondance pour le feedback
  const getCorrectMatch = (leftId: string): string => {
    const leftItem = leftItems.find((item) => item.id === leftId);
    if (!leftItem) return "";

    const correctRightItem = rightItems.find(
      (item) => item.bank_group === leftItem.bank_group
    );
    return correctRightItem?.text || "";
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
