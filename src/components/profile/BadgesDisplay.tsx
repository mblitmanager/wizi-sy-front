import React, { useState } from "react";
import {
  Medal,
  Trophy,
  Flame,
  BrainCircuit,
  Star,
  Zap,
  Lock,
  CheckCircle,
} from "lucide-react";

interface Badge {
  id: number | string;
  name: string;
  description?: string;
  icon?: string;
  level?: "bronze" | "argent" | "or" | "platine";
  type?: string;
  unlockedAt?: string;
}

interface BadgesDisplayProps {
  badges: Badge[];
  loading?: boolean;
  className?: string;
}

const BadgeIcon = ({ type, level }: { type?: string; level?: string }) => {
  const size = 24;
  const baseClass = "mx-auto mb-3 p-3 rounded-full";

  const getLevelClass = () => {
    switch (level) {
      case "bronze":
        return "bg-amber-100 text-amber-600";
      case "argent":
        return "bg-gray-100 text-gray-600";
      case "or":
        return "bg-yellow-100 text-yellow-600";
      case "platine":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-purple-100 text-purple-600";
    }
  };

  switch (type) {
    case "connexion_serie":
      return (
        <Flame className={`${baseClass} ${getLevelClass()}`} size={size} />
      );
    case "points_total":
      return (
        <Trophy className={`${baseClass} ${getLevelClass()}`} size={size} />
      );
    case "palier":
      return (
        <Medal className={`${baseClass} ${getLevelClass()}`} size={size} />
      );
    case "quiz":
      return (
        <BrainCircuit
          className={`${baseClass} ${getLevelClass()}`}
          size={size}
        />
      );
    case "premium":
      return <Star className={`${baseClass} ${getLevelClass()}`} size={size} />;
    case "challenge":
      return <Zap className={`${baseClass} ${getLevelClass()}`} size={size} />;
    case "exclusif":
      return <Lock className={`${baseClass} ${getLevelClass()}`} size={size} />;
    default:
      return (
        <CheckCircle
          className={`${baseClass} ${getLevelClass()}`}
          size={size}
        />
      );
  }
};

const BadgeLevel = ({ level }: { level?: string }) => {
  if (!level) return null;

  const levelMap = {
    bronze: { text: "Bronze", color: "bg-amber-100 text-amber-800" },
    argent: { text: "Argent", color: "bg-gray-100 text-gray-800" },
    or: { text: "Or", color: "bg-yellow-100 text-yellow-800" },
    platine: { text: "Platine", color: "bg-blue-100 text-blue-800" },
  };

  const levelInfo = levelMap[level as keyof typeof levelMap] || levelMap.bronze;

  return (
    <span
      className={`text-xs font-semibold px-2 py-1 rounded-full ${levelInfo.color}`}>
      {levelInfo.text}
    </span>
  );
};

const BadgesDisplay: React.FC<BadgesDisplayProps> = ({
  badges,
  loading,
  className,
}) => {
  const isCompact = !!className && className.includes("compact-view");
  const [expanded, setExpanded] = useState(false);

  const visibleBadges = expanded ? badges : badges.slice(0, 3);
  const canToggle = badges.length > 3;

  return (
    <div className={`${className || ""}`}>
      {loading ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 h-20 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : badges && badges.length > 0 ? (
        <>
          {!isCompact && (
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              {badges.length} badge{badges.length > 1 ? "s" : ""} obtenu
              {badges.length > 1 ? "s" : ""}
            </p>
          )}

          <div
            className={`grid ${isCompact
              ? "grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2"
              : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
              }`}>
            {visibleBadges.map((badge) => (
              <div
                key={badge.id}
                className={`group relative bg-white dark:bg-gray-700 rounded-lg ${isCompact ? "p-2" : "p-3"
                  } shadow-xs hover:shadow-sm transition-all duration-200 border border-gray-100 dark:border-gray-600`}>
                <div className="flex flex-col items-center">
                  <BadgeIcon type={badge.type} level={badge.level} />
                  <h4
                    className={`font-medium ${isCompact ? "text-xs text-center line-clamp-1" : "text-sm"
                      } text-gray-800 dark:text-white mt-1`}>
                    {badge.name}
                  </h4>
                </div>
              </div>
            ))}
          </div>

          {canToggle && (
            <div className="mt-2">
              <button
                onClick={() => setExpanded((v) => !v)}
                className="text-blue-600 dark:text-blue-400 text-sm underline">
                {expanded ? "Voir moins" : "Voir plus"}
              </button>
            </div>
          )}
        </>
      ) : (
        <div
          className={`text-center py-4 ${isCompact ? "px-2" : "px-4"
            } bg-gray-50 dark:bg-gray-700/50 rounded-lg`}>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {isCompact ? "Aucun badge" : "Aucun badge obtenu pour le moment"}
          </p>
        </div>
      )}
    </div>
  );
};

export default BadgesDisplay;
