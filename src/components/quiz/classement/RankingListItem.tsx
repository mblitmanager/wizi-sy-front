import React from 'react';
import type { LeaderboardEntry } from '@/types/quiz';

interface RankingListItemProps {
    ranking: LeaderboardEntry;
    isCurrentUser?: boolean;
    highlight?: boolean;
    isSmallScreen?: boolean;
}

const getRankColor = (rank?: number) => {
    if (!rank) return 'bg-gray-100 text-gray-600';
    if (rank <= 3) return 'bg-gradient-to-br from-amber-400 to-amber-600 text-white';
    if (rank <= 10) return 'bg-gradient-to-br from-blue-400 to-blue-600 text-white';
    return 'bg-gray-200 text-gray-700';
};

const formatName = (prenom?: string, nom?: string) => {
    if (!prenom && !nom) return '';
    const initial = nom?.trim().charAt(0);
    const suffix = initial ? ` ${initial.toUpperCase()}.` : '';
    return `${prenom || ''}${suffix}`.trim();
};

export function RankingListItem({
    ranking,
    isCurrentUser = false,
    highlight = false,
    isSmallScreen = false,
}: RankingListItemProps) {
    return (
        <div
            className={`
        flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg transition-all
        ${isCurrentUser ? 'bg-amber-50 border-2 border-amber-200' : 'bg-white border border-gray-200'}
        ${highlight ? 'shadow-lg ring-2 ring-amber-300' : 'hover:shadow-md'}
      `}
        >
            {/* Badge de rang */}
            <div
                className={`
          flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
          font-bold text-sm shadow-sm ${getRankColor(ranking.rang)}
        `}
            >
                {ranking.rang}
            </div>

            {/* Avatar + Info */}
            <div className="flex-1 flex items-center gap-3 min-w-0">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    {ranking.avatar || ranking.image ? (
                        <img
                            src={ranking.avatar || ranking.image}
                            alt={ranking.firstname}
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-gray-200"
                        />
                    ) : (
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center">
                            <span className="text-gray-500 text-lg font-semibold">
                                {ranking.firstname?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>

                {/* Nom + Formateurs */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <p
                            className={`font-semibold text-sm sm:text-base truncate ${isCurrentUser ? 'text-amber-800' : 'text-gray-900'
                                }`}
                        >
                            {formatName(ranking.firstname, ranking.name)}
                        </p>
                        {isCurrentUser && (
                            <span className="flex-shrink-0 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                Vous
                            </span>
                        )}
                    </div>

                    {/* Formateurs */}
                    {ranking.formateurs && ranking.formateurs.length > 0 && (
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                            {ranking.formateurs.map((f) => {
                                const initial = f.nom?.charAt(0).toUpperCase() || '';
                                const suffix = initial ? ` ${initial}.` : '';
                                return `${f.prenom}${suffix}`;
                            }).join(', ')}
                        </p>
                    )}
                </div>
            </div>

            {/* Quiz joués (desktop uniquement) */}
            {!isSmallScreen && (
                <div className="hidden sm:flex flex-col items-center px-4">
                    <p className="text-lg font-bold text-gray-900">{ranking.quizCount || 0}</p>
                    <p className="text-xs text-gray-500">quiz</p>
                </div>
            )}

            {/* Points */}
            <div className="flex-shrink-0 flex flex-col items-end sm:items-center sm:px-4">
                <p className="text-lg sm:text-xl font-bold text-amber-600">
                    {ranking.score}
                </p>
                <p className="text-xs text-gray-500">pts</p>
            </div>
        </div>
    );
}
