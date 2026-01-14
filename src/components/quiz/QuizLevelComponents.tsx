import React from 'react';
import { Lock, Star, TrendingUp } from 'lucide-react';

interface QuizLevelBadgeProps {
    totalPoints: number;
    accessibleLevels: string[];
    className?: string;
}

/**
 * Badge affichant le niveau actuel et les niveaux accessibles
 * 
 * @example
 * <QuizLevelBadge 
 *   total Points={75} 
 *   accessibleLevels={['debutant', 'intermediaire']} 
 * />
 */
export function QuizLevelBadge({ totalPoints, accessibleLevels, className = '' }: QuizLevelBadgeProps) {
    const getCurrentLevel = () => {
        if (totalPoints >= 100) return 'Expert';
        if (totalPoints >= 50) return 'Intermédiaire';
        return 'Débutant';
    };

    const levelColors = {
        'Débutant': 'bg-green-100 text-green-800 border-green-300',
        'Intermédiaire': 'bg-orange-100 text-orange-800 border-orange-300',
        'Expert': 'bg-red-100 text-red-800 border-red-300',
    };

    const currentLevel = getCurrentLevel();

    return (
        <div className={`inline-flex items-center gap-3 px-4 py-3 rounded-xl border-2 ${levelColors[currentLevel as keyof typeof levelColors]} ${className}`}>
            <div className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                <span className="font-bold text-lg">{totalPoints}</span>
                <span className="text-sm">points</span>
            </div>

            <div className="w-px h-6 bg-current opacity-30"></div>

            <div>
                <div className="text-xs font-medium opacity-75">Niveau actuel</div>
                <div className="font-bold">{currentLevel}</div>
            </div>
        </div>
    );
}

interface LockedLevelNoticeProps {
    nextLevel: string;
    pointsNeeded: number;
    className?: string;
}

/**
 * Notice indiquant le prochain niveau à débloquer
 * 
 * @example
 * <LockedLevelNotice 
 *   nextLevel="Expert" 
 *   pointsNeeded={25} 
 * />
 */
export function LockedLevelNotice({ nextLevel, pointsNeeded, className = '' }: LockedLevelNoticeProps) {
    return (
        <div className={`bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 ${className}`}>
            <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <Lock className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </div>

                <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                        Quiz {nextLevel} verrouillés
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                        Continuez à progresser pour débloquer les quiz de niveau {nextLevel}.
                    </p>

                    <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-blue-600">
                            Plus que <span className="font-bold text-lg">{pointsNeeded}</span> points
                        </span>
                        <span className="text-gray-500">pour débloquer ce niveau</span>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: '0%' }} // Sera calculé dynamiquement
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

interface AccessLevelIndicatorProps {
    level: 'debutant' | 'intermediaire' | 'expert';
    isAccessible: boolean;
    className?: string;
}

/**
 * Indicateur de niveau avec état accessible/verrouillé
 * 
 * @example
 * <AccessLevelIndicator level="expert" isAccessible={false} />
 */
export function AccessLevelIndicator({ level, isAccessible, className = '' }: AccessLevelIndicatorProps) {
    const levelConfig = {
        debutant: {
            label: 'Débutant',
            color: 'green',
            icon: '🌱',
        },
        intermediaire: {
            label: 'Intermédiaire',
            color: 'orange',
            icon: '🚀',
        },
        expert: {
            label: 'Expert',
            color: 'red',
            icon: '🏆',
        },
    };

    const config = levelConfig[level];

    return (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${isAccessible
                ? `bg-${config.color}-100 text-${config.color}-800 border border-${config.color}-300`
                : 'bg-gray-100 text-gray-400 border border-gray-200 opacity-50'
            } ${className}`}>
            <span className="text-lg">{config.icon}</span>
            <span className="font-medium text-sm">{config.label}</span>
            {!isAccessible && <Lock className="w-3 h-3 ml-1" />}
        </div>
    );
}
