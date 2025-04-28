
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader
} from "@/components/ui/dialog";
import { formatTime } from "@/lib/utils";

interface QuizStatsDialogProps {
  open: boolean;
  onClose: () => void;
  stats: any;
}

export function QuizStatsDialog({ open, onClose, stats }: QuizStatsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Statistiques du Quiz</DialogTitle>
        </DialogHeader>
        {stats && (
          <div className="space-y-4">
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span>Moyenne des scores:</span>
                <span className="font-semibold">{stats.average_score}</span>
              </div>
              <div className="flex justify-between">
                <span>Temps moyen:</span>
                <span className="font-semibold">{formatTime(stats.average_time)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taux de réussite:</span>
                <span className="font-semibold">{stats.success_rate}%</span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
