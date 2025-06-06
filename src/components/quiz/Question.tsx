import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MultipleChoice } from "./question-types/MultipleChoice";
import { TrueFalse } from "./question-types/TrueFalse";
import { FillBlank } from "./question-types/FillBlank";
import { Ordering } from "./question-types/Ordering";
import { WordBank } from "./question-types/WordBank";
import { Matching } from "./question-types/Matching";
import { Flashcard } from "./question-types/FlashCard";
import { AudioQuestion } from "./question-types/AudioQuestion";
import { Question as QuizQuestion, QuestionType } from "@/types/quiz";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface Answer {
  id: string;
  text: string;
  isCorrect?: boolean;
  is_correct?: number | null;
  position?: number | null;
  match_pair?: string | null;
  bank_group?: string | null;
  flashcard_back?: string | null;
  question_id?: number;
}

interface QuestionProps {
  question: QuizQuestion;
  onAnswer: (answer: any) => void;
  showFeedback?: boolean;
}

export const Question: React.FC<QuestionProps> = ({
  question,
  onAnswer,
  showFeedback = false,
}) => {
  const renderQuestion = () => {
    switch (question.type) {
      case "choix multiples":
        return (
          <MultipleChoice
            question={question}
            onAnswer={onAnswer}
            showFeedback={showFeedback}
          />
        );
      case "vrai/faux":
        return (
          <TrueFalse
            question={question}
            onAnswer={onAnswer}
            showFeedback={showFeedback}
          />
        );
      case "remplir le champ vide":
        return (
          <FillBlank
            question={question}
            onAnswer={onAnswer}
            showFeedback={showFeedback}
          />
        );
      case "rearrangement":
        return (
          <Ordering
            question={question}
            onAnswer={onAnswer}
            showFeedback={showFeedback}
          />
        );
      case "banque de mots":
        return (
          <WordBank
            question={question}
            onAnswer={onAnswer}
            showFeedback={showFeedback}
          />
        );
      case "correspondance":
        return (
          <Matching
            question={question}
            onAnswer={onAnswer}
            showFeedback={showFeedback}
          />
        );
      case "carte flash":
        return (
          <Flashcard
            question={question}
            onAnswer={onAnswer}
            showFeedback={showFeedback}
          />
        );
      case "question audio":
        return (
          <AudioQuestion
            question={question}
            onAnswer={onAnswer}
            showFeedback={showFeedback}
          />
        );
      default:
        return (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Type de question non supporté</AlertTitle>
            <AlertDescription>
              Type de question non pris en charge: {question.type}
            </AlertDescription>
          </Alert>
        );
    }
  };

  return (
    <Card>
      <div className="px-2 md:px-6 pt-3">
        <div className="mb-3 md:mb-4 md:px-6 px-2">
          {question.type !== "remplir le champ vide" && (
            <h6 className="text-xs font-semibold mb-3 md:text-sm">
              {question.text}
            </h6>
          )}
        </div>

        {renderQuestion()}

        {showFeedback && question.explication && (
          <Alert className="mt-4 bg-blue-50">
            <div className="font-medium">
              <strong>Explication:</strong> {question.explication}
            </div>
          </Alert>
        )}
      </div>
    </Card>
  );
};
