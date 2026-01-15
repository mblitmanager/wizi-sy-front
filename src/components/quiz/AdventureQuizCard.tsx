import { motion } from "framer-motion";

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
    <motion.div
      whileHover={isPlayable ? { y: -5, scale: 1.02 } : {}}
      whileTap={isPlayable ? { scale: 0.98 } : {}}
      onClick={isPlayable ? onClick : undefined}
      className={cn(
        "relative flex items-center p-4 sm:p-6 bg-white border rounded-[32px] shadow-sm transition-all duration-300 w-full max-w-[400px]",
        isPlayed ? "border-[#FFB800]/20 shadow-xl shadow-yellow-50/50" : "border-gray-100",
        isPlayable && !isPlayed ? `ring-4 ring-[#FFB800]/5 border-[#FFB800]/20` : "",
        isPlayable && !isLocked ? "cursor-pointer" : "opacity-80 cursor-not-allowed",
        isLocked && "bg-gray-50/30 grayscale-[1]"
      )}
    >
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden rounded-[32px]">
        <svg width="100%" height="100%">
          <pattern id="pattern-quiz" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="currentColor" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#pattern-quiz)" />
        </svg>
      </div>

      {/* Icon Section */}
      <div className={cn(
        "flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-lg mr-4 sm:mr-6 relative overflow-hidden group",
        isPlayed ? "shadow-yellow-100" : isPlayable ? "shadow-blue-50" : "bg-gray-100"
      )}
      style={{
        background: isPlayed || isPlayable 
          ? `linear-gradient(135deg, ${categoryConfig.color}, ${categoryConfig.color}dd)` 
          : '#f3f4f6'
      }}>
        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        {isPlayed ? (
          <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-md" />
        ) : isPlayable ? (
          <Star className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white animate-pulse" />
        ) : (
          <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300" />
        )}
      </div>

      {/* Content Section */}
      <div className="flex-grow min-w-0 pr-6 relative">
        <div className="flex items-center gap-2 mb-1.5">
          <h3 className={cn(
            "text-base sm:text-xl font-black tracking-tight leading-tight uppercase italic",
            isLocked ? "text-gray-300" : "text-gray-900"
          )}>
            {quiz.titre}
          </h3>
        </div>
        
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div 
              className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter text-white italic"
              style={{ backgroundColor: isLocked ? '#d1d5db' : categoryConfig.color }}
            >
              {categoryName}
            </div>
            <div className="flex items-center gap-1 text-gray-400 text-[10px] uppercase font-black italic">
              <TrendingUp className="w-3 h-3" />
              <span>{quiz.niveau || "Débutant"}</span>
            </div>
          </div>
        </div>

        {/* Historique Button */}
        {isPlayed && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onHistoryClick(e);
              }}
              className="h-8 px-3 text-[10px] rounded-full bg-white text-gray-900 border-gray-200 font-black uppercase italic hover:bg-gray-50 flex items-center gap-1.5 transition-all shadow-sm"
            >
              <History className="w-3 h-3" />
              Historique
            </Button>
          </motion.div>
        )}
      </div>

      {/* Chevron Arrow / Status Indicator */}
      <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 flex flex-col items-center">
        {(isPlayable || isPlayed) && !isLocked ? (
           <div className={cn(
             "w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center bg-gray-50/50 group-hover:bg-white transition-colors",
             isPlayed ? "text-[#FFB800]" : "text-gray-300"
           )}>
             <ChevronRight className="w-5 h-5" />
           </div>
        ) : (
          <div className="w-8 h-8 rounded-full border border-gray-50 flex items-center justify-center bg-gray-50/30">
             <Lock className="w-4 h-4 text-gray-200" />
          </div>
        )}
      </div>
    </motion.div>
  );
};
