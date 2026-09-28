import { PlayCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResumeQuizBannerProps {
  title: string;
  answered: number;
  total: number;
  onResume: () => void;
  onDismiss: () => void;
}

/** Quiz commencé mais non terminé (données de /quiz/{id}/participation/resume). */
export function ResumeQuizBanner({ title, answered, total, onResume, onDismiss }: ResumeQuizBannerProps) {
  const percent = total > 0 ? Math.min(100, Math.round((answered / total) * 100)) : 0;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gold/50 bg-gold-soft p-4 sm:flex-row sm:items-center">
      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gold text-navy">
        <PlayCircle className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-gold-deep">Quiz en cours</p>
        <p className="truncate font-semibold text-foreground">{title}</p>
        {total > 0 && (
          <div className="mt-1.5 flex items-center gap-2">
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-gold" style={{ width: `${percent}%` }} />
            </div>
            <span className="text-xs text-muted-foreground tabular-nums">
              {answered}/{total} questions
            </span>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Button onClick={onResume} className="h-9 rounded-lg font-semibold">
          Reprendre
        </Button>
        <Button variant="ghost" size="icon" onClick={onDismiss} className="h-9 w-9 text-muted-foreground" aria-label="Masquer">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
