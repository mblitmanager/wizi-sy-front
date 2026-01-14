import React from "react";
import { ChartSpline, Lock, Trophy, Clock, Target, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { QuizHistory } from "@/types/quiz";
import { cn } from "@/lib/utils";

interface QuizHistoryModalProps {
  quizId: number | null;
  quizTitle?: string;
  quizHistory: QuizHistory[] | any;
  onClose: () => void;
}

export const QuizHistoryModal: React.FC<QuizHistoryModalProps> = ({
  quizId,
  quizTitle,
  quizHistory,
  onClose,
}) => {
  const historyArray = Array.isArray(quizHistory)
    ? quizHistory
    : quizHistory?.data || [];

  const recentAttempts = historyArray
    .filter((h: any) => {
      const hId = String(h.quizId || h.quiz_id || h.id_quiz || h.quiz?.id || "");
      return hId === String(quizId);
    })
    .sort(
      (a: any, b: any) =>
        new Date(b.completedAt || b.created_at).getTime() -
        new Date(a.completedAt || a.created_at).getTime()
    )
    .slice(0, 5);

  return (
    <Dialog open={!!quizId} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="
          w-[95vw]
          max-w-md
          h-[90vh]
          sm:h-auto
          sm:max-h-[85vh]
          p-0
          flex
          flex-col
          overflow-hidden
          rounded-3xl
          border-none
          shadow-2xl
        "
      >
        {/* HEADER (fixed) */}
        <div className="shrink-0 bg-[#FFB800] px-4 py-4 sm:px-6 sm:py-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-lg sm:text-2xl font-black italic">
              <ChartSpline className="w-6 h-6 sm:w-8 sm:h-8" />
              HISTORIQUE
            </DialogTitle>
            {quizTitle && (
              <p className="text-[10px] sm:text-sm font-semibold uppercase italic truncate">
                {quizTitle}
              </p>
            )}
          </DialogHeader>
        </div>

        {/* CONTENT (scrollable) */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-3 sm:px-5 py-4 sm:py-6 bg-white">
          {recentAttempts.length ? (
            <div className="space-y-3">
              {recentAttempts.map((attempt: any, idx: number) => {
                const rawScore = attempt.score ?? attempt.result_score ?? 0;
                const scorePercent = rawScore > 1
                  ? Math.round(rawScore)
                  : Math.round(rawScore * 100);
                const isSuccess = scorePercent >= 70;
                const correct = attempt.correctAnswers ?? attempt.correct_answers ?? 0;
                const total = attempt.totalQuestions ?? attempt.total_questions ?? 0;
                const time = attempt.timeSpent ?? attempt.time_spent ?? attempt.duration;
                const date = attempt.completedAt ?? attempt.completed_at ?? attempt.created_at;

                return (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-gray-50 hover:bg-white border border-gray-100 hover:border-yellow-300/40 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center",
                          isSuccess
                            ? "bg-green-100 text-green-600"
                            : "bg-orange-100 text-orange-600"
                        )}
                      >
                        <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <p className="text-xl sm:text-2xl font-black leading-none">
                          {correct/5*100}%
                        </p>
                        <p className="text-[9px] sm:text-[11px] text-gray-400 font-medium">
                          {date
                            ? new Date(date).toLocaleString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                            : "-"}
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col justify-between sm:items-end text-xs font-bold">
                      <div className="flex items-center gap-1 text-yellow-700">
                        <Target className="w-3 h-3" />
                        {correct}/5
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-gray-500 italic">
                        <Clock className="w-3 h-3" />
                        {Number.isFinite(time)
                          ? `${Math.floor(time / 60)}m ${time % 60}s`
                          : "-"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-14 text-center gap-3">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center">
                <Lock className="w-9 h-9 text-gray-300" />
              </div>
              <h3 className="font-black italic uppercase text-lg">
                Aucune tentative
              </h3>
              <p className="text-gray-400 text-sm italic">
                Lance un quiz pour voir tes scores ici
              </p>
            </div>
          )}
        </div>

        {/* FOOTER (fixed) */}
        <div className="shrink-0 px-4 pb-4 bg-white">
          <Button
            onClick={onClose}
            className="w-full sm:w-1/3 mx-auto block bg-white text-black border-2 border-black hover:bg-gray-50 h-10 sm:h-12 rounded-xl font-black italic uppercase tracking-widest"
          >
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuizHistoryModal;