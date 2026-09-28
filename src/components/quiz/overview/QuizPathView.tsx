import { useEffect, useRef } from "react";
import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QuizItem } from "@/hooks/quiz/useQuizOverview";
import { QuizItemCard } from "./QuizItemCard";

interface QuizPathViewProps {
  items: QuizItem[];
  onHistory: (item: QuizItem) => void;
}

/**
 * Parcours progressif : un quiz se débloque quand le précédent est terminé.
 * La page se place automatiquement sur le prochain quiz à faire.
 */
export function QuizPathView({ items, onHistory }: QuizPathViewProps) {
  const nextRef = useRef<HTMLLIElement>(null);
  const nextId = items.find((i) => i.status === "next")?.id;

  useEffect(() => {
    if (!nextId || !nextRef.current) return;
    // Seulement si le prochain quiz n'est pas déjà visible
    const rect = nextRef.current.getBoundingClientRect();
    if (rect.top < 0 || rect.bottom > window.innerHeight) {
      nextRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [nextId]);

  return (
    <ol className="relative space-y-3" aria-label="Parcours de quiz">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <li key={item.id} ref={item.id === nextId ? nextRef : undefined} className="relative flex gap-3 sm:gap-4">
            {/* Repère d'étape + trait du parcours */}
            <div className="relative flex w-8 flex-shrink-0 justify-center sm:w-10">
              {!isLast && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-9 -bottom-3 w-0.5 sm:top-10",
                    item.status === "done" ? "bg-emerald-300" : "bg-border"
                  )}
                />
              )}
              <span
                className={cn(
                  "relative z-10 mt-4 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold tabular-nums sm:h-10 sm:w-10 sm:text-sm",
                  item.status === "done" && "bg-emerald-500 text-white",
                  item.status === "next" && "bg-primary text-primary-foreground ring-4 ring-gold/40",
                  item.status === "locked" && "border-2 border-dashed border-border bg-card text-muted-foreground"
                )}
                aria-label={`Étape ${index + 1}`}
              >
                {item.status === "done" ? (
                  <Check className="h-4 w-4" strokeWidth={3} />
                ) : item.status === "locked" ? (
                  <Lock className="h-3.5 w-3.5" />
                ) : (
                  index + 1
                )}
              </span>
            </div>

            <QuizItemCard item={item} onHistory={onHistory} layout="row" className="flex-1" />
          </li>
        );
      })}
    </ol>
  );
}
