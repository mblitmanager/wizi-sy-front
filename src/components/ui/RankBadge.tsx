import React from 'react';

interface RankBadgeProps {
    rank: number;
    size?: 'sm' | 'md' | 'lg';
    withShadow?: boolean;
    withAnimation?: boolean;
    className?: string;
}

/**
 * RankBadge - Badge de position coloré réutilisable
 * 
 * Affiche la position d'un utilisateur avec des couleurs spécifiques pour le top 5.
 * Utilise les couleurs standardisées : Or (1), Argent (2), Bronze (3), Gris (4), Bleu (5)
 * 
 * @param {number} rank - Position (1-5 pour couleurs spéciales, autres en gris)
 * @param {string} size - Taille du badge: 'sm' (8x8), 'md' (12x12), 'lg' (16x16)
 * @param {boolean} withShadow - Ajouter une ombre portée
 * @param {boolean} withAnimation - Activer les animations hover
 * @param {string} className - Classes CSS additionnelles
 * 
 * @example
 * // Badge or position 1, taille large avec ombre
 * <RankBadge rank={1} size="lg" withShadow withAnimation />
 * 
 * @example
 * // Badge simple position 10
 * <RankBadge rank={10} size="md" />
 */
export function RankBadge({
    rank,
    size = 'md',
    withShadow = true,
    withAnimation = true,
    className = ''
}: RankBadgeProps) {
    const getRankColor = (rank: number): string => {
        switch (rank) {
            case 1: return 'bg-gradient-to-br from-yellow-400 to-yellow-600';
            case 2: return 'bg-gradient-to-br from-gray-300 to-gray-400';
            case 3: return 'bg-gradient-to-br from-orange-400 to-orange-600';
            case 4: return 'bg-gradient-to-br from-gray-400 to-gray-500';
            case 5: return 'bg-gradient-to-br from-blue-400 to-blue-600';
            default: return 'bg-gradient-to-br from-gray-200 to-gray-300';
        }
    };

    const sizeClasses = {
        sm: 'w-8 h-8 text-sm',
        md: 'w-12 h-12 text-lg',
        lg: 'w-16 h-16 text-2xl',
    };

    const shadowClass = withShadow ? (rank <= 5 ? 'shadow-lg' : 'shadow-md') : '';
    const animationClass = withAnimation
        ? 'transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:rotate-6'
        : '';

    return (
        <div
            className={`
        flex items-center justify-center rounded-full
        ${sizeClasses[size]}
        ${getRankColor(rank)}
        ${shadowClass}
        ${animationClass}
        text-white font-bold
        ${className}
      `}
            aria-label={`Position ${rank}`}
        >
            {rank}
        </div>
    );
}
