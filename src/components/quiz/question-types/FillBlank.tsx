import { Card } from "@/components/ui/card";
import type { Question } from "@/types/quiz";
import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";

interface FillBlankProps {
  question: Question;
  onAnswer: (value: Record<string, string>) => void;
}

export function FillBlank({ question, onAnswer }: FillBlankProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleInputChange = (blankId: string, value: string) => {
    const newAnswers = { ...answers, [blankId]: value };
    setAnswers(newAnswers);
    onAnswer(newAnswers);
  };

  const checkAnswers = () => {
    const isAllCorrect = question.blanks?.every(blank => {
      const userAnswer = answers[blank.id]?.toLowerCase().trim();
      const correctAnswer = blank.text.toLowerCase().trim();
      return userAnswer === correctAnswer;
    }) || false;

    setIsCorrect(isAllCorrect);
    setShowFeedback(true);
  };

  return (
    <div className="space-y-6">
      <div className="text-lg font-medium leading-relaxed">
        {question.text}
      </div>

      <div className="space-y-4">
        {question.blanks?.map((blank) => {
          const userAnswer = answers[blank.id] || '';
          const isAnswerCorrect = showFeedback && 
            userAnswer.toLowerCase().trim() === blank.text.toLowerCase().trim();

          return (
            <div key={blank.id} className="flex items-center gap-4">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => handleInputChange(blank.id, e.target.value)}
                className={`
                  flex-1 px-4 py-2 border rounded-lg
                  transition-all duration-300
                  focus:ring-2 focus:ring-primary focus:border-transparent
                  ${showFeedback && isAnswerCorrect ? 'bg-green-50 border-green-500' : ''}
                  ${showFeedback && !isAnswerCorrect ? 'bg-red-50 border-red-500' : ''}
                `}
                placeholder={`Réponse ${blank.position}`}
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
