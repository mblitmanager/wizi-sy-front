import React from 'react';
import { Question } from '../../types';
import MultipleChoice from './MultipleChoice';
import TrueFalse from './TrueFalse';
import FillBlank from './FillBlank';
import Matching from './Matching';
import Ordering from './Ordering';
import WordBank from './WordBank';
import Flashcard from './Flashcard';
import AudioQuestion from './AudioQuestion';

interface QuestionRendererProps {
  question: Question;
  onAnswer: (answer: any) => void;
  isAnswerChecked: boolean;
  selectedAnswer: any;
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
  const renderQuestion = () => {
    switch (question.type) {
      case 'multiple_choice':
        return (
          <MultipleChoice
            question={question}
            onAnswer={onAnswer}
            isAnswerChecked={isAnswerChecked}
            selectedAnswer={selectedAnswer}
            showHint={showHint}
            timeRemaining={timeRemaining}
          />
        );
      case 'true_false':
        return (
          <TrueFalse
            question={question}
            onAnswer={onAnswer}
            isAnswerChecked={isAnswerChecked}
            selectedAnswer={selectedAnswer}
            showHint={showHint}
            timeRemaining={timeRemaining}
          />
        );
      case 'fill_blank':
        return (
          <FillBlank
            question={question}
            onAnswer={onAnswer}
            isAnswerChecked={isAnswerChecked}
            selectedAnswer={selectedAnswer}
            showHint={showHint}
            timeRemaining={timeRemaining}
          />
        );
      case 'matching':
        return (
          <Matching
            question={question}
            onAnswer={onAnswer}
            isAnswerChecked={isAnswerChecked}
            selectedAnswer={selectedAnswer}
            showHint={showHint}
            timeRemaining={timeRemaining}
          />
        );
      case 'ordering':
        return (
          <Ordering
            question={question}
            onAnswer={onAnswer}
            isAnswerChecked={isAnswerChecked}
            selectedAnswer={selectedAnswer}
            showHint={showHint}
            timeRemaining={timeRemaining}
          />
        );
      case 'word_bank':
        return (
          <WordBank
            question={question}
            onAnswer={onAnswer}
            isAnswerChecked={isAnswerChecked}
            selectedAnswer={selectedAnswer}
            showHint={showHint}
            timeRemaining={timeRemaining}
          />
        );
      case 'flashcard':
        return (
          <Flashcard
            question={question}
            onAnswer={onAnswer}
            isAnswerChecked={isAnswerChecked}
            selectedAnswer={selectedAnswer}
            showHint={showHint}
            timeRemaining={timeRemaining}
          />
        );
      case 'audio':
        return (
          <AudioQuestion
            question={question}
            onAnswer={onAnswer}
            isAnswerChecked={isAnswerChecked}
            selectedAnswer={selectedAnswer}
            showHint={showHint}
            timeRemaining={timeRemaining}
          />
        );
      default:
        return <div>Type de question non supporté</div>;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {renderQuestion()}
    </div>
  );
};

export default QuestionRenderer; 