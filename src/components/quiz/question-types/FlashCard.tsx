import { Card } from "@/components/ui/card";
import { Question as QuizQuestion } from "@/types/quiz";
import { CheckCircle2, XCircle, RotateCw, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

interface FlashcardProps {
  question: QuizQuestion;
  onAnswer: (value: string) => void;
  showFeedback?: boolean;
}

export function Flashcard({ question, onAnswer, showFeedback = false }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);

  useEffect(() => {
    const answers = question.answers?.map(a => a.text) || [];
    setShuffledAnswers(answers.sort(() => Math.random() - 0.5));
  }, [question.answers]);

  const handleFlip = () => {
    if (!showFeedback) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleAnswer = (answer: string) => {
    setUserAnswer(answer);
    const isAnswerCorrect = answer.toLowerCase().trim() === 
      question.flashcard?.back.toLowerCase().trim();
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      setPoints(prev => prev + 10);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    onAnswer(answer);
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

      <div className="relative perspective-1000">
        <Card
          className={`
            w-full h-64 cursor-pointer transition-transform duration-500
            ${isFlipped ? 'rotate-y-180' : ''}
            hover:shadow-lg
            ${showFeedback ? 'cursor-default' : ''}
          `}
          onClick={handleFlip}
        >
          <div className="absolute inset-0 backface-hidden">
            <div className="h-full flex flex-col items-center justify-center p-6">
              <div className="text-2xl font-bold text-center">
                {question.flashcard?.front}
              </div>
              {!showFeedback && (
                <div className="mt-4 text-sm text-muted-foreground">
                  Cliquez pour retourner la carte
                </div>
              )}
            </div>
          </div>
          <div className="absolute inset-0 backface-hidden rotate-y-180">
            <div className="h-full flex flex-col items-center justify-center p-6">
              <div className="text-2xl font-bold text-center">
                {question.flashcard?.back}
              </div>
              {!showFeedback && (
                <div className="mt-4 text-sm text-muted-foreground">
                  Cliquez pour retourner la carte
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {!showFeedback && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-muted-foreground">
            Quelle est votre réponse ?
          </p>
          <div className="grid grid-cols-2 gap-4">
            {shuffledAnswers.map((answer) => (
              <button
                key={answer}
                onClick={() => handleAnswer(answer)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-all duration-300 hover:scale-105"
              >
                {answer}
              </button>
            ))}
          </div>
        </div>
      )}

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

      <div className="flex justify-center">
        <button
          onClick={() => {
            setIsFlipped(false);
            setIsCorrect(null);
            setUserAnswer('');
            const answers = question.answers?.map(a => a.text) || [];
            setShuffledAnswers(answers.sort(() => Math.random() - 0.5));
          }}
          className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <RotateCw className="h-4 w-4" />
          <span>Recommencer</span>
        </button>
      </div>
    </div>
  );
}
