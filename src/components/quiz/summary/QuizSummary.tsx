
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Quiz, Question } from "@/types/quiz";
import { QuizSummaryHeader } from "./QuizSummaryHeader";
import { QuestionSummaryCard } from "./QuestionSummaryCard";
import { isAnswerCorrect } from "./summaryHelpers";

interface QuizSummaryProps {
  quiz: Quiz;
  questions: Question[];
  userAnswers: Record<string, any>;
  score: number;
  totalQuestions: number;
}

export function QuizSummary({ 
  quiz, 
  questions, 
  userAnswers, 
  score, 
  totalQuestions 
}: QuizSummaryProps) {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6 mb-10">
      <QuizSummaryHeader quiz={quiz} score={score} />

      <ScrollArea className="h-[calc(100vh-400px)] md:h-auto">
        <div className="space-y-4 p-1">
          <h2 className="text-xl font-bold">Détails des réponses</h2>
          
          {questions.map((question, index) => {
            const userAnswer = userAnswers[question.id];
            const correct = isAnswerCorrect(question, userAnswer);

            return (
              <QuestionSummaryCard 
                key={question.id}
                question={question}
                index={index}
                userAnswer={userAnswer}
                isCorrect={correct}
              />
            );
          })}
        </div>
      </ScrollArea>
      
      <div className="flex justify-center mt-6 gap-4 flex-wrap">
        <Button onClick={() => navigate('/quizzes')} variant="outline">
          Retour à la liste des quiz
        </Button>
        <Button onClick={() => navigate(`/quiz/${quiz.id}`)}>
          Recommencer
        </Button>
      </div>
    </div>
  );
}
