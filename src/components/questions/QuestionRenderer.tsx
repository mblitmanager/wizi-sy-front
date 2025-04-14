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

// Types pour les réponses des différents types de questions
type MultipleChoiceAnswer = number;
type TrueFalseAnswer = number;
type FillBlankAnswer = { [key: string]: string };
type MatchingAnswer = number[];
type OrderingAnswer = number[];
type WordBankAnswer = { [key: string]: string[] };
type FlashcardAnswer = boolean;
type AudioQuestionAnswer = string;

// Type union pour toutes les réponses possibles
type QuestionAnswer = 
  | MultipleChoiceAnswer
  | TrueFalseAnswer
  | FillBlankAnswer
  | MatchingAnswer
  | OrderingAnswer
  | WordBankAnswer
  | FlashcardAnswer
  | AudioQuestionAnswer;

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
  const renderQuestion = () => {
    switch (question.type) {
      case 'choix multiples':
        return (
          <MultipleChoice
            question={question}
            onAnswer={onAnswer as (answer: MultipleChoiceAnswer) => void}
            isAnswerChecked={isAnswerChecked}
            selectedAnswer={selectedAnswer as MultipleChoiceAnswer | null}
            showHint={showHint}
            timeRemaining={timeRemaining}
          />
        );
      case 'vrai faux':
        return (
          <TrueFalse
            question={question}
            onAnswer={onAnswer as (answer: TrueFalseAnswer) => void}
            isAnswerChecked={isAnswerChecked}
            selectedAnswer={selectedAnswer as TrueFalseAnswer | null}
            showHint={showHint}
            timeRemaining={timeRemaining}
          />
        );
      case 'remplir le champ vide':
        return (
          <FillBlank
            question={question}
            onAnswer={onAnswer as (answer: FillBlankAnswer) => void}
            isAnswerChecked={isAnswerChecked}
            selectedAnswer={selectedAnswer as FillBlankAnswer | null}
            showHint={showHint}
            timeRemaining={timeRemaining}
          />
        );
      case 'correspondance':
        return (
          <Matching
            question={question}
            onAnswer={onAnswer as (answer: MatchingAnswer) => void}
            isAnswerChecked={isAnswerChecked}
            selectedAnswer={selectedAnswer as MatchingAnswer | null}
            showHint={showHint}
            timeRemaining={timeRemaining}
          />
        );
      case 'commander':
        return (
          <Ordering
            question={question}
            onAnswer={onAnswer as (answer: OrderingAnswer) => void}
            isAnswerChecked={isAnswerChecked}
            selectedAnswer={selectedAnswer as OrderingAnswer | null}
            showHint={showHint}
            timeRemaining={timeRemaining}
          />
        );
      case 'banque de mots':
        return (
          <WordBank
            question={question}
            onAnswer={onAnswer as (answer: WordBankAnswer) => void}
            isAnswerChecked={isAnswerChecked}
            selectedAnswer={selectedAnswer as WordBankAnswer | null}
            showHint={showHint}
            timeRemaining={timeRemaining}
          />
        );
      case 'carte flash':
        return (
          <Flashcard
            question={question}
            onAnswer={onAnswer as (answer: FlashcardAnswer) => void}
            isAnswerChecked={isAnswerChecked}
            selectedAnswer={selectedAnswer as FlashcardAnswer | null}
            showHint={showHint}
            timeRemaining={timeRemaining}
          />
        );
      case 'question audio':
        return (
          <AudioQuestion
            question={question}
            onAnswer={onAnswer as (answer: AudioQuestionAnswer) => void}
            isAnswerChecked={isAnswerChecked}
            selectedAnswer={selectedAnswer as AudioQuestionAnswer | null}
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