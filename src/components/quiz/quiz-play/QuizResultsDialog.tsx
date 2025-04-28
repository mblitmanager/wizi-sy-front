
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Résultats du Quiz</DialogTitle>
        </DialogHeader>
        <div className="text-center py-6">
          <div className="text-4xl font-bold mb-2">{score} points</div>
          <p className="text-muted-foreground">
            {answers.filter((a) => a.isCorrect).length} bonnes réponses sur {totalQuestions}
          </p>
        </div>
        <div className="space-y-4">
          {answers.map((answer) => {
            const question = questions.find((q) => q.id === answer.questionId);
            return (
              <div key={answer.questionId} className="space-y-2">
                <h3 className="font-medium">{question?.text}</h3>
                <div className="flex items-center gap-2">
                  {answer.isCorrect ? (
                    <CheckCircle2 className="text-green-500 h-5 w-5" />
                  ) : (
                    <XCircle className="text-red-500 h-5 w-5" />
                  )}
                  <span>{answer.points} points</span>
                </div>
              </div>
            );
          })}
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => navigate('/formations')}>
            Retour aux formations
          </Button>
          <Button onClick={onRestart}>
            Recommencer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
