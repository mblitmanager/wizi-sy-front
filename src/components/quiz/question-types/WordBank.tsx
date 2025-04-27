import { Card } from "@/components/ui/card";
import type { Question, WordBankItem } from "@/types/quiz";
import { CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

interface WordBankProps {
  question: Question;
  onAnswer: (value: Record<string, string>) => void;
  currentAnswer?: string | string[] | Record<string, string>;
}

export function WordBank({ question, onAnswer, currentAnswer }: WordBankProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [shuffledWords, setShuffledWords] = useState<WordBankItem[]>([]);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Initialiser les mots de la banque de mots
    if (question.wordbank && question.wordbank.length > 0) {
      setShuffledWords([...question.wordbank].sort(() => Math.random() - 0.5));
    }
  }, [question.wordbank]);

  useEffect(() => {
    // Si currentAnswer est fourni, l'utiliser comme réponses
    if (currentAnswer) {
      if (typeof currentAnswer === 'object' && !Array.isArray(currentAnswer)) {
        setAnswers(currentAnswer as Record<string, string>);
        setUsedWords(new Set(Object.values(currentAnswer as Record<string, string>)));
      }
    }
  }, [currentAnswer]);

  const handleWordSelect = (blankId: string, word: string) => {
    const newAnswers = { ...answers, [blankId]: word };
    setAnswers(newAnswers);
    onAnswer(newAnswers);
    setUsedWords(prev => new Set(prev).add(word));
    
    const element = document.getElementById(`blank-${blankId}`);
    if (element) {
      element.classList.add('animate-bounce-once');
      setTimeout(() => element.classList.remove('animate-bounce-once'), 1000);
    }
  };

  const checkAnswers = () => {
    const isAllCorrect = question.wordbank?.every(item => {
      const userAnswer = answers[item.bankGroup || '']?.toLowerCase().trim();
      const correctAnswer = item.text.toLowerCase().trim();
      return userAnswer === correctAnswer;
    }) || false;

    setIsCorrect(isAllCorrect);
    setShowFeedback(true);

    if (isAllCorrect) {
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
        {question.wordbank?.map((item) => {
          const userAnswer = answers[item.bankGroup || ''] || '';
          const isAnswerCorrect = showFeedback && 
            userAnswer.toLowerCase().trim() === item.text.toLowerCase().trim();

          return (
            <div 
              key={item.id} 
              id={`blank-${item.bankGroup}`}
              className="flex items-center gap-4"
            >
              <div className={`
                flex-1 px-4 py-2 border rounded-lg
                transition-all duration-300
                ${userAnswer ? 'bg-white shadow-sm' : 'bg-gray-50'}
                ${showFeedback && isAnswerCorrect ? 'bg-green-50 border-green-500' : ''}
                ${showFeedback && !isAnswerCorrect ? 'bg-red-50 border-red-500' : ''}
              `}>
                {userAnswer || '...'}
              </div>
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

      <div className="mt-6">
        <p className="text-sm font-medium text-muted-foreground mb-3">
          Mots disponibles :
        </p>
        <div className="flex flex-wrap gap-2">
          {shuffledWords.map((item) => (
            <button
              key={item.id}
              onClick={() => handleWordSelect(item.bankGroup || '', item.text)}
              disabled={usedWords.has(item.text) || showFeedback}
              className={`
                px-3 py-1 rounded-full text-sm transition-all duration-300
                ${usedWords.has(item.text) 
                  ? 'bg-primary/20 text-primary cursor-default' 
                  : 'bg-primary/10 hover:bg-primary/20 cursor-pointer hover:scale-105'
                }
                ${showFeedback ? 'opacity-50 cursor-default' : ''}
              `}
            >
              {item.text}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={checkAnswers}
          className={`
            px-4 py-2 bg-primary text-white rounded-lg
            transition-all duration-300
            hover:bg-primary/90 hover:scale-105
            ${Object.keys(answers).length === question.wordbank?.length ? '' : 'opacity-50 cursor-not-allowed'}
          `}
          disabled={Object.keys(answers).length !== question.wordbank?.length}
        >
          Vérifier les réponses
        </button>
      </div>

      {showFeedback && (
        <div className="text-center text-sm text-muted-foreground">
          {isCorrect ? (
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span>Toutes les réponses sont correctes ! +10 points</span>
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
