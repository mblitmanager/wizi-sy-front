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
    switch (rank) {
        case 1: return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg';
        case 2: return 'bg-gradient-to-br from-gray-300 to-gray-400 text-white shadow-lg';
        case 3: return 'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg';
        case 4: return 'bg-gradient-to-br from-gray-400 to-gray-500 text-white shadow-md';
        case 5: return 'bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-md';
        default: return 'bg-gray-200 text-gray-700';
    }
};

const formatName = (prenom?: string, nom?: string) => {
    if (!prenom && !nom) return '';
    const initial = nom?.trim().charAt(0);
    const suffix = initial ? ` ${initial.toUpperCase()}.` : '';
    return `${prenom || ''}${suffix}`.trim();
};

export const RankingListItem = React.memo(function RankingListItem({
    ranking,
    isCurrentUser = false,
    highlight = false,
    isSmallScreen = false,
}: RankingListItemProps) {
    const isTopRank = ranking.rang && ranking.rang <= 5;

    return (
        <div
            role="listitem"
            aria-label={`Position ${ranking.rang}: ${formatName(ranking.firstname, ranking.name)}, ${ranking.score} points`}
            aria-current={isCurrentUser ? "true" : undefined}
            tabIndex={0}
            className={`
        flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl 
        transition-all duration-300 ease-in-out
        hover:scale-[1.02] hover:-translate-y-1
        ${isCurrentUser ? 'bg-blue-50 border-2 border-blue-400 shadow-md animate-pulse-subtle' : 'bg-white border border-gray-200'}
        ${highlight ? 'shadow-lg ring-2 ring-blue-300 animate-bounce-subtle' : 'hover:shadow-xl'}
        ${isTopRank ? 'shadow-md' : ''}
        focus:outline-none focus:ring-2 focus:ring-blue-500
      `}
        >
            {/* Badge de rang */}
            <div
                aria-hidden="true"
                className={`
          flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center
          font-bold text-base sm:text-lg ${getRankColor(ranking.rang)}
          transition-transform duration-300 hover:rotate-12 hover:scale-110
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
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-gray-300 flex items-center justify-center shadow-sm">
                            <span className="text-gray-600 text-lg font-semibold">
                                {ranking.firstname?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>

                {/* Nom + Formateurs */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <p
                            className={`font-semibold text-sm sm:text-base truncate ${isCurrentUser ? 'text-blue-800' : 'text-gray-900'
                                }`}
                        >
                            {formatName(ranking.firstname, ranking.name)}
                        </p>
                        {isCurrentUser && (
                            <span className="flex-shrink-0 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
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
                <p className="text-xl sm:text-2xl font-bold text-yellow-600">
                    {ranking.score}
                </p>
                <p className="text-xs text-gray-500 font-semibold">Pts</p>
            </div>
        </div>
    );
}, (prevProps, nextProps) => {
    // Custom comparison for optimization
    return (
        prevProps.ranking.id === nextProps.ranking.id &&
        prevProps.ranking.score === nextProps.ranking.score &&
        prevProps.ranking.rang === nextProps.ranking.rang &&
        prevProps.isCurrentUser === nextProps.isCurrentUser &&
        prevProps.highlight === nextProps.highlight &&
        prevProps.isSmallScreen === nextProps.isSmallScreen
    );
});
