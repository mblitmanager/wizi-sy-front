
import { Question } from "@/types";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface FlashCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
}

export function FlashCard({ question, onAnswer }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{question.text}</h2>
      
      <div className="flex justify-center">
        <Card 
          className={`w-full max-w-md aspect-[3/2] cursor-pointer transition-transform duration-500 relative ${isFlipped ? 'bg-blue-50' : ''}`} 
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <CardContent className="flex items-center justify-center h-full p-6">
            {!isFlipped ? (
              <div className="text-xl font-medium">
                {question.answers[0]?.text || "Front de la carte"}
              </div>
            ) : (
              <div className="text-xl font-medium text-blue-600">
                {question.answers[1]?.text || "Dos de la carte"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <p className="text-center text-gray-500">Cliquez sur la carte pour la retourner</p>

      <Button 
        onClick={() => onAnswer("viewed")}
        className="w-full mt-6"
      >
        Continuer
      </Button>
    </div>
  );
}
