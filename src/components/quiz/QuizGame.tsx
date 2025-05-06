import { useState } from "react";
import { MultipleChoice } from "./question-types/MultipleChoice";
import { TrueFalse } from "./question-types/TrueFalse";
import { FillBlank } from "./question-types/FillBlank";
import { AudioQuestion } from "./question-types/AudioQuestion";
import { Flashcard } from './question-types/FlashCard';
import { WordBank } from "./question-types/WordBank";
import { Matching } from "./question-types/Matching";
import { Ordering } from "./question-types/Ordering";

interface QuizGameProps {
  questions: any[];
}

export function QuizGame({ questions }: QuizGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  if (!questions || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p>Aucune question disponible</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  
  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p>Question non disponible</p>
      </div>
    );
  }

  // Map API question types to component types
  const getQuestionType = (type: string) => {
    const typeMap: Record<string, string> = {
      "choix multiples": "multiple-choice",
      "vrai/faux": "true-false",
      "remplir le champ vide": "fill-in-blank",
      "audio": "audio-question",
      "carte flash": "flash-card",
      "banque de mots": "word-bank",
      "correspondance": "matching",
      "réorganisation": "ordering"
    };
    
    return typeMap[type] || type;
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;
    
    const questionType = getQuestionType(currentQuestion.type);
    
    // Adapt the question format from API to component format
    const adaptedQuestion = {
      ...currentQuestion,
      type: questionType,
      answers: currentQuestion.reponses || [],
      media: currentQuestion.media_url ? {
        type: "image",
        url: currentQuestion.media_url
      } : null
    };
    
    switch (questionType) {
      case "multiple-choice":
        return <MultipleChoice question={adaptedQuestion} onAnswer={handleAnswer} />;
      case "true-false":
        return <TrueFalse question={adaptedQuestion} onAnswer={handleAnswer} />;
      case "fill-in-blank":
        return <FillBlank question={adaptedQuestion} onAnswer={handleAnswer} />;
      case "audio-question":
        return <AudioQuestion question={adaptedQuestion} onAnswer={handleAnswer} />;
      case "flash-card":
        return <Flashcard question={adaptedQuestion} onAnswer={handleAnswer} />;
      case "word-bank":
        return <WordBank question={adaptedQuestion} onAnswer={handleAnswer} />;
      case "matching":
        return <Matching question={adaptedQuestion} onAnswer={handleAnswer} />;
      case "ordering":
        return <Ordering question={adaptedQuestion} onAnswer={handleAnswer} />;
      default:
        return <div>Type de question non supporté: {currentQuestion.type}</div>;
    }
  };

  const handleAnswer = async (answer: any) => {
    // TODO: Implement answer submission
    // POST to /api/quizzes/{quizId}/submit
    
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Last question handled - could redirect to results page
      console.log("Quiz Terminé!");
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
