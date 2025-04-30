
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Quiz } from "@/types/quiz";

interface QuizSummaryHeaderProps {
  quiz: Quiz;
  score: number;
}

export const QuizSummaryHeader: React.FC<QuizSummaryHeaderProps> = ({ quiz, score }) => {
  const navigate = useNavigate();

  // Calculer le niveau de réussite
  const successLevel = 
    score >= 80 ? "Excellent" :
    score >= 70 ? "Très bien" :
    score >= 60 ? "Bien" :
    score >= 50 ? "Moyen" :
    "À améliorer";

  return (
    <>
      <div className="flex items-center gap-4 flex-wrap">
        <Button 
          variant="outline" 
          onClick={() => navigate('/quizzes')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">{quiz.titre || "Quiz"}</h1>
      </div>
      
      <Card className="bg-primary/5">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Résumé du Quiz
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className={`text-4xl font-bold rounded-full h-24 w-24 flex items-center justify-center ${
                score >= 70 ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
              }`}>
                {score}%
              </div>
            </div>
            <div>
              <Badge className={score >= 70 ? "bg-green-500" : "bg-amber-500"}>
                {successLevel}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground">
              {score === 100 ? "Félicitations ! Score parfait!" : 
               score >= 80 ? "Excellent travail !" :
               score >= 60 ? "Bien joué !" :
               "Continuez à vous entraîner !"}
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
