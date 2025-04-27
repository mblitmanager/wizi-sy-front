import { Card } from "@/components/ui/card";
import type { Question } from "@/types/quiz";
import { CheckCircle2, XCircle, Sparkles, Link2, Link2Off, ArrowRight, GripVertical, Info, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MatchingItem {
  id: string;
  text: string;
  matchPair: string;
}

interface Reponse {
  id: number;
  text: string;
  is_correct: boolean | null;
  position: number | null;
  match_pair: string | null;
  bank_group: string | null;
}

interface MatchingProps {
  question: Question & {
    reponses?: Reponse[];
  };
  onAnswer: (value: Record<string, string>) => void;
}

export function Matching({ question, onAnswer }: MatchingProps) {
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [shuffledLeft, setShuffledLeft] = useState<MatchingItem[]>([]);
  const [shuffledRight, setShuffledRight] = useState<MatchingItem[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [showHint, setShowHint] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    if (!question.reponses) return;

    const uniquePairs = question.reponses.reduce((acc, reponse) => {
      if (reponse.text && reponse.match_pair) {
        acc.push({
          id: reponse.id.toString(),
          text: reponse.text,
          matchPair: reponse.match_pair
        });
      }
      return acc;
    }, [] as MatchingItem[]);

    const leftItems = [...uniquePairs];
    const rightItems = [...uniquePairs];
    
    setShuffledLeft(leftItems.sort(() => Math.random() - 0.5));
    setShuffledRight(rightItems.sort(() => Math.random() - 0.5));
    setMatches({});
    setMatchedPairs(new Set());
    setAttempts({});
    setLastError(null);
  }, [question.reponses]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceId = result.source.droppableId;
    const destId = result.destination.droppableId;
    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    if (sourceIndex < 0 || destIndex < 0 || 
        sourceIndex >= shuffledLeft.length || 
        destIndex >= shuffledRight.length) {
      return;
    }

    if (sourceId === destId) {
      // Réorganisation dans la même colonne
      const items = sourceId === 'left' ? [...shuffledLeft] : [...shuffledRight];
      const [removed] = items.splice(sourceIndex, 1);
      items.splice(destIndex, 0, removed);

      if (sourceId === 'left') {
        setShuffledLeft(items);
      } else {
        setShuffledRight(items);
      }
    } else {
      // Tentative de correspondance
      const leftItem = shuffledLeft[sourceIndex];
      const rightItem = shuffledRight[destIndex];

      if (!leftItem || !rightItem) return;

      const pairId = `${leftItem.id}-${rightItem.id}`;

      if (leftItem.matchPair === rightItem.text) {
        // Correspondance correcte
        const updatedMatches = { ...matches, [leftItem.id]: rightItem.id };
        setMatches(updatedMatches);
        setMatchedPairs(prev => new Set([...prev, leftItem.id]));
        setPoints(prev => prev + 10);
        setStreak(prev => prev + 1);
        setLastError(null);

        // Animation de succès
        const leftElement = document.getElementById(`left-${leftItem.id}`);
        const rightElement = document.getElementById(`right-${rightItem.id}`);
        if (leftElement && rightElement) {
          leftElement.classList.add('animate-bounce-once');
          rightElement.classList.add('animate-bounce-once');
          setTimeout(() => {
            leftElement.classList.remove('animate-bounce-once');
            rightElement.classList.remove('animate-bounce-once');
          }, 1000);
        }
      } else {
        // Correspondance incorrecte
        setStreak(0);
        setAttempts(prev => ({
          ...prev,
          [pairId]: (prev[pairId] || 0) + 1
        }));

        // Message d'erreur contextuel
        if (attempts[pairId] >= 2) {
          setLastError(`Astuce: ${leftItem.text} ne correspond pas à ${rightItem.text}`);
        }

        // Animation d'erreur
        const leftElement = document.getElementById(`left-${leftItem.id}`);
        const rightElement = document.getElementById(`right-${rightItem.id}`);
        if (leftElement && rightElement) {
          leftElement.classList.add('animate-shake');
          rightElement.classList.add('animate-shake');
          setTimeout(() => {
            leftElement.classList.remove('animate-shake');
            rightElement.classList.remove('animate-shake');
          }, 1000);
        }
      }

      if (Object.keys(matches).length === shuffledLeft.length) {
        setIsCorrect(true);
        setShowFeedback(true);
        onAnswer(matches);
      }
    }
  };

  const renderItem = (item: MatchingItem, isLeft: boolean, index: number) => {
    const isMatched = isLeft ? matchedPairs.has(item.id) : Object.values(matches).includes(item.id);
    const matchedItem = isLeft 
      ? shuffledRight.find(right => matches[item.id] === right.id)
      : shuffledLeft.find(left => Object.entries(matches).find(([_, rightId]) => rightId === item.id)?.[0]);

    return (
      <Draggable
        key={item.id}
        draggableId={`${isLeft ? 'left' : 'right'}-${item.id}`}
        index={index}
        isDragDisabled={isMatched || showFeedback}
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`
              relative group mb-2
              ${isMatched ? 'opacity-50' : ''}
              ${snapshot.isDragging ? 'z-50' : ''}
            `}
          >
            <Card
              className={`
                p-4 transition-all duration-300
                ${snapshot.isDragging ? 'ring-2 ring-primary scale-105 shadow-lg' : 'hover:scale-102 hover:bg-muted'}
                ${isMatched ? 'bg-green-50 border-green-500' : ''}
                cursor-grab active:cursor-grabbing
              `}
            >
              <div className="flex items-center gap-3">
                <div {...provided.dragHandleProps} className="cursor-grab">
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <span className="line-clamp-2">{isLeft ? item.text : item.matchPair}</span>
                </div>
                {isMatched && (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
                {matchedItem && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <ArrowRight className="h-4 w-4" />
                    <span>{isLeft ? matchedItem.matchPair : matchedItem.text}</span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </Draggable>
    );
  };

  const progress = (Object.keys(matches).length / shuffledLeft.length) * 100;

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

      {question.astuce && (
        <Alert className="cursor-pointer" onClick={() => setShowHint(!showHint)}>
          <Info className="h-4 w-4" />
          <AlertDescription>
            {showHint ? question.astuce : "Cliquez pour voir l'astuce"}
          </AlertDescription>
        </Alert>
      )}

      {lastError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{lastError}</AlertDescription>
        </Alert>
      )}

      <Progress value={progress} className="h-2" />

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Éléments à associer
            </h3>
            <Droppable droppableId="left">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-3"
                >
                  {shuffledLeft.map((item, index) => renderItem(item, true, index))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Valeurs correspondantes
            </h3>
            <Droppable droppableId="right">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-3"
                >
                  {shuffledRight.map((item, index) => renderItem(item, false, index))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>

      {showFeedback && (
        <div className="text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            <span>Toutes les paires sont correctes ! +10 points</span>
          </div>
        </div>
      )}
    </div>
  );
}
