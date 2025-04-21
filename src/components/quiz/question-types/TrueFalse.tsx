
import { Question } from "@/types";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface TrueFalseProps {
  question: Question;
  onAnswer: (answer: string) => void;
}

export function TrueFalse({ question, onAnswer }: TrueFalseProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");

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

      <div className="flex gap-4">
        <Button 
          variant={selectedAnswer === "true" ? "default" : "outline"}
          onClick={() => setSelectedAnswer("true")}
          className="flex-1"
        >
          Vrai
        </Button>
        <Button 
          variant={selectedAnswer === "false" ? "default" : "outline"}
          onClick={() => setSelectedAnswer("false")}
          className="flex-1"
        >
          Faux
        </Button>
      </div>

      <Button 
        onClick={() => onAnswer(selectedAnswer)}
        disabled={!selectedAnswer}
        className="w-full mt-6"
      >
        Valider
      </Button>
    </div>
  );
}
