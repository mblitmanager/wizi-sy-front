import React from "react";
import { ChartSpline, Lock, Trophy, Clock, Target } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { QuizHistory } from "@/types/quiz";
import { cn } from "@/lib/utils";

interface QuizHistoryModalProps {
  quizId: number | null;
  quizTitle?: string;
  quizHistory: QuizHistory[];
  onClose: () => void;
}

export const QuizHistoryModal: React.FC<QuizHistoryModalProps> = ({
  quizId,
  quizTitle,
  quizHistory,
  onClose
}) => {
  const recentAttempts = quizHistory
    ?.filter((h) => String(h.quizId || "") === String(quizId))
    ?.sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    )
    ?.slice(0, 5);

  return (
    <Dialog open={!!quizId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-[24px] p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-gradient-to-br from-[#FFD700] to-[#B8860B] p-6 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl font-black italic tracking-tight">
              <ChartSpline className="w-8 h-8 drop-shadow-md" />
              <span>HISTORIQUE</span>
            </DialogTitle>
            {quizTitle && (
              <p className="text-white/80 text-sm font-medium mt-1 truncate">
                {quizTitle}
              </p>
            )}
          </DialogHeader>
        </div>

        <div className="p-6 space-y-4 bg-white max-h-[60vh] overflow-y-auto">
          {recentAttempts && recentAttempts.length > 0 ? (
            recentAttempts.map((attempt, idx) => {
              const scorePercent = Math.round((attempt.score || 0) * 100);
              const isSuccess = scorePercent >= 70;

              return (
                <div 
                  key={idx} 
                  className="group relative p-4 border border-gray-100 rounded-2xl bg-gray-50/50 hover:bg-white hover:border-[#FFD700]/30 hover:shadow-md transition-all duration-300 flex justify-between items-center"
                >
                  <div className="flex gap-4 items-center">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center shadow-sm",
                      isSuccess ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"
                    )}>
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-black text-2xl text-gray-800 leading-none mb-1">
                        {scorePercent}%
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                        {new Date(attempt.completedAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-[#B8860B]">
                      <Target className="w-3.5 h-3.5" />
                      <span>{attempt.correctAnswers}/{attempt.totalQuestions}</span>
                    </div>
                    <div className="flex items-center justify-end gap-1.5 text-[10px] text-gray-500 font-semibold italic">
                      <Clock className="w-3 h-3" />
                      <span>{Math.floor((attempt.timeSpent || 0) / 60)}m {(attempt.timeSpent || 0) % 60}s</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-200">
                <Lock className="w-10 h-10 text-gray-200" />
              </div>
              <p className="text-gray-400 font-bold italic">AUCUNE TENTATIVE</p>
              <p className="text-xs text-gray-300 mt-1 uppercase tracking-tighter">Commence ton aventure maintenant</p>
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex justify-center">
           <button 
             onClick={onClose}
             className="text-xs font-black italic text-gray-400 hover:text-[#B8860B] transition-colors uppercase tracking-widest"
           >
             Fermer
           </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
