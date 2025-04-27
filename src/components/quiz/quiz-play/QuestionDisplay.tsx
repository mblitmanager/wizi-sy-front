import { Question } from "@/types/quiz";
import { MultipleChoice } from "../question-types/MultipleChoice";
import { Ordering } from "../question-types/Ordering";
import { FillBlank } from "../question-types/FillBlank";
import { WordBank } from "../question-types/WordBank";
import { Flashcard } from "../question-types/FlashCard";
import { Matching } from "../question-types/Matching";
import { AudioQuestion } from "../question-types/AudioQuestion";
import { TrueFalse } from "../question-types/TrueFalse";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface QuestionDisplayProps {
  question: Question;
  onAnswer: (value: string | string[] | Record<string, string>) => void;
}

export function QuestionDisplay({ question, onAnswer }: QuestionDisplayProps) {
  switch (question.type) {
    case 'choix multiples':
      return <MultipleChoice question={question} onAnswer={onAnswer} />;
    case 'vrai/faux':
      return <TrueFalse question={question} onAnswer={onAnswer} />;
    case 'rearrangement':
      return <Ordering question={question} onAnswer={onAnswer} />;
    case 'remplir le champ vide':
      return <FillBlank question={question} onAnswer={onAnswer} />;
    case 'banque de mots':
      return <WordBank question={question} onAnswer={onAnswer} />;
    case 'carte flash':
      return <Flashcard question={question} onAnswer={onAnswer} />;
    case 'correspondance':
      return <Matching question={question} onAnswer={onAnswer} />;
    case 'question audio':
      return <AudioQuestion question={question} onAnswer={onAnswer} />;
    default:
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Type de question non supporté</AlertTitle>
          <AlertDescription>
            Le type de question "{question.type}" n'est pas encore implémenté.
          </AlertDescription>
        </Alert>
      );
  }
}
