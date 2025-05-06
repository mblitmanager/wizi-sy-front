
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface QuizResultsDialogProps {
  open: boolean;
  onClose: () => void;
  score: number;
  totalQuestions: number;
  answers: any[];
  questions: any[];
  onRestart: () => void;
}

export function QuizResultsDialog({
  open,
  onClose,
  score,
  totalQuestions,
  answers,
  questions,
  onRestart
}: QuizResultsDialogProps) {
  const navigate = useNavigate();

  // Filter questions to only include those that have been answered
  const answeredQuestionIds = answers.map(answer => answer.questionId);
  const playedQuestions = questions.filter(question => 
    answeredQuestionIds.includes(question.id)
  );

  // Calculate correct answers
  const correctAnswers = answers.filter(a => a.isCorrect).length;
  
  // Calculate points (2 points per question)
  const earnedPoints = correctAnswers * 2;
  const maximumPoints = totalQuestions * 2;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Résultats du Quiz</DialogTitle>
        </DialogHeader>
        
        <div className="text-center py-4">
          <div className="text-4xl font-bold mb-2">{earnedPoints} points</div>
          <p className="text-muted-foreground">
            {correctAnswers} bonnes réponses sur {totalQuestions}
          </p>
          <Badge className={score >= 70 ? "bg-green-500 mt-2" : "bg-amber-500 mt-2"}>
            {score}% de réussite
          </Badge>
        </div>
        
        <ScrollArea className="flex-grow pr-4">
          <div className="space-y-4">
            {playedQuestions.map((question, index) => {
              const answer = answers.find(a => a.questionId === question.id);
              return (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {answer?.isCorrect ? (
                      <CheckCircle2 className="text-green-500 h-5 w-5" />
                    ) : (
                      <XCircle className="text-red-500 h-5 w-5" />
                    )}
                    <h3 className="font-medium">Question {index + 1}</h3>
                  </div>
                  
                  <p className="text-sm mb-2">{question.text}</p>
                  
                  <div className="flex items-center gap-2 text-sm">
                    {answer?.isCorrect ? (
                      <span className="text-green-600">+2 points</span>
                    ) : (
                      <span className="text-red-600">0 point</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        
        <DialogFooter className="gap-2 pt-4">
          <Button variant="outline" onClick={() => navigate('/quizzes')}>
            Retour aux quiz
          </Button>
          <Button onClick={onRestart}>
            Recommencer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
