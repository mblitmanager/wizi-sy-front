import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Check, History, Lock, Play, RotateCcw, HelpCircle, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCategoryConfig } from "@/utils/quizColors";
import type { QuizItem } from "@/hooks/quiz/useQuizOverview";

interface QuizItemCardProps {
  item: QuizItem;
  onHistory?: (item: QuizItem) => void;
  /** Mise en page : ligne compacte (parcours) ou carte (grille). */
  layout?: "row" | "card";
  className?: string;
}

const LEVEL_STYLES: Record<QuizItem["level"], string> = {
  débutant: "bg-emerald-50 text-emerald-700",
  intermédiaire: "bg-sky-50 text-sky-700",
  avancé: "bg-rose-50 text-rose-700",
};

function lockedReason(item: QuizItem) {
  return item.questionCount === 0 ? "Bientôt disponible" : "Terminez le quiz précédent pour le débloquer";
}

function StatusIcon({ item }: { item: QuizItem }) {
  const base = "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl";
  if (item.status === "done")
    return (
      <span className={cn(base, "bg-emerald-50 text-emerald-600")}>
        <Check className="h-5 w-5" strokeWidth={2.5} />
      </span>
    );
  if (item.status === "locked")
    return (
      <span className={cn(base, "bg-secondary text-muted-foreground/60")}>
        <Lock className="h-5 w-5" />
      </span>
    );
  return (
    <span className={cn(base, item.status === "next" ? "bg-primary text-primary-foreground shadow-sm" : "bg-accent text-primary")}>
      <Play className="h-5 w-5 translate-x-px" />
    </span>
  );
}

export const QuizItemCard = memo(function QuizItemCard({ item, onHistory, layout = "card", className }: QuizItemCardProps) {
  const navigate = useNavigate();
  const locked = item.status === "locked";
  const category = getCategoryConfig(item.category);
  const open = () => !locked && navigate(`/quiz/${item.id}`);

  return (
    <article
      className={cn(
        "group relative flex rounded-2xl border bg-card transition-all duration-200",
        layout === "card" ? "h-full flex-col p-4" : "flex-col gap-3 p-4 sm:flex-row sm:items-center",
        locked
          ? "border-dashed border-border bg-card/60"
          : "border-border shadow-[var(--shadow-sm)] hover:border-primary/25 hover:shadow-[var(--shadow-md)]",
        item.status === "next" && "border-primary/40 ring-4 ring-primary/5",
        className
      )}
    >
      <div className={cn("flex min-w-0 flex-1 gap-3", layout === "card" && "mb-4")}>
        <StatusIcon item={item} />
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            <span className="inline-flex items-center gap-1.5 font-medium text-muted-foreground">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: category.color }} aria-hidden />
              {item.category}
            </span>
            <span className={cn("rounded-full px-2 py-0.5 font-semibold", LEVEL_STYLES[item.level])}>{item.levelLabel}</span>
            {item.status === "next" && (
              <span className="rounded-full bg-gold/20 px-2 py-0.5 font-semibold text-gold-deep">À faire maintenant</span>
            )}
          </div>

          <h3
            className={cn(
              "font-semibold leading-snug",
              layout === "card" ? "line-clamp-2 text-base" : "text-base",
              locked ? "text-muted-foreground" : "text-foreground"
            )}
          >
            {item.title}
          </h3>

          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <HelpCircle className="h-3.5 w-3.5" />
              {item.questionCount} question{item.questionCount > 1 ? "s" : ""}
            </span>
            {item.points > 0 && (
              <span className="inline-flex items-center gap-1">
                <Award className="h-3.5 w-3.5" />
                {item.points} pts
              </span>
            )}
            {item.lastAttempt && (
              <span className="inline-flex items-center gap-1 font-medium text-foreground/80">
                Dernier résultat : {item.lastAttempt.percent} %
                <span className="font-normal text-muted-foreground">
                  ({item.lastAttempt.correct}/{item.lastAttempt.total})
                </span>
              </span>
            )}
          </p>

          {locked && <p className="mt-2 text-xs font-medium text-muted-foreground">{lockedReason(item)}</p>}
        </div>
      </div>

      <div className={cn("flex flex-shrink-0 items-center gap-2", layout === "card" ? "mt-auto" : "sm:pl-2")}>
        {item.played && onHistory && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onHistory(item)}
            className="h-9 rounded-lg px-3 text-muted-foreground hover:text-foreground"
            aria-label={`Historique de ${item.title}`}
          >
            <History className="h-4 w-4" />
            <span className={cn(layout === "row" && "hidden sm:inline")}>Historique</span>
          </Button>
        )}
        <Button
          size="sm"
          onClick={open}
          disabled={locked}
          variant={item.played ? "outline" : "default"}
          className={cn("h-9 rounded-lg px-4 font-semibold", layout === "card" && "ml-auto")}
        >
          {locked ? (
            <>
              <Lock className="h-4 w-4" />
              Verrouillé
            </>
          ) : item.played ? (
            <>
              <RotateCcw className="h-4 w-4" />
              Rejouer
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Commencer
            </>
          )}
        </Button>
      </div>
    </article>
  );
});
