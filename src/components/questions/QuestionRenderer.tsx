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
  selectedAnswer: string;
  onAnswerSelect: (questionId: string, answerId: string) => void;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect
}) => {
  switch (question.type) {
    case 'choix multiples':
      return (
        <MultipleChoice
          question={question}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={onAnswerSelect}
        />
      );
    case 'vrai faux':
      return (
        <TrueFalse
          question={question}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={onAnswerSelect}
        />
      );
    case 'remplir le champ vide':
      return (
        <FillBlank
          question={question}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={onAnswerSelect}
        />
      );
    case 'correspondance':
      return (
        <Matching
          question={question}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={onAnswerSelect}
        />
      );
    case 'commander':
      return (
        <Ordering
          question={question}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={onAnswerSelect}
        />
      );
    case 'banque de mots':
      return (
        <WordBank
          question={question}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={onAnswerSelect}
        />
      );
    case 'carte flash':
      return (
        <Flashcard
          question={question}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={onAnswerSelect}
        />
      );
    case 'question audio':
      return (
        <AudioQuestion
          question={question}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={onAnswerSelect}
        />
      );
    default:
      return <div>Type de question non pris en charge: {question.type}</div>;
  }
};

export default QuestionRenderer;
