import React from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Zap, Star, TrendingUp } from "lucide-react";

interface LevelUnlockIndicatorProps {
  userPoints: number;
  className?: string;
}

export function LevelUnlockIndicator({ userPoints, className }: LevelUnlockIndicatorProps) {
  const levels = [
    { name: "Débutant", threshold: 0, icon: Sparkles, color: "#10B981" },
    { name: "Intermédiaire", threshold: 50, icon: Zap, color: "#F59E0B" },
    { name: "Avancé", threshold: 100, icon: Star, color: "#EF4444" },
  ];

  const getUnlockedLevel = () => {
    if (userPoints >= 100) return 3;
    if (userPoints >= 50) return 2;
    return 1;
  };

  const unlockedCount = getUnlockedLevel();
  const nextThreshold = unlockedCount === 1 ? 50 : unlockedCount === 2 ? 100 : null;
  const progressToNext = nextThreshold 
    ? Math.min(100, ((userPoints - (nextThreshold === 50 ? 0 : 50)) / (nextThreshold - (nextThreshold === 50 ? 0 : 50))) * 100) 
    : 100;

  return (
    <div className={cn("bg-white/60 backdrop-blur-sm border border-gray-100 rounded-2xl p-3 sm:p-4 shadow-sm", className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#FFB800]" />
          <span className="text-xs font-bold uppercase text-gray-600">Niveaux Débloqués</span>
        </div>
  
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {levels.map((level) => {
          const isUnlocked = userPoints >= level.threshold;
          const Icon = level.icon;
          
          return (
            <div 
              key={level.name} 
              className={cn(
                "flex-1 flex flex-col items-center p-2 sm:p-3 rounded-xl transition-all duration-300",
                isUnlocked 
                  ? "bg-white shadow-md border border-gray-50" 
                  : "bg-gray-50 opacity-50 grayscale"
              )}
            >
              <div 
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1.5",
                  isUnlocked ? "shadow-lg" : "bg-gray-200"
                )}
                style={{ backgroundColor: isUnlocked ? level.color : undefined }}
              >
                <Icon className={cn("w-4 h-4 sm:w-5 sm:h-5", isUnlocked ? "text-white" : "text-gray-400")} />
              </div>
              <span className={cn(
                "text-[9px] sm:text-[10px] font-bold uppercase tracking-tight",
                isUnlocked ? "text-gray-700" : "text-gray-400"
              )}>
                {level.name}
              </span>
              <span className={cn(
                "text-[8px] font-medium mt-0.5",
                isUnlocked ? "text-green-500" : "text-gray-300"
              )}>
                {isUnlocked ? "Débloqué ✓" : `${level.threshold} pts`}
              </span>
            </div>
          );
        })}
      </div>

      {nextThreshold && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] text-gray-500 font-medium">Prochain niveau</span>
            <span className="text-[9px] text-gray-400 font-bold">{userPoints} / {nextThreshold} pts</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#FFB800] to-[#FFD700] rounded-full transition-all duration-500"
              style={{ width: `${progressToNext}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
