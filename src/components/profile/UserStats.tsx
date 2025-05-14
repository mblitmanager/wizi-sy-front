import React from "react";
import { User } from "@/types";
import { UserProgress } from "@/types/quiz";
import { Card, div } from "@/components/ui/card";
import { Trophy, Award, Flame, Star } from "lucide-react";

interface UserStatsProps {
  user: User | null;
  userProgress?: UserProgress | null;
}

const UserStats: React.FC<UserStatsProps> = ({ user, userProgress }) => {
  const totalPoints =
    user?.points ||
    userProgress?.total_points ||
    userProgress?.totalPoints ||
    0;

  // Since badges and streak may not exist in the updated UserProgress, we'll provide fallbacks
  const badgesCount = 0; // Default to 0 since badges are not in our updated UserProgress
  const streak =
    userProgress?.current_streak || userProgress?.currentStreak || 0;

  return (
    <section className="mb-2">
      <h2 className="text-xl font-semibold mb-4 font-montserrat">
        Mes statistiques
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        <div>
          <div className="p-2 flex flex-col items-center justify-center">
            <Trophy className="h-6 w-6 text-yellow-500 mb-2" />
            <div className="text-xl font-bold font-nunito">{totalPoints}</div>
            <div className="text-xs text-gray-500 font-roboto">Points</div>
          </div>
        </div>
        <div>
          <div className="p-2 flex flex-col items-center justify-center">
            <Award className="h-6 w-6 text-blue-500 mb-2" />
            <div className="text-xl font-bold font-nunito">
              {user?.level || 1}
            </div>
            <div className="text-xs text-gray-500 font-roboto">Niveau</div>
          </div>
        </div>
        <div>
          <div className="p-2 flex flex-col items-center justify-center">
            <Flame className="h-6 w-6 text-red-500 mb-2" />
            <div className="text-xl font-bold font-nunito">{streak}</div>
            <div className="text-xs text-gray-500 font-roboto">
              Jours consécutifs
            </div>
          </div>
        </div>
        <div>
          <div className="p-2 flex flex-col items-center justify-center">
            <Star className="h-6 w-6 text-purple-500 mb-2" />
            <div className="text-xl font-bold font-nunito">{badgesCount}</div>
            <div className="text-xs text-gray-500 font-roboto">Badges</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserStats;
