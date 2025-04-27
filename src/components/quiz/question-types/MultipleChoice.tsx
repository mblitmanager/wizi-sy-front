import { Card } from "@/components/ui/card";
import type { Question } from "@/types/quiz";
import { CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

interface MultipleChoiceProps {
  question: Question;
  onAnswer: (value: string[]) => void;
  currentAnswer?: string | string[] | Record<string, string>;
}

export function MultipleChoice({ question, onAnswer, currentAnswer }: MultipleChoiceProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
  const [answerStatus, setAnswerStatus] = useState<Record<string, 'correct' | 'incorrect' | null>>({});

  useEffect(() => {
    const answers = question.answers?.map(a => a.text) || [];
    setShuffledAnswers(answers.sort(() => Math.random() - 0.5));
    setAnswerStatus({});
    
    // Si currentAnswer est fourni, l'utiliser comme réponses sélectionnées
    if (currentAnswer) {
      if (Array.isArray(currentAnswer)) {
        setSelectedAnswers(currentAnswer);
      } else if (typeof currentAnswer === 'string') {
        setSelectedAnswers([currentAnswer]);
      }
    }
  }, [question.answers, currentAnswer]);

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback) return;

    let newSelectedAnswers: string[];
    if (selectedAnswers.includes(answer)) {
      // Désélectionner la réponse
      newSelectedAnswers = selectedAnswers.filter(a => a !== answer);
    } else {
      // Ajouter la réponse
      newSelectedAnswers = [...selectedAnswers, answer];
    }

    setSelectedAnswers(newSelectedAnswers);
    onAnswer(newSelectedAnswers);

    const correctAnswers = question.answers?.filter(a => a.isCorrect)?.map(a => a.text) || [];
    const isAnswerCorrect = newSelectedAnswers.length === correctAnswers.length &&
      newSelectedAnswers.every(answer => correctAnswers.includes(answer)) &&
      correctAnswers.every(answer => newSelectedAnswers.includes(answer));

    const newStatus: Record<string, 'correct' | 'incorrect' | null> = {};
    question.answers?.forEach(a => {
      if (newSelectedAnswers.includes(a.text)) {
        newStatus[a.text] = correctAnswers.includes(a.text) ? 'correct' : 'incorrect';
      } else if (correctAnswers.includes(a.text)) {
        newStatus[a.text] = 'correct';
      }
    });
    setAnswerStatus(newStatus);

    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);

    if (isAnswerCorrect) {
      setPoints(prev => prev + 10);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-lg font-medium leading-relaxed">
          {question.text}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-yellow-500">
            <Sparkles className="h-5 w-5" />
            <span className="font-bold">{points}</span>
          </div>
          {streak > 0 && (
            <div className="text-green-500 font-bold">
              {streak}x streak!
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {shuffledAnswers.map((answer) => {
          const status = answerStatus[answer];
          const isSelected = selectedAnswers.includes(answer);

          return (
            <button
              key={answer}
              onClick={() => handleAnswerSelect(answer)}
              disabled={showFeedback}
              className={`
                w-full p-4 border rounded-lg text-left
                transition-all duration-300
                ${isSelected ? 'scale-105' : 'hover:scale-102'}
                ${status === 'correct' ? 'bg-green-50 border-green-500' : ''}
                ${status === 'incorrect' ? 'bg-red-50 border-red-500' : ''}
                ${!status && !showFeedback ? 'hover:bg-gray-50' : ''}
                ${showFeedback && !isSelected && !status ? 'opacity-50' : ''}
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${status === 'correct' ? 'bg-green-100 text-green-600' : ''}
                  ${status === 'incorrect' ? 'bg-red-100 text-red-600' : ''}
                  ${!status && isSelected ? 'bg-primary/10 text-primary' : ''}
                  ${!status && !isSelected ? 'bg-gray-100 text-gray-500' : ''}
                `}>
                  {status === 'correct' ? (
                    <CheckCircle2 className="h-5 w-5 animate-bounce-once" />
                  ) : status === 'incorrect' ? (
                    <XCircle className="h-5 w-5 animate-shake" />
                  ) : (
                    <span className="font-medium">
                      {String.fromCharCode(65 + shuffledAnswers.indexOf(answer))}
                    </span>
                  )}
                </div>
                <span className="flex-1">{answer}</span>
              </div>
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div className="text-center text-sm text-muted-foreground">
          {isCorrect ? (
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span>Bonne réponse ! +10 points</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              <span>Essayez encore !</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
