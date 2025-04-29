
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, X } from 'lucide-react';
import { Question as QuizQuestion } from '@/types/quiz';
import { cn } from "@/lib/utils";

interface FillBlankProps {
  question: QuizQuestion;
  onAnswer: (answers: Record<string, string>) => void;
  showFeedback?: boolean;
}

export const FillBlank: React.FC<FillBlankProps> = ({
  question,
  onAnswer,
  showFeedback = false,
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [questionParts, setQuestionParts] = useState<(string | { group: string })[]>([]);

  useEffect(() => {
    // Parse the question text to identify blanks
    const parts = parseQuestionText(question.text);
    setQuestionParts(parts);

    // Initialize answers object with empty strings
    const initialAnswers: Record<string, string> = {};
    
    // Add the blanks from the question
    if (question.blanks && question.blanks.length > 0) {
      question.blanks.forEach(blank => {
        if (blank.bankGroup) {
          initialAnswers[blank.bankGroup] = '';
        }
      });
    } else {
      // If no blanks are defined, create blank entries for each {} in the text
      parts.forEach(part => {
        if (typeof part !== 'string') {
          initialAnswers[part.group] = '';
        }
      });
    }
    
    setAnswers(initialAnswers);
  }, [question]);

  const parseQuestionText = (text: string): (string | { group: string })[] => {
    const parts: (string | { group: string })[] = [];
    const regex = /\{([^}]+)\}/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      parts.push({ group: match[1] });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  };

  const handleAnswerChange = (group: string, value: string) => {
    const newAnswers = { ...answers, [group]: value };
    setAnswers(newAnswers);
    onAnswer(newAnswers);
  };

  const getCorrectAnswer = (group: string) => {
    // Find the correct answer for this group
    const correctAnswer = question.answers?.find(a => 
      (a.bank_group === group || a.bank_group === null) && 
      (a.isCorrect || a.is_correct === 1)
    );
    return correctAnswer?.text || '';
  };

  const isCorrectAnswer = (group: string) => {
    if (!showFeedback) return undefined;
    
    const userAnswer = answers[group] || '';
    const correctAnswer = getCorrectAnswer(group);
    
    return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="pt-4 px-2 md:px-6">
        <div className="space-y-4">
          <div className="text-lg">
            {questionParts.map((part, index) => {
              if (typeof part === 'string') {
                return <span key={index}>{part}</span>;
              } else {
                const group = part.group;
                const isCorrect = isCorrectAnswer(group);
                
                return (
                  <span key={index} className="inline-flex items-center mx-1">
                    <div className="relative w-32 md:w-40">
                      <Input
                        value={answers[group] || ''}
                        onChange={(e) => handleAnswerChange(group, e.target.value)}
                        disabled={showFeedback}
                        className={cn(
                          "pr-8",
                          showFeedback && isCorrect ? "border-green-500 bg-green-50" : "",
                          showFeedback && isCorrect === false ? "border-red-500 bg-red-50" : ""
                        )}
                        placeholder={group}
                      />
                      {showFeedback && (
                        <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
                          {isCorrect ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <X className="h-4 w-4 text-red-600" />
                          )}
                        </span>
                      )}
                    </div>
                  </span>
                );
              }
            })}
          </div>

          {showFeedback && (
            <div className="mt-4 space-y-2">
              {Object.keys(answers).map((group) => {
                const isCorrect = isCorrectAnswer(group);
                if (!isCorrect) {
                  return (
                    <p key={group} className="text-red-600 text-sm">
                      La réponse correcte pour <span className="font-medium">{group}</span> était : {getCorrectAnswer(group)}
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
