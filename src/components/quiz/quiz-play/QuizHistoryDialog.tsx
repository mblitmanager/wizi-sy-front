
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader
} from "@/components/ui/dialog";
import { formatTime } from "@/lib/utils";

interface QuizHistoryDialogProps {
  open: boolean;
  onClose: () => void;
  history: any[];
}

export function QuizHistoryDialog({ open, onClose, history }: QuizHistoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Historique des Quiz</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {history?.map((result, index) => (
            <div 
              key={index} 
              className="p-4 border rounded-lg space-y-2"
            >
              <h3 className="font-semibold">
                Quiz #{result.questions[0]?.quiz_id || 'Inconnu'}
              </h3>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Score: {result.score}</span>
                <span>Temps: {formatTime(result.time_spent)}</span>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
