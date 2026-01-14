import React from "react";
import { 
  Trophy, 
  History, 
  ChevronRight, 
  GraduationCap, 
  TrendingUp 
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
  return (
    <div
      onClick={isPlayable ? onClick : undefined}
      className={cn(
        "relative flex items-center p-3 sm:p-4 bg-white border border-[#FFD700]/30 rounded-[20px] shadow-sm transition-all duration-300 w-full max-w-[340px] sm:max-w-[400px]",
        isPlayable ? "hover:shadow-md cursor-pointer hover:translate-y-[-2px]" : "opacity-70 cursor-not-allowed"
      )}
    >
      {/* Trophy Icon Section */}
      <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#FFD700] flex items-center justify-center shadow-inner mr-3 sm:mr-4">
        <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
      </div>

      {/* Content Section */}
      <div className="flex-grow min-w-0 pr-6">
        <h3 className="text-sm sm:text-base font-bold text-[#333] truncate mb-1">
          {quiz.titre}
        </h3>
        
        <div className="flex flex-col gap-0.5 mb-2">
          <div className="flex items-center gap-1.5 text-gray-400 text-[10px] sm:text-xs">
            <GraduationCap className="w-3 h-3" />
            <span className="truncate">{quiz.categorie || "Excel"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400 text-[10px] sm:text-xs">
            <TrendingUp className="w-3 h-3" />
            <span>{quiz.niveau || "Débutant"}</span>
          </div>
        </div>

        {/* Historique Button */}
        {(isPlayed || isPlayable) && (
          <Button
            variant="outline"
            size="sm"
            onClick={onHistoryClick}
            className="h-7 px-3 text-[10px] sm:text-xs rounded-full border-[#FFD700] text-[#FFB800] hover:bg-[#FFD700]/10 flex items-center gap-1.5"
          >
            <History className="w-3.5 h-3.5" />
            Historique
          </Button>
        )}
      </div>

      {/* Chevron Arrow */}
      <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-300">
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>

      {/* Ribbon for active/unlocked? Not in design but helpful */}
    </div>
  );
};
