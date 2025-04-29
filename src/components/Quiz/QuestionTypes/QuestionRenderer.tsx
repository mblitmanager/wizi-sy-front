import React from 'react';
import { Question } from '@/types';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import TrueFalseQuestion from './TrueFalseQuestion';
import RearrangementQuestion from './RearrangementQuestion';
import FillInTheBlankQuestion from './FillInTheBlankQuestion';
import WordBankQuestion from './WordBankQuestion';
import FlashcardQuestion from './FlashcardQuestion';
import MatchingQuestion from './MatchingQuestion';
import AudioQuestion from './AudioQuestion';

interface QuestionRendererProps {
  question: Question;
  isAnswerSubmitted: boolean;
  onAnswer: (answerId: string, isCorrect: boolean) => void;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  isAnswerSubmitted,
  onAnswer,
}) => {
  const renderQuestion = () => {
    switch (question.type) {
      case 'choix multiples':
        return (
          <MultipleChoiceQuestion
            question={question}
            isAnswerSubmitted={isAnswerSubmitted}
            onAnswer={onAnswer}
          />
        );
      case 'vrai/faux':
        return (
          <TrueFalseQuestion
            question={question}
            isAnswerSubmitted={isAnswerSubmitted}
            onAnswer={onAnswer}
          />
        );
      case 'rearrangement':
        return (
          <RearrangementQuestion
            question={question}
            isAnswerSubmitted={isAnswerSubmitted}
            onAnswer={onAnswer}
          />
        );
      case 'remplir le champ vide':
        return (
          <FillInTheBlankQuestion
            question={question}
            isAnswerSubmitted={isAnswerSubmitted}
            onAnswer={onAnswer}
          />
        );
      case 'banque de mots':
        return (
          <WordBankQuestion
            question={question}
            isAnswerSubmitted={isAnswerSubmitted}
            onAnswer={onAnswer}
          />
        );
      case 'carte flash':
        return (
          <FlashcardQuestion
            question={question}
            isAnswerSubmitted={isAnswerSubmitted}
            onAnswer={onAnswer}
          />
        );
      case 'correspondance':
        return (
          <MatchingQuestion
            question={question}
            isAnswerSubmitted={isAnswerSubmitted}
            onAnswer={onAnswer}
          />
        );
      case 'question audio':
        return (
          <AudioQuestion
            question={question}
            isAnswerSubmitted={isAnswerSubmitted}
            onAnswer={onAnswer}
          />
        );
      default:
        return (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">Type de question non supporté : {question.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="prose max-w-none">
        <h2 className="text-xl font-semibold">{question.text}</h2>
      </div>
      {renderQuestion()}
    </div>
  );
};

export default QuestionRenderer; 