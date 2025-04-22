import React, { useState } from 'react';
import { Question } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface QuizQuestionProps {
  question: Question;
  totalQuestions: number;
  currentQuestion: number;
  onAnswer: (answerId: string, isCorrect: boolean) => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  totalQuestions,
  currentQuestion,
  onAnswer,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleAnswerClick = (answerId: string, isCorrect: boolean) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answerId);
    onAnswer(answerId, isCorrect);
  };

  const renderAnswers = () => {
    switch (question.type) {
      case 'multiplechoice':
      case 'truefalse':
        return question.answers?.map((answer) => (
          <Button
            key={answer.id}
            variant={selectedAnswer === answer.id ? 'default' : 'outline'}
            className="w-full mb-2"
            onClick={() => handleAnswerClick(answer.id, answer.isCorrect)}
          >
            {answer.text}
          </Button>
        ));

      case 'ordering':
        return question.answers?.map((answer) => (
          <Button
            key={answer.id}
            variant={selectedAnswer === answer.id ? 'default' : 'outline'}
            className="w-full mb-2"
            onClick={() => handleAnswerClick(answer.id, true)}
          >
            {answer.text}
          </Button>
        ));

      case 'fillblank':
        return question.blanks?.map((blank) => (
          <div key={blank.id} className="mb-2">
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder={`Remplissez ${blank.bankGroup}`}
              onChange={(e) => handleAnswerClick(blank.id, e.target.value === blank.text)}
            />
          </div>
        ));

      case 'wordbank':
        return question.wordbank?.map((word) => (
          <Button
            key={word.id}
            variant={selectedAnswer === word.id ? 'default' : 'outline'}
            className="w-full mb-2"
            onClick={() => handleAnswerClick(word.id, word.isCorrect ?? true)}
          >
            {word.text}
          </Button>
        ));

      case 'flashcard':
        return (
          <Button
            variant="outline"
            className="w-full mb-2"
            onClick={() => handleAnswerClick('flashcard', true)}
          >
            Voir la réponse
          </Button>
        );

      case 'matching':
        return question.matching?.map((match) => (
          <Button
            key={match.id}
            variant={selectedAnswer === match.id ? 'default' : 'outline'}
            className="w-full mb-2"
            onClick={() => handleAnswerClick(match.id, true)}
          >
            {match.text} - {match.matchPair}
          </Button>
        ));

      case 'audioquestion':
        return (
          <>
            <audio src={question.audioUrl} controls className="mb-4" />
            {question.answers?.map((answer) => (
              <Button
                key={answer.id}
                variant={selectedAnswer === answer.id ? 'default' : 'outline'}
                className="w-full mb-2"
                onClick={() => handleAnswerClick(answer.id, answer.isCorrect)}
              >
                {answer.text}
              </Button>
            ))}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4">
          <Progress value={(currentQuestion / totalQuestions) * 100} className="mb-4" />
          <p className="text-sm text-gray-500">
            Question {currentQuestion} sur {totalQuestions}
          </p>
        </div>

        <h2 className="text-xl font-semibold mb-4">{question.text}</h2>

        <div className="space-y-2">
          {renderAnswers()}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizQuestion;
