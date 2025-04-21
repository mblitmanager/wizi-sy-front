
import { Question } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface FillInBlankProps {
  question: Question;
  onAnswer: (answer: string) => void;
}

export function FillInBlank({ question, onAnswer }: FillInBlankProps) {
  const [answer, setAnswer] = useState("");

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

      <Input 
        type="text" 
        placeholder="Votre réponse..." 
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      <Button 
        onClick={() => onAnswer(answer)}
        disabled={!answer}
        className="w-full mt-6"
      >
        Valider
      </Button>
    </div>
  );
}
