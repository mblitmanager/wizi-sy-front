
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, ArrowRight } from 'lucide-react';
import { Question } from '@/types/quiz';
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MatchingProps {
  question: Question;
  onAnswer: (matches: Record<string, string>) => void;
  showFeedback?: boolean;
}

export const Matching: React.FC<MatchingProps> = ({
  question,
  onAnswer,
  showFeedback = false,
}) => {
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [availableOptions, setAvailableOptions] = useState<{id: string, text: string}[]>([]);

  // Initialize from existing answer if available
  useEffect(() => {
    // Extract all possible right-side options from the answers
    const rightOptions = question.answers
      ?.filter(answer => answer.match_pair && answer.match_pair.trim() !== '')
      .map(answer => ({
        id: answer.id,
        text: answer.match_pair || ''
      })) || [];
    
    setAvailableOptions(rightOptions);

    // Initialize with existing answers if available
    if (question.selectedAnswers && typeof question.selectedAnswers === 'object' && !Array.isArray(question.selectedAnswers)) {
      // Create a new object to store the matches
      const initialMatches: Record<string, string> = {};
      
      // Safely handle the type casting
      const selectedAnswers = question.selectedAnswers as Record<string, string>;
      
      // Copy the values, excluding the 'destination' property
      Object.keys(selectedAnswers).forEach(key => {
        if (key !== 'destination') {
          initialMatches[key] = selectedAnswers[key];
        }
      });
      
      setMatches(initialMatches);
    }
  }, [question]);

  const handleMatchChange = (leftId: string, rightValue: string) => {
    if (rightValue === "_empty") {
      // Handle clearing the selection
      const newMatches = { ...matches };
      delete newMatches[leftId];
      setMatches(newMatches);
      onAnswer(newMatches);
    } else {
      // Set the new match
      const newMatches = { ...matches, [leftId]: rightValue };
      setMatches(newMatches);
      onAnswer(newMatches);
    }
  };

  const isCorrectMatch = (leftId: string): boolean | undefined => {
    if (!showFeedback) return undefined;
    
    const leftItem = question.answers?.find(a => a.id === leftId);
    return leftItem && matches[leftId] === leftItem.match_pair;
  };

  const getCorrectMatch = (leftId: string): string => {
    const leftItem = question.answers?.find(a => a.id === leftId);
    return leftItem?.match_pair || '';
  };

  // Only include answers that have text and aren't flashcard backs
  const leftItems = question.answers?.filter(answer => 
    answer.text && 
    !answer.flashcard_back && 
    answer.match_pair !== undefined
  ) || [];

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
                  showFeedback && isCorrect === true ? "bg-green-50 border-green-200" : "",
                  showFeedback && isCorrect === false ? "bg-red-50 border-red-200" : ""
                )}
              >
                <div className="font-medium flex-1">
                  {leftItem.text}
                </div>
                
                <ArrowRight className="hidden md:block h-5 w-5 text-gray-400" />
                
                <div className="flex-1">
                  <Select
                    value={matches[leftItem.id] || "_empty"}
                    onValueChange={(value) => handleMatchChange(leftItem.id, value)}
                    disabled={showFeedback}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionnez une correspondance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_empty">Sélectionnez...</SelectItem>
                      {availableOptions.map(option => (
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
                      La correspondance correcte pour <span className="font-medium">{leftItem.text}</span> était : {getCorrectMatch(leftItem.id)}
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
