import React from "react";
import { ChartSpline, Lock, Trophy, Clock, Target, X } from "lucide-react";
                return (
                  <div
                    key={idx}
                    className="group relative p-3 sm:p-4 border border-gray-100 rounded-2xl bg-gray-50/50 hover:bg-white hover:border-[#FFD700]/30 hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
                  >
} from "@/components/ui/dialog";
                      <div className={cn(
                        "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-sm",
                        isSuccess ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"
                      )}>
interface QuizHistoryModalProps {
  quizId: number | null;
  quizTitle?: string;
  quizHistory: QuizHistory[];
  onClose: () => void;
}
                        <p className="text-[9px] sm:text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                          {date ? new Date(date).toLocaleString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          }) : "-"}
                        </p>
    ? quizHistory 
    : (quizHistory as any)?.data || [];
                    
                    <div className="w-full sm:w-auto text-right space-y-0.5 sm:space-y-1 mt-3 sm:mt-0">
    ?.filter((h: any) => {
      const hId = String(h.quizId || h.quiz_id || h.id_quiz || h.quiz?.id || "");
      return hId === String(quizId);
    })
    ?.sort(
      (a: any, b: any) =>
                        <span>{time ? `${Math.floor(time / 60)}m ${time % 60}s` : "-"}</span>
    )
    ?.slice(0, 5);

  return (
    <Dialog open={!!quizId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-md md:max-w-lg lg:max-w-xl rounded-[24px] p-0 overflow-hidden border-none shadow-2xl mx-auto">
        <div className="bg-[#FFB800] p-4 sm:p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl sm:text-2xl font-black italic tracking-tight">
              <ChartSpline className="w-6 h-6 sm:w-8 sm:h-8 drop-shadow-md" />
              <span>HISTORIQUE</span>
            </DialogTitle>
            {quizTitle && (
              <p className="text-white/90 font-medium mt-1 truncate uppercase italic text-xs sm:text-sm">
                {quizTitle}
              </p>
            )}
          </DialogHeader>
        </div>

        <div className="px-3 py-3 sm:px-4 sm:py-6 bg-white max-h-[70vh] overflow-y-auto">
          {recentAttempts && recentAttempts.length > 0 ? (
            <div className="space-y-3 sm:space-y-4 w-full">
              {recentAttempts.map((attempt, idx) => {
                const rawScore = attempt.score ?? attempt.result_score ?? 0;
                const scorePercent = rawScore > 1 ? Math.round(rawScore) : Math.round(rawScore * 100);
                const isSuccess = scorePercent >= 70;
                const correct = attempt.correctAnswers ?? attempt.correct_answers ?? 0;
                const total = attempt.totalQuestions ?? attempt.total_questions ?? 0;
                const time = attempt.timeSpent ?? attempt.time_spent ?? 0;
                const date = attempt.completedAt ?? attempt.completed_at ?? attempt.created_at;

                return (
                  <div 
                    key={idx} 
                    className="group relative p-3 sm:p-4 border border-gray-100 rounded-2xl bg-gray-50/50 hover:bg-white hover:border-[#FFD700]/30 hover:shadow-md transition-all duration-300 flex justify-between items-center"
                  >
                    <div className="flex gap-3 sm:gap-4 items-center">
                      <div className={cn(
                        "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-sm",
                        isSuccess ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"
                      )}>
                        <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <p className="font-black text-lg sm:text-xl md:text-2xl text-gray-800 leading-none mb-1">
                          {scorePercent}%
                        </p>
                        <p className="text-[9px] sm:text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                          {date ? new Date(date).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          }) : "-"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-0.5 sm:space-y-1">
                      <div className="flex items-center justify-end gap-1.5 text-xs sm:text-xs font-bold text-[#B8860B]">
                        <Target className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span>{correct}/{total}</span>
                      </div>
                      <div className="flex items-center justify-end gap-1.5 text-[9px] sm:text-[10px] text-gray-500 font-semibold italic">
                        <Clock className="w-2.5 h-2.5 sm:w-3 h-3" />
                        <span>{Math.floor(time / 60)}m {time % 60}s</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 sm:py-16 text-center space-y-4">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center">
                  <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-gray-200" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-gray-900 font-black italic uppercase tracking-tighter text-lg sm:text-xl">
                  AUCUNE TENTATIVE
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm font-medium italic">
                  Relevez le défi pour voir vos scores ici !
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="px-3 sm:px-6 pt-0 pb-4 bg-white">
          <Button 
            onClick={onClose}
            className="box-border w-full bg-white text-black border-2 border-black hover:bg-gray-50 h-9 sm:h-12 rounded-xl text-sm sm:text-base font-black italic uppercase tracking-widest transition-all duration-300 active:scale-95"
          >
            FERMER
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
