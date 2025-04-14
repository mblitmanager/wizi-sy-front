
import React, { useState, useEffect } from 'react';
import { Question } from '@/types/quiz';
import { Answer as QuizAnswer } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle } from 'lucide-react';
import { quizAPI } from '@/api';
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
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [loading, setLoading] = useState(true);

  const progress = ((currentQuestion - 1) / totalQuestions) * 100;

  // Récupérer les réponses depuis l'API
  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        setLoading(true);
        const fetchedAnswers = await quizAPI.getReponsesByQuestion(question.id);
        setAnswers(fetchedAnswers);
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
            // Auto-select wrong answer if time runs out
            handleSelectAnswer(answers.find(a => a.is_correct === 0)?.id || '');
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
    
    const isCorrect = answers.find(a => a.id === answerId)?.is_correct === 1;
    setSelectedAnswer(answerId);
    setShowFeedback(true);
    
    // Delay to show feedback before moving to next question
    setTimeout(() => {
      onAnswer(answerId, isCorrect);
    }, 1500);
  };

  const handleQuestionAnswer = (answer: unknown) => {
    if (typeof answer === 'string') {
      handleSelectAnswer(answer);
    } else if (Array.isArray(answer) && answer.length > 0) {
      handleSelectAnswer(answer[0].toString());
    } else if (typeof answer === 'number') {
      handleSelectAnswer(answer.toString());
    } else if (typeof answer === 'boolean') {
      const correctAnswer = answers.find(a => a.is_correct === 1)?.id;
      if (correctAnswer) {
        handleSelectAnswer(correctAnswer);
      }
    } else if (answer && typeof answer === 'object') {
      const firstValue = Object.values(answer)[0];
      if (Array.isArray(firstValue) && firstValue.length > 0) {
        handleSelectAnswer(firstValue[0].toString());
      } else if (firstValue) {
        handleSelectAnswer(firstValue.toString());
      }
    }
  };

  if (loading) {
    return <div className="text-center">Chargement des réponses...</div>;
  }

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

      <QuestionRenderer
        question={question}
        onAnswer={handleQuestionAnswer}
        isAnswerChecked={showFeedback}
        selectedAnswer={selectedAnswer}
        timeRemaining={timeLeft}
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
