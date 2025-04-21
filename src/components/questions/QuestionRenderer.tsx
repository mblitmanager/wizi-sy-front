import React from 'react';
import { Question } from '@/types/quiz';
import MultipleChoice from './MultipleChoice';
import TrueFalse from './TrueFalse';
import FillBlank from './FillBlank';
import Matching from './Matching';
import Ordering from './Ordering';
import WordBank from './WordBank';
import Flashcard from './Flashcard';
import AudioQuestion from './AudioQuestion';
import Classification from './Classification';
import BaseQuestion from './BaseQuestion';

interface QuestionRendererProps {
  question: Question;
  onAnswerSelect: (questionId: string, answerId: string) => void;
  isAnswerChecked?: boolean;
  selectedAnswer?: string | string[] | boolean | null;
  showHint?: boolean;
  timeRemaining?: number;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  onAnswerSelect,
  isAnswerChecked = false,
  selectedAnswer,
  showHint,
  timeRemaining
}) => {
  const renderQuestion = () => {
    switch (question.type) {
      case 'multiple_choice':
        return (
          <MultipleChoice
            question={question}
            onAnswerSelect={onAnswerSelect}
            isAnswerChecked={isAnswerChecked}
            selectedAnswer={selectedAnswer as string | null}
          />
        );
      case 'true_false':
        return (
          <TrueFalse
            question={question}
            onAnswerSelect={onAnswerSelect}
            isAnswerChecked={isAnswerChecked}
            selectedAnswer={selectedAnswer as string | null}
          />
        );
      case 'fill_blank':
        return (
          <FillBlank
            question={question}
            onAnswerSelect={onAnswerSelect}
            isAnswerChecked={isAnswerChecked}
            selectedAnswer={selectedAnswer as string | null}
          />
        );
      case 'matching':
        return (
          <Matching
            question={question}
            onAnswerSelect={onAnswerSelect}
            isAnswerChecked={isAnswerChecked}
            selectedAnswer={selectedAnswer as string[] | null}
          />
        );
      case 'ordering':
        return (
          <Ordering
            question={question}
            onAnswerSelect={onAnswerSelect}
            isAnswerChecked={isAnswerChecked}
            selectedAnswer={selectedAnswer as string[] | null}
          />
        );
      case 'flashcard':
        return (
          <Flashcard
            question={question}
            onAnswerSelect={onAnswerSelect}
            isAnswerChecked={isAnswerChecked}
            selectedAnswer={selectedAnswer as boolean | null}
          />
        );
      case 'audio':
        return (
          <AudioQuestion
            question={question}
            onAnswerSelect={onAnswerSelect}
            isAnswerChecked={isAnswerChecked}
            selectedAnswer={selectedAnswer as string | null}
          />
        );
      case 'classification':
        return (
          <Classification
            question={question}
            onAnswerSelect={onAnswerSelect}
            isAnswerChecked={isAnswerChecked}
            selectedAnswer={selectedAnswer ? (selectedAnswer as unknown as { [key: string]: string[] }) : null}
          />
        );
      default:
        return <div>Type de question non supporté</div>;
    }
  };

  return (
    <div className="space-y-4">
      {renderQuestion()}
    </div>
  );
};

export default QuestionRenderer;
