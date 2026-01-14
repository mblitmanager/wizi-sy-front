import React from "react";
import { 
  Trophy, 
  History, 
  ChevronRight, 
  GraduationCap, 
  TrendingUp,
  Lock,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Quiz } from "@/types/quiz";
import { Button } from "../ui/button";

interface AdventureQuizCardProps {
  quiz: Quiz;
  isPlayable: boolean;
  isPlayed: boolean;
  onClick: () => void;
  onHistoryClick: (e: React.MouseEvent) => void;
}

export const AdventureQuizCard: React.FC<AdventureQuizCardProps> = ({
  quiz,
  isPlayable,
  isPlayed,
  onClick,
  onHistoryClick,
}) => {
  const isLocked = !isPlayable && !isPlayed;

  return (
    <div
      onClick={isPlayable ? onClick : undefined}
      className={cn(
        "relative flex items-center p-3 sm:p-4 bg-white border rounded-[20px] shadow-sm transition-all duration-300 w-full max-w-[340px] sm:max-w-[400px]",
        isPlayed ? "border-[#FFD700]/50 shadow-yellow-100/50" : "border-gray-100",
        isPlayable && !isPlayed ? "border-orange-200 ring-2 ring-orange-50" : "",
        isPlayable && !isLocked ? "hover:shadow-md cursor-pointer hover:translate-y-[-2px]" : "opacity-75 cursor-not-allowed",
        isLocked && "bg-gray-50/50 grayscale-[0.8]"
      )}
    >
      {/* Icon Section */}
      <div className={cn(
        "flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-inner mr-3 sm:mr-4 transition-transform duration-500",
        isPlayed ? "bg-[#B8860B] scale-105" : 
        isPlayable ? "bg-blue-600 animate-pulse" : 
        "bg-gray-200"
      )}>
        {isPlayed ? (
          <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-sm" />
        ) : isPlayable ? (
          <Star className="w-6 h-6 sm:w-8 sm:h-8 text-white fill-white" />
        ) : (
          <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
        )}
      </div>

      {/* Content Section */}
      <div className="flex-grow min-w-0 pr-6">
        <div className="flex items-center gap-2 mb-1">
          <h3 className={cn(
            "text-sm sm:text-base font-black italic tracking-tight truncate uppercase",
            isLocked ? "text-gray-400" : "text-gray-800"
          )}>
            {quiz.titre}
          </h3>
          {isLocked && <Lock className="w-3 h-3 text-gray-400" />}
        </div>
        
        <div className="flex flex-col gap-0.5 mb-2">
          <div className="flex items-center gap-1.5 text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-3 h-3" />
            <span className="truncate">{quiz.categorie || "Formation"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400 text-[10px] sm:text-xs italic">
            <TrendingUp className="w-3 h-3" />
            <span>{quiz.niveau || "Débutant"}</span>
          </div>
        </div>

        {/* Historique Button */}
        {isPlayed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onHistoryClick}
            className="h-7 px-3 text-[10px] sm:text-xs rounded-full bg-gray-50 text-[#B8860B] font-black italic uppercase tracking-widest hover:bg-[#FFD700]/10 flex items-center gap-1.5 border border-[#FFD700]/20"
          >
            <History className="w-3.5 h-3.5" />
            Historique
          </Button>
        )}
      </div>

      {/* Chevron Arrow */}
      {isPlayable && (
        <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-[#FFD700]/50">
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      )}
    </div>
  );
};
