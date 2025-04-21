
import { Question } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface MultipleChoiceProps {
  question: Question;
  onAnswer: (answer: string) => void;
}

export function MultipleChoice({ question, onAnswer }: MultipleChoiceProps) {
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

      <RadioGroup className="space-y-4" onValueChange={setSelectedAnswer} value={selectedAnswer}>
        {question.answers.map((answer) => (
          <div key={answer.id} className="flex items-center space-x-3">
            <RadioGroupItem value={answer.id} id={answer.id} />
            <Label htmlFor={answer.id}>{answer.text}</Label>
          </div>
        ))}
      </RadioGroup>

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
