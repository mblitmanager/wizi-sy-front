import React from 'react';
import { User } from '@/types';
import { UserProgress } from '@/types/quiz';
import { Award, Star, Flame, BarChart2 } from 'lucide-react';

interface MinimalAchievement {
    id: string | number;
    name?: string;
}

interface UserStatsProps {
    user: User | null;
    userProgress?: UserProgress | null;
    achievements?: MinimalAchievement[];
}

const UserStats: React.FC<UserStatsProps> = ({ user, userProgress, achievements = [] }) => {
    const totalPoints =
        userProgress?.totalPoints ||
        userProgress?.total_points ||
        userProgress?.points ||
        userProgress?.totalScore ||
        user?.points ||
        0;

    const level = Math.max(1, Math.floor(totalPoints / 10) + 1);
    const progressToNextLevel = ((totalPoints % 10) / 10) * 100;
    const pointsToNext = 20 - (totalPoints % 20);
    const badgesCount = achievements.length;
    const streak = userProgress?.current_streak || userProgress?.currentStreak || 0;

    const stats = [
        {
            icon: <Award className="h-4 w-4" />,
            color: 'text-indigo-500',
            bg: 'bg-indigo-50 dark:bg-indigo-900/20',
            label: 'Niveau actuel',
            value: String(level),
            sub: `${pointsToNext} pts pour le niveau ${level + 1}`,
            progress: progressToNextLevel,
            progressColor: 'bg-indigo-500',
        },
        {
            icon: <Star className="h-4 w-4" />,
            color: 'text-amber-500',
            bg: 'bg-amber-50 dark:bg-amber-900/20',
            label: 'Badges obtenus',
            value: String(badgesCount),
            sub:
                badgesCount > 0
                    ? `${badgesCount} badge${badgesCount > 1 ? 's' : ''} débloqué${badgesCount > 1 ? 's' : ''}`
                    : 'Aucun badge pour le moment',
            progress: null,
            progressColor: '',
        },
        ...(streak > 0
            ? [
                  {
                      icon: <Flame className="h-4 w-4" />,
                      color: 'text-orange-500',
                      bg: 'bg-orange-50 dark:bg-orange-900/20',
                      label: 'Série actuelle',
                      value: `${streak}j`,
                      sub: 'Continuez pour battre votre record !',
                      progress: null,
                      progressColor: '',
                  },
              ]
            : []),
    ];

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <BarChart2 className="h-4 w-4 text-blue-500" />
                </div>
                <h2 className="text-sm font-medium text-gray-800 dark:text-white">
                    Mes statistiques
                </h2>
            </div>

            {/* Stats */}
            <div className="p-4 space-y-3">
                {stats.map((s, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50"
                    >
                        <div
                            className={`w-8 h-8 rounded-lg ${s.bg} ${s.color} flex items-center justify-center flex-shrink-0`}
                        >
                            {s.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {s.label}
                                </span>
                                <span className={`text-sm font-medium ${s.color}`}>{s.value}</span>
                            </div>
                            {s.progress !== null && (
                                <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-1">
                                    <div
                                        className={`h-1.5 rounded-full ${s.progressColor} transition-all duration-500`}
                                        style={{ width: `${s.progress}%` }}
                                    />
                                </div>
                            )}
                            <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                                {s.sub}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserStats;
