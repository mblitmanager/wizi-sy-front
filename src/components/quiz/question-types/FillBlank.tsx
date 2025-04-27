import { Card } from "@/components/ui/card";
import type { Question } from "@/types/quiz";
import { CheckCircle2, XCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface Reponse {
  id: number;
  text: string;
  is_correct: boolean | null;
  position: number | null;
  match_pair: string | null;
  bank_group: string | null;
}

interface FillBlankProps {
  question: Question & {
    reponses?: Reponse[];
  };
  onAnswer: (value: Record<string, string>) => void;
  currentAnswer?: string | string[] | Record<string, string>;
}

export function FillBlank({ question, onAnswer, currentAnswer }: FillBlankProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    // Si currentAnswer est fourni, l'utiliser comme réponses
    if (currentAnswer) {
      if (typeof currentAnswer === 'object' && !Array.isArray(currentAnswer)) {
        setAnswers(currentAnswer as Record<string, string>);
      }
    }
  }, [currentAnswer]);

  const handleInputChange = (blankId: string, value: string) => {
    const newAnswers = { ...answers, [blankId]: value };
    setAnswers(newAnswers);
    onAnswer(newAnswers);
  };

  const checkAnswers = () => {
    if (!question.reponses) return;

    const isAllCorrect = question.reponses.every(reponse => {
      const userAnswer = answers[reponse.id.toString()]?.toLowerCase().trim();
      const correctAnswer = reponse.text.toLowerCase().trim();
      return userAnswer === correctAnswer;
    });

    setIsCorrect(isAllCorrect);
    setShowFeedback(true);
  };

  return (
    <div className="space-y-6">
      <div className="text-lg font-medium leading-relaxed">
        {question.text}
      </div>

      <div className="space-y-4">
        {question.reponses?.map((reponse) => {
          const userAnswer = answers[reponse.id.toString()] || '';
          const isAnswerCorrect = showFeedback && 
            userAnswer.toLowerCase().trim() === reponse.text.toLowerCase().trim();

          return (
            <div key={reponse.id} className="flex items-center gap-4">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => handleInputChange(reponse.id.toString(), e.target.value)}
                className={`
                  flex-1 px-4 py-2 border rounded-lg
                  transition-all duration-300
                  focus:ring-2 focus:ring-primary focus:border-transparent
                  ${showFeedback && isAnswerCorrect ? 'bg-green-50 border-green-500' : ''}
                  ${showFeedback && !isAnswerCorrect ? 'bg-red-50 border-red-500' : ''}
                `}
                placeholder={`Réponse ${reponse.position || ''}`}
                disabled={showFeedback}
              />
              {showFeedback && (
                <div className="w-8 h-8 flex items-center justify-center">
                  {isAnswerCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 animate-bounce-once" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 animate-shake" />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button
          onClick={checkAnswers}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Vérifier les réponses
        </button>
      </div>

      {showFeedback && (
        <div className="text-center text-sm text-muted-foreground">
          {isCorrect ? (
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span>Toutes les réponses sont correctes !</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              <span>Certaines réponses sont incorrectes. Essayez encore !</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
