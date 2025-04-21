import React, { useState, useEffect } from 'react';
import { Question, Response } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle } from 'lucide-react';
import { questionService } from '@/services/api';
import QuestionRenderer from '@/components/questions/QuestionRenderer';

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
  const [answers, setAnswers] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);

  const progress = ((currentQuestion - 1) / totalQuestions) * 100;

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        setLoading(true);
        const fetchedAnswers = await questionService.getQuestionResponses(question.id);
        setAnswers(fetchedAnswers as Response[]);
      } catch (error) {
        console.error('Erreur lors de la récupération des réponses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [question.id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!selectedAnswer) {
            handleSelectAnswer(answers.find(a => !a.is_correct)?.id || '');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [question.id, selectedAnswer, answers]);

  useEffect(() => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setTimeLeft(timeLimit);
  }, [question.id, timeLimit]);

  const handleSelectAnswer = (answerId: string) => {
    if (selectedAnswer || showFeedback) return;
    
    const isCorrect = answers.find(a => a.id === answerId)?.is_correct || false;
    setSelectedAnswer(answerId);
    setShowFeedback(true);
    
    setTimeout(() => {
      onAnswer(answerId, isCorrect);
    }, 1500);
  };

  const handleQuestionAnswer = (questionId: string, answerId: string) => {
    handleSelectAnswer(answerId);
  };

  if (loading) {
    return <div className="text-center">Chargement des réponses...</div>;
  }

  return (
    <div className="max-w-xl mx-auto px-4 w-full h-full flex flex-col">
      <div className="mb-6">
        <div className="flex justify-between items-center text-sm text-gray-500 mb-1 font-roboto">
          <span>
            Question {currentQuestion} sur {totalQuestions}
          </span>
          <span>{timeLeft} secondes</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <QuestionRenderer
        question={question}
        selectedAnswer={selectedAnswer || ''}
        onAnswerSelect={handleQuestionAnswer}
      />

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
