
import { Question } from "@/types";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface WordBankProps {
  question: Question;
  onAnswer: (answer: string[]) => void;
}

export function WordBank({ question, onAnswer }: WordBankProps) {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const availableWords = question.answers.map(a => a.text);

  const toggleWord = (word: string) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter(w => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
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

      <div className="p-4 border rounded-md bg-gray-50">
        <div className="flex flex-wrap gap-2">
          {availableWords.map((word, index) => (
            <Button
              key={index}
              variant={selectedWords.includes(word) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleWord(word)}
            >
              {word}
            </Button>
          ))}
        </div>
      </div>

      <Button 
        onClick={() => onAnswer(selectedWords)}
        disabled={selectedWords.length === 0}
        className="w-full mt-6"
      >
        Valider
      </Button>
    </div>
  );
}
