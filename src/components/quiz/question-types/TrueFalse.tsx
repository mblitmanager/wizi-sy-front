import { Question, Answer } from "@/services/QuizService";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CheckCircle2, XCircle, Sparkles } from "lucide-react";

interface TrueFalseProps {
  question: Question;
  onAnswer: (answer: string) => void;
}

export function TrueFalse({ question, onAnswer }: TrueFalseProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);

  const handleAnswer = (answer: string) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answer);
    const correctAnswer = question.answers?.find(a => a.isCorrect || a.reponse_correct)?.text.toLowerCase();
    const isAnswerCorrect = answer.toLowerCase() === correctAnswer;
    
    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);
    
    if (isAnswerCorrect) {
      setPoints(prev => prev + (question.points || 10));
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
      
      {question.media_url && (
        <div className="my-4">
          <img src={question.media_url} alt="Question" className="max-w-full rounded-lg" />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant={selectedAnswer === "true" ? "default" : "outline"}
          onClick={() => handleAnswer("true")}
          disabled={showFeedback}
          className={`
            h-24 text-lg font-medium
            transition-all duration-300
            ${selectedAnswer === "true" ? 'scale-105' : 'hover:scale-102'}
            ${showFeedback && isCorrect && selectedAnswer === "true" ? 'bg-green-500 hover:bg-green-600' : ''}
            ${showFeedback && !isCorrect && selectedAnswer === "true" ? 'bg-red-500 hover:bg-red-600' : ''}
          `}
        >
          Vrai
        </Button>
        <Button 
          variant={selectedAnswer === "false" ? "default" : "outline"}
          onClick={() => handleAnswer("false")}
          disabled={showFeedback}
          className={`
            h-24 text-lg font-medium
            transition-all duration-300
            ${selectedAnswer === "false" ? 'scale-105' : 'hover:scale-102'}
            ${showFeedback && isCorrect && selectedAnswer === "false" ? 'bg-green-500 hover:bg-green-600' : ''}
            ${showFeedback && !isCorrect && selectedAnswer === "false" ? 'bg-red-500 hover:bg-red-600' : ''}
          `}
        >
          Faux
        </Button>
      </div>

      {showFeedback && (
        <div className="text-center text-sm text-muted-foreground">
          {isCorrect ? (
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span>Bonne réponse ! +{question.points || 10} points</span>
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
