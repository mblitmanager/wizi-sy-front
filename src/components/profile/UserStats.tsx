import React from "react";
import { User } from "@/types";
import { UserProgress } from "@/types/quiz";
import { Card, div } from "@/components/ui/card";
import { Trophy, Award, Flame, Star, BarChart2 } from "lucide-react";

interface UserStatsProps {
  user: User | null;
  userProgress?: UserProgress | null;
  achievements?: any[];
}

const UserStats: React.FC<UserStatsProps> = ({ user, userProgress, achievements = [] }) => {
  const totalPoints =
    user?.points ||
    userProgress?.total_points ||
    userProgress?.totalPoints ||
    userProgress?.points ||
    userProgress?.totalScore ||
    0;

  // Calculate level based on totalPoints (20 points per level)
  const level = Math.max(1, Math.floor(totalPoints / 20) + 1);

  // Nombre de badges débloqués (succès)
  const badgesCount = achievements.length;
  const streak =
    userProgress?.current_streak || userProgress?.currentStreak || 0;

  return (
    <section className="mb-6 px-2">
      <h2 className="text-xl sm:text-2xl font-bold font-montserrat text-gray-800 dark:text-white mb-4 sm:mb-6 flex items-center">
        <BarChart2 className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
        Mes Statistiques
      </h2>
      <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full mx-auto">
        {/* Carte Points */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 p-2 rounded-lg shadow-sm border border-amber-100 dark:border-amber-800/50 hover:shadow-md transition-shadow duration-300">
          <div className="flex flex-col items-center">
            <div className="p-1.5 bg-amber-100 dark:bg-amber-800/40 rounded-full mb-1">
              <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-lg sm:text-xl font-bold font-nunito text-amber-800 dark:text-amber-200">
              {totalPoints}
            </div>
            <div className="text-xs sm:text-sm font-medium text-amber-600 dark:text-amber-400">
              Points
            </div>
          </div>
        </div>

        {/* Carte Niveau */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-2 rounded-lg shadow-sm border border-blue-100 dark:border-blue-800/50 hover:shadow-md transition-shadow duration-300">
          <div className="flex flex-col items-center">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-800/40 rounded-full mb-1">
              <Award className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-lg sm:text-xl font-bold font-nunito text-blue-800 dark:text-blue-200">
              {level}
            </div>
            <div className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400">
              Niveau
            </div>
          </div>
        </div>

        {/* Carte Badges */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-2 rounded-lg shadow-sm border border-purple-100 dark:border-purple-800/50 hover:shadow-md transition-shadow duration-300">
          <div className="flex flex-col items-center">
            <div className="p-1.5 bg-purple-100 dark:bg-purple-800/40 rounded-full mb-1">
              <Star className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-lg sm:text-xl font-bold font-nunito text-purple-800 dark:text-purple-200">
              {badgesCount}
            </div>
            <div className="text-xs sm:text-sm font-medium text-purple-600 dark:text-purple-400">
              Badges
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserStats;
