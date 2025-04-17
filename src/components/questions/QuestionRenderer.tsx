import React from 'react';
import { Question, QuestionAnswer } from '@/types/quiz';
import MultipleChoice from './MultipleChoice';
import TrueFalse from './TrueFalse';
import FillBlank from './FillBlank';
import Matching from './Matching';
import Ordering from './Ordering';
import WordBank from './WordBank';
import Flashcard from './Flashcard';
import AudioQuestion from './AudioQuestion';
import Classification from './Classification';

interface QuestionRendererProps {
  question: Question;
  onAnswer: (answer: QuestionAnswer) => void;
  isAnswerChecked: boolean;
  selectedAnswer: QuestionAnswer | null;
  showHint?: boolean;
  timeRemaining?: number;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  onAnswer,
  isAnswerChecked,
  selectedAnswer,
  showHint,
  timeRemaining
}) => {
  switch (question.type) {
    case 'choix multiples':
      return (
        <MultipleChoice
          question={question}
          onAnswer={onAnswer}
          isAnswerChecked={isAnswerChecked}
          selectedAnswer={selectedAnswer as number | null}
          showHint={showHint}
          timeRemaining={timeRemaining}
        />
      );
    case 'vrai faux':
      return (
        <TrueFalse
          question={question}
          onAnswer={onAnswer}
          isAnswerChecked={isAnswerChecked}
          selectedAnswer={selectedAnswer as number | null}
          showHint={showHint}
          timeRemaining={timeRemaining}
        />
      );
    case 'remplir le champ vide':
      return (
        <FillBlank
          question={question}
          onAnswer={onAnswer}
          isAnswerChecked={isAnswerChecked}
          selectedAnswer={selectedAnswer as Record<string, string> | null}
          showHint={showHint}
          timeRemaining={timeRemaining}
        />
      );
    case 'correspondance':
      return (
        <Matching
          question={question}
          onAnswer={onAnswer}
          isAnswerChecked={isAnswerChecked}
          selectedAnswer={selectedAnswer as number[] | null}
          showHint={showHint}
          timeRemaining={timeRemaining}
        />
      );
    case 'commander':
      return (
        <Ordering
          question={question}
          onAnswer={onAnswer}
          isAnswerChecked={isAnswerChecked}
          selectedAnswer={selectedAnswer as number[] | null}
          showHint={showHint}
          timeRemaining={timeRemaining}
        />
      );
    case 'banque de mots':
      return (
        <WordBank
          question={question}
          onAnswer={onAnswer}
          isAnswerChecked={isAnswerChecked}
          selectedAnswer={selectedAnswer as Record<string, string[]> | null}
          showHint={showHint}
          timeRemaining={timeRemaining}
        />
      );
    case 'carte flash':
      return (
        <Flashcard
          question={question}
          onAnswer={onAnswer}
          isAnswerChecked={isAnswerChecked}
          selectedAnswer={selectedAnswer as boolean | null}
          showHint={showHint}
          timeRemaining={timeRemaining}
        />
      );
    case 'question audio':
      return (
        <AudioQuestion
          question={question}
          onAnswer={onAnswer}
          isAnswerChecked={isAnswerChecked}
          selectedAnswer={selectedAnswer as string | null}
          showHint={showHint}
          timeRemaining={timeRemaining}
        />
      );
    default:
      return <div>Type de question non pris en charge: {question.type}</div>;
  }
};

export default QuestionRenderer;
