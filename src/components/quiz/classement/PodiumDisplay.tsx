import React from 'react';
import { Trophy } from 'lucide-react';
import type { LeaderboardEntry } from '@/types/quiz';

interface PodiumDisplayProps {
    rankings: LeaderboardEntry[];
    currentUserId?: string;
    onStagiaireClick?: (stagiaire: LeaderboardEntry) => void;
}

const MEDAL_COLORS = {
    gold: {
        bg: '#FEB823',
        border: '#D97706',
        gradient: 'from-yellow-400 to-yellow-600',
        light: 'bg-yellow-50',
    },
    silver: {
        bg: '#9CA3AF',
        border: '#6B7280',
        gradient: 'from-gray-300 to-gray-400',
        light: 'bg-gray-50',
    },
    bronze: {
        bg: '#F59E0B',
        border: '#EA580C',
        gradient: 'from-orange-400 to-orange-600',
        light: 'bg-orange-50',
    },
};

export function PodiumDisplay({ rankings, currentUserId, onStagiaireClick }: PodiumDisplayProps) {
    if (rankings.length === 0) return null;

    // Ordre d'affichage : 2ème, 1er, 3ème
    const displayOrder = [1, 0, 2];
    const heights = ['h-20', 'h-28', 'h-16'];
    const avatarSizes = ['w-14 h-14', 'w-20 h-20', 'w-12 h-12'];
    const colors = [MEDAL_COLORS.silver, MEDAL_COLORS.gold, MEDAL_COLORS.bronze];

    const formatName = (entry: LeaderboardEntry) => {
        const initial = entry.name?.trim().charAt(0);
        const suffix = initial ? ` ${initial.toUpperCase()}.` : '';
        return `${entry.firstname || 'Anonyme'}${suffix}`.trim();
    };

    return (
        <div className="w-full py-6 px-4 rounded-2xl bg-gradient-to-b from-amber-50/50 to-white border border-amber-100">
            {/* Titre du podium */}
            <div className="flex items-center justify-center gap-2 mb-6">
                <Trophy className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-bold text-amber-800 tracking-wide">
                    PODIUM
                </h3>
                <Trophy className="w-5 h-5 text-amber-600" />
            </div>

            {/* Podium */}
            <div className="flex items-end justify-center gap-2 sm:gap-4">
                {displayOrder.map((index, position) => {
                    if (index >= rankings.length) return null;

                    const entry = rankings[index];
                    const isCurrentUser = entry.id?.toString() === currentUserId;
                    const color = colors[position];
                    const rank = index + 1;

                    return (
                        <div
                            key={entry.id}
                            onClick={() => onStagiaireClick?.(entry)}
                            className={`flex-1 max-w-[120px] flex flex-col items-center ${onStagiaireClick ? 'cursor-pointer hover:scale-105 transition-transform duration-200' : ''}`}
                        >
                            {/* Badge de position */}
                            <div
                                className="mb-2 px-3 py-1 rounded-full text-xs font-bold shadow-sm"
                                style={{
                                    backgroundColor: `${color.bg}20`,
                                    border: `1.5px solid ${color.border}`,
                                    color: color.border,
                                }}
                            >
                                {rank === 1 ? '1er' : `${rank}e`}
                            </div>

                            {/* Conteneur avatar + podium */}
                            <div className="relative w-full flex flex-col items-center">
                                {/* Avatar */}
                                <div className="relative mb-3 z-10">
                                    <div
                                        className={`${avatarSizes[position]} rounded-full p-0.5 shadow-lg`}
                                        style={{
                                            background: `linear-gradient(135deg, ${color.bg}, ${color.border})`,
                                        }}
                                    >
                                        {entry.avatar || entry.image ? (
                                            <img
                                                src={`${import.meta.env.VITE_API_URL_MEDIA}/${entry.avatar || entry.image}`}
                                                alt={entry.firstname}
                                                className="w-full h-full rounded-full object-cover bg-white"
                                            />
                                        ) : (
                                            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-400 text-xl font-semibold">
                                                    {entry.firstname?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Indicateur utilisateur connecté */}
                                    {isCurrentUser && (
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center shadow">
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* Socle du podium */}
                                <div
                                    className={`${heights[position]} w-full rounded-t-lg shadow-md transition-all duration-300`}
                                    style={{
                                        background: `linear-gradient(to bottom, ${color.bg}30, ${color.bg}10)`,
                                        border: `2px solid ${color.border}40`,
                                    }}
                                />
                            </div>

                            {/* Nom */}
                            <div className="mt-3 text-center w-full">
                                <p
                                    className={`text-sm font-bold truncate ${isCurrentUser ? 'text-amber-700' : 'text-gray-800'
                                        }`}
                                    title={`${entry.firstname} ${entry.name?.toUpperCase() || ''}`}
                                >
                                    {formatName(entry)}
                                </p>

                                {/* Formateurs */}
                                {entry.formateurs && entry.formateurs.length > 0 && (
                                    <p className="text-[10px] text-gray-500 mt-0.5 truncate">
                                        {entry.formateurs.map((f) => {
                                            const initial = f.nom?.charAt(0).toUpperCase() || '';
                                            const suffix = initial ? ` ${initial}.` : '';
                                            return `${f.prenom}${suffix}`;
                                        }).join(', ')}
                                    </p>
                                )}

                                {/* Points */}
                                <div
                                    className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold shadow-sm"
                                    style={{
                                        backgroundColor: `${color.bg}15`,
                                        color: color.border,
                                    }}
                                >
                                    {entry.score} pts
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
