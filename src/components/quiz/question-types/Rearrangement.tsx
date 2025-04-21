
import { Question } from "@/types";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface RearrangementProps {
  question: Question;
  onAnswer: (answer: string[]) => void;
}

export function Rearrangement({ question, onAnswer }: RearrangementProps) {
  // Initialiser avec des éléments dans un ordre aléatoire
  const [items, setItems] = useState<{id: string, text: string}[]>(
    [...question.answers].sort(() => Math.random() - 0.5)
  );

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    setItems(newItems);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{question.text}</h2>
      
      {question.media && (
        <div className="my-4">
          {question.media.type === "image" && (
            <img src={question.media.url} alt="Question" className="max-w-full rounded-lg" />
          )}
        </div>
      )}

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={item.id} className="flex items-center gap-2">
            <div className="p-3 bg-white border rounded-md flex-1">
              {item.text}
            </div>
            <div className="flex flex-col gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => moveItem(index, Math.max(0, index - 1))}
                disabled={index === 0}
              >
                ↑
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => moveItem(index, Math.min(items.length - 1, index + 1))}
                disabled={index === items.length - 1}
              >
                ↓
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button 
        onClick={() => onAnswer(items.map(item => item.id))}
        className="w-full mt-6"
      >
        Valider
      </Button>
    </div>
  );
}
