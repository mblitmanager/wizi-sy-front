import React, { useState, useEffect } from 'react';
import { Question, QuestionType } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface QuizQuestionProps {
  question: Question;
  totalQuestions: number;
  currentQuestion: number;
  onAnswer: (answerId: string, isCorrect: boolean) => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  totalQuestions,
  currentQuestion,
  onAnswer,
}): JSX.Element => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [rearrangedAnswers, setRearrangedAnswers] = useState<string[]>([]);
  const [filledBlanks, setFilledBlanks] = useState<Record<string, string>>({});
  const [selectedWords, setSelectedWords] = useState<Record<string, string>>({});
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [showFlashcardAnswer, setShowFlashcardAnswer] = useState(false);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  useEffect(() => {
    // Réinitialiser l'état quand la question change
    setSelectedAnswer(null);
    setRearrangedAnswers([]);
    setFilledBlanks({});
    setSelectedWords({});
    setMatchedPairs({});
    setShowFlashcardAnswer(false);
    setIsAnswerSubmitted(false);
  }, [question]);

  const handleAnswerClick = (answerId: string, isCorrect: boolean) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(answerId);
    setIsAnswerSubmitted(true);
    onAnswer(answerId, isCorrect);
  };

  const moveAnswer = (index: number, direction: 'up' | 'down') => {
    if (!question.reponses || isAnswerSubmitted) return;
    
    const newAnswers = [...rearrangedAnswers];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= newAnswers.length) return;
    
    [newAnswers[index], newAnswers[newIndex]] = [newAnswers[newIndex], newAnswers[index]];
    setRearrangedAnswers(newAnswers);
  };

  const handleBlankChange = (blankId: string, value: string) => {
    if (isAnswerSubmitted) return;
    setFilledBlanks(prev => ({
      ...prev,
      [blankId]: value
    }));
  };

  const handleWordSelect = (wordId: string, group: string) => {
    if (isAnswerSubmitted) return;
    setSelectedWords(prev => ({
      ...prev,
      [group]: wordId
    }));
  };

  const handleMatchSelect = (itemId: string, pairId: string) => {
    if (isAnswerSubmitted) return;
    setMatchedPairs(prev => ({
      ...prev,
      [itemId]: pairId
    }));
  };

  const submitAnswer = () => {
    if (isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    let isCorrectOrder = false;
    switch (question.type) {
      case 'remplir le champ vide':
        question.blanks?.forEach(blank => {
          const isCorrect = filledBlanks[blank.id] === blank.text;
          onAnswer(blank.id, isCorrect);
        });
        break;
      case 'banque de mots':
        Object.entries(selectedWords).forEach(([group, wordId]) => {
          const isCorrect = question.wordbank?.find(w => w.id === wordId)?.isCorrect ?? false;
          onAnswer(wordId, isCorrect);
        });
        break;
      case 'correspondance':
        Object.entries(matchedPairs).forEach(([itemId, pairId]) => {
          const isCorrect = question.matching?.find(m => m.id === itemId)?.matchPair === pairId;
          onAnswer(itemId, isCorrect);
        });
        break;
      case 'rearrangement':
        isCorrectOrder = rearrangedAnswers.every((answerId, index) => {
          return question.reponses?.[index]?.id === answerId;
        });
        onAnswer('rearrangement', isCorrectOrder);
        break;
    }
  };

  const renderMultipleChoice = (): JSX.Element => (
    <div className="space-y-2">
      {question.reponses?.map((reponse) => (
        <Button
          key={reponse.id}
          variant={selectedAnswer === reponse.id ? 'default' : 'outline'}
          className="w-full mb-2"
          onClick={() => handleAnswerClick(reponse.id, reponse.isCorrect)}
          disabled={isAnswerSubmitted}
        >
          {reponse.text}
        </Button>
      ))}
    </div>
  );

  const renderTrueFalse = (): JSX.Element => (
    <div className="space-y-2">
      <Button
        variant={selectedAnswer === 'true' ? 'default' : 'outline'}
        className="w-full mb-2"
        onClick={() => handleAnswerClick('true', question.reponses?.[0]?.isCorrect ?? false)}
        disabled={isAnswerSubmitted}
      >
        Vrai
      </Button>
      <Button
        variant={selectedAnswer === 'false' ? 'default' : 'outline'}
        className="w-full mb-2"
        onClick={() => handleAnswerClick('false', question.reponses?.[1]?.isCorrect ?? false)}
        disabled={isAnswerSubmitted}
      >
        Faux
      </Button>
    </div>
  );

  const renderRearrangement = (): JSX.Element => (
    <div className="space-y-2">
      {question.reponses?.map((reponse, index) => (
        <div key={reponse.id} className="flex items-center space-x-2">
          <div className="flex-1 p-2 border rounded">
            {reponse.text}
          </div>
          <div className="flex flex-col">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => moveAnswer(index, 'up')}
              disabled={index === 0 || isAnswerSubmitted}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => moveAnswer(index, 'down')}
              disabled={index === question.reponses!.length - 1 || isAnswerSubmitted}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      <Button
        className="w-full mt-4"
        onClick={submitAnswer}
        disabled={isAnswerSubmitted}
      >
        Valider l'ordre
      </Button>
    </div>
  );

  const renderFillBlank = (): JSX.Element => (
    <div className="space-y-4">
      {question.blanks?.map((blank) => (
        <div key={blank.id} className="space-y-2">
          <label className="text-sm font-medium">{blank.bankGroup}</label>
          <Input
            value={filledBlanks[blank.id] || ''}
            onChange={(e) => handleBlankChange(blank.id, e.target.value)}
            placeholder="Entrez votre réponse"
            disabled={isAnswerSubmitted}
          />
        </div>
      ))}
      <Button
        className="w-full mt-4"
        onClick={submitAnswer}
        disabled={isAnswerSubmitted}
      >
        Valider les réponses
      </Button>
    </div>
  );

  const renderWordBank = (): JSX.Element => (
    <div className="space-y-4">
      {question.wordbank?.map((word) => (
        <Button
          key={word.id}
          variant={selectedWords[word.bankGroup || ''] === word.id ? 'default' : 'outline'}
          className="w-full mb-2"
          onClick={() => handleWordSelect(word.id, word.bankGroup || '')}
          disabled={isAnswerSubmitted}
        >
          {word.text}
        </Button>
      ))}
      <Button
        className="w-full mt-4"
        onClick={submitAnswer}
        disabled={isAnswerSubmitted}
      >
        Valider les sélections
      </Button>
    </div>
  );

  const renderFlashcard = (): JSX.Element => (
    <div className="space-y-4">
      <div className="p-4 border rounded min-h-[200px] flex items-center justify-center">
        {showFlashcardAnswer ? question.flashcard?.back : question.flashcard?.front}
      </div>
      <Button
        variant="outline"
        className="w-full mb-2"
        onClick={() => {
          setShowFlashcardAnswer(!showFlashcardAnswer);
          if (!showFlashcardAnswer) {
            handleAnswerClick('flashcard', true);
          }
        }}
        disabled={isAnswerSubmitted}
      >
        {showFlashcardAnswer ? 'Masquer la réponse' : 'Voir la réponse'}
      </Button>
    </div>
  );

  const renderMatching = (): JSX.Element => (
    <div className="space-y-4">
      {question.matching?.map((match) => (
        <div key={match.id} className="flex items-center space-x-4">
          <span className="flex-1">{match.text}</span>
          <Select
            value={matchedPairs[match.id] || ''}
            onValueChange={(value) => handleMatchSelect(match.id, value)}
            disabled={isAnswerSubmitted}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              {question.matching?.map((pair) => (
                <SelectItem key={pair.id} value={pair.id}>
                  {pair.matchPair}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
      <Button
        className="w-full mt-4"
        onClick={submitAnswer}
        disabled={isAnswerSubmitted}
      >
        Valider les correspondances
      </Button>
    </div>
  );

  const renderAudioQuestion = (): JSX.Element => (
    <div className="space-y-4">
      <audio src={question.audioUrl} controls className="w-full mb-4" />
      {question.reponses?.map((reponse) => (
        <Button
          key={reponse.id}
          variant={selectedAnswer === reponse.id ? 'default' : 'outline'}
          className="w-full mb-2"
          onClick={() => handleAnswerClick(reponse.id, reponse.isCorrect)}
          disabled={isAnswerSubmitted}
        >
          {reponse.text}
        </Button>
      ))}
    </div>
  );

  const renderAnswers = (): JSX.Element | null => {
    switch (question.type) {
      case 'choix multiples':
        return renderMultipleChoice();
      case 'vrai/faux':
        return renderTrueFalse();
      case 'rearrangement':
        return renderRearrangement();
      case 'remplir le champ vide':
        return renderFillBlank();
      case 'banque de mots':
        return renderWordBank();
      case 'carte flash':
        return renderFlashcard();
      case 'correspondance':
        return renderMatching();
      case 'question audio':
        return renderAudioQuestion();
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4">
          <Progress value={(currentQuestion / totalQuestions) * 100} className="mb-4" />
          <p className="text-sm text-gray-500">
            Question {currentQuestion} sur {totalQuestions}
          </p>
        </div>

        <h2 className="text-xl font-semibold mb-4">{question.text}</h2>

        <div className="space-y-2">
          {renderAnswers()}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizQuestion;
