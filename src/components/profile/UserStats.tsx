import React from "react";
import { User } from "@/types";
import { UserProgress } from "@/types/quiz";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Award, Flame, Star, BarChart2 } from "lucide-react";

interface UserStatsProps {
  user: User | null;
  userProgress?: UserProgress | null;
  achievements?: any[];
}

const UserStats: React.FC<UserStatsProps> = ({
  user,
  userProgress,
  achievements = [],
}) => {
  const totalPoints =
    user?.points ||
    userProgress?.total_points ||
    userProgress?.totalPoints ||
    userProgress?.points ||
    userProgress?.totalScore ||
    0;

  // Calculate level based on totalPoints (20 points per level)
  const level = Math.max(1, Math.floor(totalPoints / 20) + 1);
  const progressToNextLevel = ((totalPoints % 20) / 20) * 100;

  // Nombre de badges débloqués (succès)
  const badgesCount = achievements.length;
  const streak =
    userProgress?.current_streak || userProgress?.currentStreak || 0;

  return (
    <section className="mb-8">
      <Card className="border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
              <BarChart2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Mes Statistiques
            </h2>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Niveau Card */}
            <Card className="border border-gray-100 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full">
                    <Award className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Niveau actuel
                      </h3>
                      <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                        {level}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${progressToNextLevel}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {20 - (totalPoints % 20)} points pour le niveau{" "}
                      {level + 1}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Badges Card */}
            <Card className="border border-gray-100 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full">
                    <Star className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Badges obtenus
                      </h3>
                      <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                        {badgesCount}
                      </span>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {badgesCount > 0
                          ? `Vous avez débloqué ${badgesCount} badge${
                              badgesCount > 1 ? "s" : ""
                            }`
                          : "Aucun badge obtenu pour le moment"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats (Streak) */}
          {streak > 0 && (
            <Card className="border border-gray-100 dark:border-gray-700 rounded-lg mt-4 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                    <Flame className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Série actuelle
                      </h3>
                      <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                        {streak} jour{streak > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Continuez pour battre votre record !
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default UserStats;
