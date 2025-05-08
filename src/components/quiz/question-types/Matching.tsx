import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, ArrowRight } from "lucide-react";
import { Question } from "@/types/quiz";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMatchingQuestion } from "@/use-case/hooks/quiz/corresponande/useMatchingQuestion";

interface MatchingProps {
  question: Question;
  onAnswer: (answer: Record<string, string>) => void;
  showFeedback?: boolean;
}

export const Matching: React.FC<MatchingProps> = ({
  question,
  onAnswer,
  showFeedback = false,
}) => {
  const {
    leftItems,
    availableOptions,
    matches,
    updateMatch,
    isCorrectMatch,
    getCorrectMatch,
  } = useMatchingQuestion({ question, onAnswer, showFeedback });

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="pt-4 px-2 md:px-6">
        <div className="space-y-4">
          {leftItems.map((leftItem) => {
            const isCorrect = isCorrectMatch(leftItem.id);
            return (
              <div
                key={leftItem.id}
                className={cn(
                  "p-4 border rounded-lg flex flex-col md:flex-row md:items-center gap-2",
                  showFeedback && isCorrect === true
                    ? "bg-green-50 border-green-200"
                    : "",
                  showFeedback && isCorrect === false
                    ? "bg-red-50 border-red-200"
                    : ""
                )}>
                <div className="font-medium flex-1">{leftItem.text}</div>

                <ArrowRight className="hidden md:block h-5 w-5 text-gray-400" />

                <div className="flex-1">
                  <Select
                    value={matches[leftItem.id] || "_empty"}
                    onValueChange={(value) => updateMatch(leftItem.id, value)}
                    disabled={showFeedback}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionnez une correspondance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_empty">Sélectionnez...</SelectItem>
                      {availableOptions.map((option) => (
                        <SelectItem key={option.id} value={option.text}>
                          {option.text}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {showFeedback && (
                  <div className="flex items-center">
                    {isCorrect ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <X className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {showFeedback && (
            <div className="mt-4 space-y-2">
              {leftItems.map((leftItem) => {
                const isCorrect = isCorrectMatch(leftItem.id);
                if (!isCorrect) {
                  return (
                    <p key={leftItem.id} className="text-red-600 text-sm">
                      La correspondance correcte pour{" "}
                      <span className="font-medium">{leftItem.text}</span> était
                      : {getCorrectMatch(leftItem.id)}
                    </p>
                  );
                }
                return null;
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
