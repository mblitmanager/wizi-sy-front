import { Check, Lock, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LEVEL_THRESHOLDS } from "@/components/quiz/quizUtils";
import { getLevelProgress } from "@/hooks/quiz/useQuizOverview";

interface QuizProgressPanelProps {
  points: number;
  doneCount: number;
  totalCount: number;
  lockedByLevelCount: number;
}

/** Points, niveaux débloqués (paliers du backend) et avancement dans la formation. */
export function QuizProgressPanel({ points, doneCount, totalCount, lockedByLevelCount }: QuizProgressPanelProps) {
  const { next, percent } = getLevelProgress(points);
  const completion = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-3">
      {/* Points et niveau */}
      <section className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-sm)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Mes points</p>
            <p className="font-poppins text-2xl font-bold tabular-nums text-foreground">{points}</p>
          </div>
          <Link
            to="/classement"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold-deep transition-colors hover:bg-gold/25"
            aria-label="Voir le classement"
            title="Voir le classement"
          >
            <Trophy className="h-5 w-5" />
          </Link>
        </div>

        <ol className="mt-4 grid grid-cols-3 gap-2">
          {LEVEL_THRESHOLDS.map((t) => {
            const unlocked = points >= t.minPoints;
            return (
              <li
                key={t.level}
                className={cn(
                  "flex flex-col items-center rounded-xl border px-1 py-2 text-center",
                  unlocked ? "border-primary/15 bg-accent" : "border-dashed border-border"
                )}
              >
                <span
                  className={cn(
                    "mb-1 flex h-6 w-6 items-center justify-center rounded-full",
                    unlocked ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  )}
                >
                  {unlocked ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <Lock className="h-3 w-3" />}
                </span>
                <span className={cn("text-[11px] font-semibold", unlocked ? "text-foreground" : "text-muted-foreground")}>
                  {t.label}
                </span>
                <span className="text-[10px] text-muted-foreground">{t.minPoints} pts</span>
              </li>
            );
          })}
        </ol>

        {next ? (
          <div className="mt-4">
            <div className="mb-1.5 flex justify-between text-xs">
              <span className="text-muted-foreground">
                Niveau <span className="font-medium text-foreground">{next.label}</span>
              </span>
              <span className="font-medium tabular-nums text-muted-foreground">
                {points}/{next.minPoints} pts
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-gold transition-[width] duration-500" style={{ width: `${percent}%` }} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Encore <span className="font-semibold text-foreground">{next.minPoints - points} pts</span> pour débloquer ce niveau.
            </p>
          </div>
        ) : (
          <p className="mt-4 text-xs font-medium text-emerald-700">Tous les niveaux sont débloqués.</p>
        )}
      </section>

      {/* Avancement dans la formation */}
      <section className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-sm)]">
        <div className="mb-1.5 flex items-baseline justify-between">
          <p className="text-xs font-medium text-muted-foreground">Quiz terminés</p>
          <p className="text-sm font-semibold tabular-nums text-foreground">
            {doneCount}/{totalCount}
          </p>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-emerald-500 transition-[width] duration-500" style={{ width: `${completion}%` }} />
        </div>
        {lockedByLevelCount > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            {lockedByLevelCount} quiz de niveau supérieur se débloqueront avec plus de points.
          </p>
        )}
        <p className="mt-3 border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
          Seul votre meilleur score est conservé : rejouez un quiz pour l'améliorer.
        </p>
      </section>
    </div>
  );
}
