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
import { getCategoryConfig } from "@/utils/quizColors";
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
  const categoryName = (quiz as any).formations?.[0]?.categorie || (quiz as any).formation?.categorie || quiz.categorie || "Formation";
  const categoryConfig = getCategoryConfig(categoryName);

  return (
    <div
      onClick={isPlayable ? onClick : undefined}
      className={cn(
        "relative flex items-center p-3 sm:p-5 bg-white border rounded-[24px] shadow-sm transition-all duration-300 w-full max-w-[360px] sm:max-w-[420px]",
        isPlayed ? "border-[#FFB800]/30 shadow-yellow-50/50" : "border-gray-100",
        isPlayable && !isPlayed ? `ring-2 ring-[#FFB800]/10` : "",
        isPlayable && !isLocked ? "hover:shadow-md cursor-pointer hover:translate-y-[-2px]" : "opacity-75 cursor-not-allowed",
        isLocked && "bg-gray-50/50 grayscale-[0.8]"
      )}
      style={isPlayable && !isPlayed ? { 
        borderColor: `${categoryConfig.color}40`, 
        boxShadow: `0 4px 12px ${categoryConfig.color}15` 
      } : {}}
    >
      {/* Icon Section */}
      <div className={cn(
        "flex-shrink-0 w-14 h-14 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-inner mr-4 sm:mr-6 transition-transform duration-500",
        isPlayed ? "scale-105 shadow-lg" : 
        isPlayable ? "animate-pulse" : 
        "bg-gray-200"
      )}
      style={{
        backgroundColor: isPlayed || isPlayable ? categoryConfig.color : '#E5E7EB'
      }}>
        {isPlayed ? (
          <Trophy className="w-7 h-7 sm:w-10 sm:h-10 text-white drop-shadow-sm" />
        ) : isPlayable ? (
          <Star className="w-7 h-7 sm:w-10 sm:h-10 text-white fill-white" />
        ) : (
          <Lock className="w-7 h-7 sm:w-10 sm:h-10 text-gray-400" />
        )}
      </div>

      {/* Content Section */}
      <div className="flex-grow min-w-0 pr-8">
        <div className="flex items-center gap-2 mb-1.5">
          <h3 className={cn(
            "text-base sm:text-lg font-bold tracking-tight leading-tight",
            isLocked ? "text-gray-400" : "text-gray-900"
          )}>
            {quiz.titre}
          </h3>
          {isLocked && <Lock className="w-4 h-4 text-gray-400" />}
        </div>
        
        <div className="flex flex-col gap-1 mb-3">
          <div className="flex items-center gap-1.5 text-gray-500 text-xs sm:text-sm font-medium">
            <GraduationCap className="w-4 h-4 text-gray-400" />
            <span className="truncate">{categoryName}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400 text-[10px] sm:text-xs">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{quiz.niveau || "Débutant"}</span>
          </div>
        </div>

        {/* Historique Button */}
        {isPlayed && (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onHistoryClick(e);
            }}
            className="h-9 px-4 text-xs rounded-xl bg-white text-[#FFB800] border-[#FFB800]/40 font-bold hover:bg-[#FFB800]/5 flex items-center gap-2 transition-colors"
          >
            <History className="w-4 h-4" />
            Historique
          </Button>
        )}
      </div>

      {/* Chevron Arrow */}
      {(isPlayable || isPlayed) && !isLocked && (
        <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 text-gray-300">
          <ChevronRight className="w-6 h-6" />
        </div>
      )}
    </div>
  );
};
