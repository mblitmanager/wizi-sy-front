
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
  currentAnswer?: string | string[] | Record<string, string>;
  showFeedback?: boolean;
}

export function QuestionDisplay({ question, onAnswer, currentAnswer, showFeedback = false }: QuestionDisplayProps) {
  const questionType = question.type ? question.type.toLowerCase() : '';
  
  // Normaliser le type de question
  const normalizedType = 
    questionType.includes('multiple') || questionType.includes('choix') ? 'choix multiples' :
    questionType.includes('true') || questionType.includes('false') || questionType.includes('vrai') || questionType.includes('faux') ? 'vrai/faux' :
    questionType.includes('fill') || questionType.includes('blank') || questionType.includes('remplir') ? 'remplir le champ vide' :
    questionType.includes('order') || questionType.includes('rearrange') || questionType === 'ordering' ? 'rearrangement' :
    questionType.includes('match') || questionType === 'matching' ? 'correspondance' :
    questionType.includes('flash') ? 'carte flash' :
    questionType.includes('word') || questionType.includes('bank') ? 'banque de mots' :
    questionType.includes('audio') ? 'question audio' :
    question.type;
  
  // Préparer les props communs pour tous les composants de question
  const commonProps = {
    question,
    onAnswer,
    showFeedback
  };

  switch (normalizedType) {
    case 'choix multiples':
      return <MultipleChoice {...commonProps} />;
    case 'vrai/faux':
      return <TrueFalse {...commonProps} />;
    case 'rearrangement':
      return <Ordering {...commonProps} />;
    case 'remplir le champ vide':
      return <FillBlank {...commonProps} />;
    case 'banque de mots':
      return <WordBank {...commonProps} />;
    case 'carte flash':
      return <Flashcard {...commonProps} />;
    case 'correspondance':
      return <Matching {...commonProps} />;
    case 'question audio':
      return <AudioQuestion {...commonProps} />;
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
