
import { useState } from "react";
import { Question } from "@/types";
import { MultipleChoice } from "./question-types/MultipleChoice";
import { TrueFalse } from "./question-types/TrueFalse";
import { FillInBlank } from "./question-types/FillInBlank";
import { AudioQuestion } from "./question-types/AudioQuestion";
import { FlashCard } from "./question-types/FlashCard";
import { WordBank } from "./question-types/WordBank";
import { Matching } from "./question-types/Matching";
import { Rearrangement } from "./question-types/Rearrangement";

interface QuizGameProps {
  questions: Question[];
}

export function QuizGame({ questions }: QuizGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = questions[currentQuestionIndex];

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case "multiple-choice":
        return <MultipleChoice question={currentQuestion} onAnswer={handleAnswer} />;
      case "true-false":
        return <TrueFalse question={currentQuestion} onAnswer={handleAnswer} />;
      case "fill-in-blank":
        return <FillInBlank question={currentQuestion} onAnswer={handleAnswer} />;
      case "audio-question":
        return <AudioQuestion question={currentQuestion} onAnswer={handleAnswer} />;
      case "flash-card":
        return <FlashCard question={currentQuestion} onAnswer={handleAnswer} />;
      case "word-bank":
        return <WordBank question={currentQuestion} onAnswer={handleAnswer} />;
      case "matching":
        return <Matching question={currentQuestion} onAnswer={handleAnswer} />;
      case "rearrangement":
        return <Rearrangement question={currentQuestion} onAnswer={handleAnswer} />;
      default:
        return <div>Type de question non supporté</div>;
    }
  };

  const handleAnswer = async (answer: any) => {
    // TODO: Implement answer submission
    // POST to /api/quizzes/{quizId}/submit
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Question {currentQuestionIndex + 1}/{questions.length}</h1>
      </div>
      {renderQuestion()}
    </div>
  );
}
