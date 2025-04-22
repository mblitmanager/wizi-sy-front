import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Question, Answer } from "@/services/QuizService";

interface QuizSummaryProps {
  questions: Question[];
  userAnswers: Record<string, string>;
  score: number;
  totalQuestions: number;
}

export function QuizSummary({ questions, userAnswers, score, totalQuestions }: QuizSummaryProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-primary/5">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Résumé du Quiz
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <p className="text-4xl font-bold text-primary">
              {score}/{totalQuestions}
            </p>
            <p className="text-lg text-muted-foreground">
              {score === totalQuestions ? "Félicitations !" : "Bien joué !"}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {questions.map((question, index) => {
          const userAnswer = userAnswers[question.id];
          const userAnswerObj = question.answers?.find(a => a.id === userAnswer);
          const correctAnswer = question.answers?.find(a => a.isCorrect);
          const isCorrect = userAnswerObj?.isCorrect || false;

          return (
            <Card key={question.id} className={cn(
              "border-2",
              isCorrect ? "border-green-500" : "border-red-500"
            )}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <CardTitle className="text-lg">
                    Question {index + 1}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg font-medium">{question.text}</p>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Votre réponse :
                  </p>
                  <div className={cn(
                    "p-3 rounded-lg",
                    isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  )}>
                    {userAnswerObj?.text}
                  </div>
                </div>

                {!isCorrect && correctAnswer && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Bonne réponse :
                    </p>
                    <div className="p-3 rounded-lg bg-green-100 text-green-800">
                      {correctAnswer.text}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 