import React from "react";
import { Clock, Target, History } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { QuizHistory } from "@/types/quiz";
import { cn } from "@/lib/utils";

interface QuizHistoryModalProps {
  quizId: number | null;
  quizTitle?: string;
  quizHistory: QuizHistory[] | { data?: QuizHistory[] } | undefined;
  onClose: () => void;
}

type RawAttempt = QuizHistory & {
  quiz_id?: string | number;
  correct_answers?: number;
  total_questions?: number;
  time_spent?: number;
  created_at?: string;
};

const MAX_ATTEMPTS = 5;

function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m} min ${s.toString().padStart(2, "0")} s` : `${s} s`;
}

/** Dernières tentatives d'un quiz (données de GET /quiz/history). */
export const QuizHistoryModal: React.FC<QuizHistoryModalProps> = ({ quizId, quizTitle, quizHistory, onClose }) => {
  const historyArray: RawAttempt[] = Array.isArray(quizHistory) ? quizHistory : quizHistory?.data ?? [];

  const attempts = historyArray
    .filter((h) => String(h.quiz?.id ?? h.quizId ?? h.quiz_id ?? "") === String(quizId))
    .map((h) => {
      const correct = Number(h.correctAnswers ?? h.correct_answers) || 0;
      const total = Number(h.totalQuestions ?? h.total_questions) || 0;
      return {
        correct,
        total,
        percent: total > 0 ? Math.round((correct / total) * 100) : 0,
        time: Number(h.timeSpent ?? h.time_spent) || 0,
        date: h.completedAt ?? h.created_at ?? null,
      };
    })
    .sort((a, b) => (b.date ? Date.parse(b.date) : 0) - (a.date ? Date.parse(a.date) : 0))
    .slice(0, MAX_ATTEMPTS);

  const best = attempts.reduce((max, a) => Math.max(max, a.percent), 0);

  return (
    <Dialog open={!!quizId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[85vh] w-[95vw] max-w-md flex-col gap-0 overflow-hidden rounded-2xl p-0">
        <DialogHeader className="border-b border-border px-5 py-4 text-left">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <History className="h-5 w-5 text-muted-foreground" />
            Historique
          </DialogTitle>
          <DialogDescription className="truncate">{quizTitle || "Vos dernières tentatives"}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {attempts.length > 0 ? (
            <>
              <p className="mb-3 text-sm text-muted-foreground">
                Meilleur résultat : <span className="font-semibold text-foreground">{best} %</span>
                {" · "}
                {attempts.length} tentative{attempts.length > 1 ? "s" : ""} récente{attempts.length > 1 ? "s" : ""}
              </p>
              <ul className="space-y-2">
                {attempts.map((a, idx) => {
                  const success = a.percent >= 70;
                  return (
                    <li key={idx} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                      <span
                        className={cn(
                          "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold tabular-nums",
                          success ? "bg-emerald-50 text-emerald-700" : "bg-orange-50 text-orange-700"
                        )}
                      >
                        {a.percent}%
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {a.date
                            ? new Date(a.date).toLocaleString("fr-FR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Date inconnue"}
                        </p>
                        <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Target className="h-3.5 w-3.5" />
                            {a.correct}/{a.total || "?"} bonnes réponses
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {formatDuration(a.time)}
                          </span>
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <History className="h-10 w-10 text-muted-foreground/40" />
              <p className="font-medium text-foreground">Aucune tentative</p>
              <p className="text-sm text-muted-foreground">Lancez ce quiz pour voir vos résultats ici.</p>
            </div>
          )}
        </div>

        <div className="border-t border-border px-5 py-3">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
