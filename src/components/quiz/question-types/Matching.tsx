
import { Question } from "@/types";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface MatchingProps {
  question: Question;
  onAnswer: (answer: Record<string, string>) => void;
}

export function Matching({ question, onAnswer }: MatchingProps) {
  // Supposons que les réponses paires sont les éléments de gauche et impaires ceux de droite
  const leftItems = question.answers.filter((_, i) => i % 2 === 0);
  const rightItems = question.answers.filter((_, i) => i % 2 === 1);
  
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  const handleLeftClick = (id: string) => {
    setSelectedLeft(id);
  };

  const handleRightClick = (id: string) => {
    if (selectedLeft) {
      // Créer une nouvelle correspondance
      setMatches({...matches, [selectedLeft]: id});
      setSelectedLeft(null);
    }
  };

  const isLeftSelected = (id: string) => selectedLeft === id;
  const isRightMatched = (id: string) => Object.values(matches).includes(id);
  const isLeftMatched = (id: string) => id in matches;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{question.text}</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          {leftItems.map((item) => (
            <Button
              key={item.id}
              variant={isLeftSelected(item.id) ? "default" : isLeftMatched(item.id) ? "secondary" : "outline"}
              className="w-full justify-start"
              onClick={() => handleLeftClick(item.id)}
              disabled={isLeftMatched(item.id)}
            >
              {item.text}
            </Button>
          ))}
        </div>
        
        <div className="space-y-2">
          {rightItems.map((item) => (
            <Button
              key={item.id}
              variant={isRightMatched(item.id) ? "secondary" : "outline"}
              className="w-full justify-start"
              onClick={() => handleRightClick(item.id)}
              disabled={isRightMatched(item.id)}
            >
              {item.text}
            </Button>
          ))}
        </div>
      </div>

      <Button 
        onClick={() => onAnswer(matches)}
        disabled={Object.keys(matches).length < Math.min(leftItems.length, rightItems.length)}
        className="w-full mt-6"
      >
        Valider
      </Button>
    </div>
  );
}
