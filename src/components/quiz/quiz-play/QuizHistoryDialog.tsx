import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader
} from "@/components/ui/dialog";

interface QuizHistoryDialogProps {
  open: boolean;
  onClose: () => void;
  history: {
    id: string;
    completedAt: string | null;
    timeSpent: number;
    score: number | null;
    quiz?: {
      title?: string;
      category?: string;
      level?: string;
    };
  }[];
}

function formatTime(seconds: number) {
  if (typeof seconds !== 'number' || isNaN(seconds)) return '-';
  if (seconds < 3600) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  } else {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }
}

export function QuizHistoryDialog({ open, onClose, history }: QuizHistoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Historique des Quiz</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {history && Array.isArray(history) &&
            history
              .slice()
              .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
              .slice(0, 3)
              .map((result, index) => {
                const time = formatTime(result.timeSpent);
                const date = result.completedAt
                  ? new Date(result.completedAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })
                  : '-';
                return (
                  <div key={result.id} className="p-4 border rounded-lg space-y-2">
                    <h3 className="font-semibold">{result.quiz?.title ?? 'Quiz inconnu'}</h3>
                    <div className="text-sm text-muted-foreground">
                      <span>Catégorie : {result.quiz?.category ?? '-'}</span> | <span>Niveau : {result.quiz?.level ?? '-'}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-between text-sm text-muted-foreground">
                      <span>Score : {result.score ?? '-'}</span>
                      <span>Date : {date}</span>
                      <span>Temps : {time}</span>
                    </div>
                  </div>
                );
              })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
