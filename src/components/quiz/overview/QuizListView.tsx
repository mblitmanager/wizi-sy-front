import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { QuizItem } from "@/hooks/quiz/useQuizOverview";
import { LEVEL_THRESHOLDS, type QuizLevel } from "@/components/quiz/quizUtils";
import { QuizItemCard } from "./QuizItemCard";
import { EmptyState } from "./EmptyState";

interface QuizListViewProps {
  todo: QuizItem[];
  done: QuizItem[];
  onHistory: (item: QuizItem) => void;
}

type Tab = "todo" | "done";
const PAGE_SIZE = 9;

function normalize(text: string) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/** Liste filtrable : quiz à faire (niveaux débloqués) et quiz déjà joués. */
export function QuizListView({ todo, done, onHistory }: QuizListViewProps) {
  const [tab, setTab] = useState<Tab>(todo.length === 0 && done.length > 0 ? "done" : "todo");
  const [level, setLevel] = useState<QuizLevel | "all">("all");
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const source = tab === "todo" ? todo : done;

  const levels = useMemo(() => {
    const present = new Set([...todo, ...done].map((i) => i.level));
    return LEVEL_THRESHOLDS.filter((t) => present.has(t.level));
  }, [todo, done]);

  const filtered = useMemo(() => {
    const term = normalize(search.trim());
    return source.filter(
      (item) => (level === "all" || item.level === level) && (!term || normalize(item.title).includes(term))
    );
  }, [source, level, search]);

  const resetPaging = () => setVisible(PAGE_SIZE);
  const hasFilters = level !== "all" || search.trim() !== "";

  return (
    <div className="space-y-4">
      {/* Onglets */}
      <div className="flex gap-1 border-b border-border" role="tablist">
        {(
          [
            ["todo", "À faire", todo.length],
            ["done", "Terminés", done.length],
          ] as const
        ).map(([key, label, count]) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => {
              setTab(key);
              resetPaging();
            }}
            className={cn(
              "-mb-px flex items-center gap-2 border-b-2 px-3 pb-2.5 pt-1 text-sm font-semibold transition-colors",
              tab === key ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs tabular-nums",
                tab === key ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              )}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Filtres */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:max-w-xs sm:flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetPaging();
            }}
            placeholder="Rechercher un quiz"
            className="h-10 rounded-lg pl-9"
            aria-label="Rechercher un quiz"
          />
        </div>
        {levels.length > 1 && (
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrer par niveau">
            {[{ level: "all" as const, label: "Tous" }, ...levels].map((l) => (
              <button
                key={l.level}
                onClick={() => {
                  setLevel(l.level);
                  resetPaging();
                }}
                aria-pressed={level === l.level}
                className={cn(
                  "h-9 rounded-full border px-3.5 text-sm font-medium transition-colors",
                  level === l.level
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
        )}
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setLevel("all");
              setSearch("");
              resetPaging();
            }}
            className="h-9 self-start text-muted-foreground sm:self-auto"
          >
            <X className="h-4 w-4" />
            Effacer
          </Button>
        )}
      </div>

      {/* Résultats */}
      {filtered.length === 0 ? (
        <EmptyState
          title={hasFilters ? "Aucun quiz ne correspond à vos filtres" : tab === "todo" ? "Tout est terminé !" : "Aucun quiz terminé"}
          description={
            hasFilters
              ? "Essayez un autre niveau ou une autre recherche."
              : tab === "todo"
                ? "Vous avez joué tous les quiz disponibles pour cette formation. Rejouez-les pour améliorer votre score."
                : "Vos quiz terminés apparaîtront ici."
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filtered.slice(0, visible).map((item) => (
              <QuizItemCard key={item.id} item={item} onHistory={onHistory} layout="card" />
            ))}
          </div>
          {filtered.length > visible && (
            <div className="flex justify-center pt-2">
              <Button variant="outline" onClick={() => setVisible((v) => v + PAGE_SIZE)} className="rounded-lg">
                Afficher plus ({filtered.length - visible} restant{filtered.length - visible > 1 ? "s" : ""})
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
