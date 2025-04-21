
import { Question } from "@/types";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AudioQuestionProps {
  question: Question;
  onAnswer: (answer: string) => void;
}

export function AudioQuestion({ question, onAnswer }: AudioQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{question.text}</h2>
      
      {question.media && question.media.type === "audio" && (
        <div className="my-4">
          <audio controls className="w-full">
            <source src={question.media.url} type="audio/mpeg" />
            Votre navigateur ne supporte pas la lecture audio.
          </audio>
        </div>
      )}

      <div className="space-y-4">
        {question.answers.map((answer) => (
          <Button 
            key={answer.id}
            variant={selectedAnswer === answer.id ? "default" : "outline"}
            onClick={() => setSelectedAnswer(answer.id)}
            className="w-full text-left justify-start"
          >
            {answer.text}
          </Button>
        ))}
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
