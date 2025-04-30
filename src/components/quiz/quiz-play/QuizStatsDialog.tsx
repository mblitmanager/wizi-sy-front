
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader
} from "@/components/ui/dialog";
import { formatTime } from "@/lib/utils";
import { QuizStats } from "@/types/quiz";

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
  } | QuizStats | null;
}

export function QuizStatsDialog({ open, onClose, stats }: QuizStatsDialogProps) {
  // Si stats est null, utiliser un objet vide pour éviter les erreurs
  if (!stats) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vos statistiques sur ce Quiz</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              Aucune statistique disponible pour ce quiz.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  // Vérifier si stats est au format QuizStats ou au format personnalisé
  const isCustomFormat = 'average_score' in stats;
  
  // Récupérer les valeurs selon le format
  const averageScore = isCustomFormat 
    ? stats.average_score 
    : 'averageScore' in stats ? stats.averageScore : undefined;
  
  const averageTime = isCustomFormat 
    ? stats.average_time 
    : 'averageTimeSpent' in stats ? stats.averageTimeSpent : undefined;
  
  const lastAttemptTime = isCustomFormat && stats.last_attempt 
    ? stats.last_attempt.time_spent 
    : undefined;
  
  const successRate = isCustomFormat 
    ? stats.success_rate 
    : 'completedQuizzes' in stats && stats.totalQuizzes > 0 
      ? Math.round((stats.completedQuizzes / stats.totalQuizzes) * 100) 
      : undefined;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vos statistiques sur ce Quiz</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-2">
            <div className="flex justify-between">
              <span>Moyenne des scores:</span>
              <span className="font-semibold">{typeof averageScore !== 'undefined' ? `${averageScore}%` : '-'}</span>
            </div>
            {typeof averageTime !== 'undefined' && averageTime !== null ? (
              <div className="flex justify-between">
                <span>Temps moyen:</span>
                <span className="font-semibold">{formatTime(averageTime)}</span>
              </div>
            ) : (
              <div className="flex justify-between">
                <span>Temps moyen:</span>
                <span className="font-semibold text-muted-foreground">Non disponible</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Temps du dernier essai:</span>
              <span className="font-semibold">{lastAttemptTime ? formatTime(lastAttemptTime) : "-"}</span>
            </div>
            {typeof successRate !== 'undefined' && successRate !== null ? (
              <div className="flex justify-between">
                <span>Taux de réussite:</span>
                <span className="font-semibold">{successRate}%</span>
              </div>
            ) : (
              <div className="flex justify-between">
                <span>Taux de réussite:</span>
                <span className="font-semibold text-muted-foreground">Non disponible</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
