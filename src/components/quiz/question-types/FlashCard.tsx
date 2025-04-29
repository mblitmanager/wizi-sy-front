import { Card } from "@/components/ui/card";
import { Question as QuizQuestion, Answer } from "@/types/quiz";
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
  const [shuffledAnswers, setShuffledAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    const answers = (question.reponses || []).slice().sort(() => Math.random() - 0.5);
    setShuffledAnswers(answers);
  }, [question.reponses]);

  const handleFlip = () => {
    if (!showFeedback) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleAnswer = (answerObj: Answer) => {
    setUserAnswer(answerObj.text);
    const isAnswerCorrect = answerObj.is_correct === 1 || answerObj.is_correct === true;
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      setPoints(prev => prev + 10);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    onAnswer(answerObj.text);
  };

  const correctAnswer = question.reponses?.find(r => r.is_correct === 1 || r.is_correct === true);

  return (
    <div className="space-y-6">
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .flip-card {
          position: relative;
          width: 100%;
          height: 16rem;
          transition: transform 0.5s;
          transform-style: preserve-3d;
        }
        .flip-card.flipped {
          transform: rotateY(180deg);
        }
        .flip-card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          top: 0;
          left: 0;
        }
        .flip-card-back {
          transform: rotateY(180deg);
        }
      `}</style>
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
        <div
          className={`flip-card${isFlipped ? ' flipped' : ''} ${showFeedback ? 'cursor-default' : 'cursor-pointer'}`}
          onClick={handleFlip}
        >
          <Card className="flip-card-face">
            <div className="h-full flex flex-col items-center justify-center p-6">
              <div className="text-2xl font-bold text-center">
                {question.text}
              </div>
              {!showFeedback && (
                <div className="mt-4 text-sm text-muted-foreground">
                  Cliquez pour retourner la carte
                </div>
              )}
            </div>
          </Card>
          <Card className="flip-card-face flip-card-back">
            <div className="h-full flex flex-col items-center justify-center p-6">
              <div className="text-2xl font-bold text-center">
                {correctAnswer?.flashcard_back}
              </div>
              {!showFeedback && (
                <div className="mt-4 text-sm text-muted-foreground">
                  Cliquez pour retourner la carte
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {!showFeedback && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-muted-foreground">
            Quelle est votre réponse ?
          </p>
          <div className="grid grid-cols-2 gap-4">
            {shuffledAnswers.map((answer) => (
              <button
                key={answer.text}
                onClick={() => handleAnswer(answer)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-all duration-300 hover:scale-105"
              >
                {answer.text}
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
            const answers = (question.reponses || []).slice().sort(() => Math.random() - 0.5);
            setShuffledAnswers(answers);
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
