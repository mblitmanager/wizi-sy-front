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
  stats: {
    average_score?: number;
    average_time?: number | null;
    last_attempt?: {
      time_spent?: number;
    };
    success_rate?: number | null;
  };
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
                <span className="font-semibold">{typeof stats.average_score !== 'undefined' ? stats.average_score : '-'}</span>
              </div>
              {typeof stats.average_time !== 'undefined' && stats.average_time !== null ? (
                <div className="flex justify-between">
                  <span>Temps moyen:</span>
                  <span className="font-semibold">{formatTime(stats.average_time)}</span>
                </div>
              ) : (
                <div className="flex justify-between">
                  <span>Temps moyen:</span>
                  <span className="font-semibold text-muted-foreground">Non disponible</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Temps du dernier essai:</span>
                <span className="font-semibold">{stats.last_attempt?.time_spent ? formatTime(stats.last_attempt.time_spent) : "-"}</span>
              </div>
              {typeof stats.success_rate !== 'undefined' && stats.success_rate !== null ? (
                <div className="flex justify-between">
                  <span>Taux de réussite:</span>
                  <span className="font-semibold">{stats.success_rate}%</span>
                </div>
              ) : (
                <div className="flex justify-between">
                  <span>Taux de réussite:</span>
                  <span className="font-semibold text-muted-foreground">Non disponible</span>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
