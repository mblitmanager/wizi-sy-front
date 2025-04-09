
import React, { useState, useEffect } from 'react';
import { Question } from '@/types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle } from 'lucide-react';

interface QuizQuestionProps {
  question: Question;
  totalQuestions: number;
  currentQuestion: number;
  onAnswer: (answerId: string, isCorrect: boolean) => void;
  timeLimit?: number;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  totalQuestions,
  currentQuestion,
  onAnswer,
  timeLimit = 30,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  const progress = ((currentQuestion - 1) / totalQuestions) * 100;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!selectedAnswer) {
            // Auto-select wrong answer if time runs out
            handleSelectAnswer(question.answers.find(a => !a.isCorrect)?.id || '');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [question.id, selectedAnswer]);

  useEffect(() => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setTimeLeft(timeLimit);
  }, [question.id, timeLimit]);

  const handleSelectAnswer = (answerId: string) => {
    if (selectedAnswer || showFeedback) return;
    
    const isCorrect = question.answers.find(a => a.id === answerId)?.isCorrect || false;
    setSelectedAnswer(answerId);
    setShowFeedback(true);
    
    // Delay to show feedback before moving to next question
    setTimeout(() => {
      onAnswer(answerId, isCorrect);
    }, 1500);
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center text-sm text-gray-500 mb-1 font-roboto">
          <span>
            Question {currentQuestion} sur {totalQuestions}
          </span>
          <span>{timeLeft} secondes</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {question.media && (
        <div className="mb-6 rounded-lg overflow-hidden">
          {question.media.type === 'image' && (
            <img src={question.media.url} alt="Question media" className="w-full h-auto" />
          )}
          {question.media.type === 'video' && (
            <video src={question.media.url} controls className="w-full h-auto"></video>
          )}
          {question.media.type === 'audio' && (
            <audio src={question.media.url} controls className="w-full"></audio>
          )}
        </div>
      )}

      <h3 className="text-xl font-medium text-gray-800 mb-6 font-montserrat">{question.text}</h3>

      <div className="space-y-3">
        {question.answers.map((answer) => {
          const isSelected = selectedAnswer === answer.id;
          let optionClass = "relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:bg-opacity-90 font-nunito";
          
          if (showFeedback) {
            if (answer.isCorrect) {
              optionClass += " bg-green-500 border-green-600 text-white";
            } else if (isSelected && !answer.isCorrect) {
              optionClass += " bg-red-500 border-red-600 text-white";
            }
          }
          
          return (
            <div
              key={answer.id}
              className={optionClass}
              onClick={() => handleSelectAnswer(answer.id)}
            >
              <div className="flex justify-between items-center">
                <span>{answer.text}</span>
                {showFeedback && (
                  <span>
                    {answer.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    ) : (
                      isSelected && <XCircle className="h-5 w-5 text-white" />
                    )}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showFeedback && (
        <div className="mt-4 text-center">
          <Button disabled className="font-nunito">
            Prochaine question...
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;
