import React from 'react';
import { Star } from 'lucide-react';

interface ScoreDisplayProps {
    score: number;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'gold' | 'compact';
    showLabel?: boolean;
    className?: string;
}

/**
 * ScoreDisplay - Composant d'affichage de points/score
 * 
 * Affiche les points d'un utilisateur de manière cohérente et visuelle.
 * Toujours en jaune/gold pour cohérence avec le design system.
 * 
 * @param {number} score - Nombre de points à afficher
 * @param {string} size - Taille: 'sm', 'md', 'lg'
 * @param {string} variant - Style: 'default' (avec fond), 'gold' (accentué), 'compact' (minimal)
 * @param {boolean} showLabel - Afficher le texte "pts" ou "points"
 * @param {string} className - Classes CSS additionnelles
 * 
 * @example
 * // Score simple
 * <ScoreDisplay score={1250} />
 * 
 * @example
 * // Score gold grand format
 * <ScoreDisplay score={1250} size="lg" variant="gold" showLabel />
 */
export function ScoreDisplay({
    score,
    size = 'md',
    variant = 'default',
    showLabel = true,
    className = '',
}: ScoreDisplayProps) {
    const sizeClasses = {
        sm: 'text-sm',
        md: 'text-lg',
        lg: 'text-2xl',
    };

    const labelSizes = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    };

    const renderDefault = () => (
        <div
            className={`
        inline-flex items-center gap-2 px-3 py-1.5 
        bg-yellow-50 dark:bg-yellow-900/20 
        rounded-full border border-yellow-200
        ${className}
      `}
            aria-label={`${score} points`}
        >
            <Star className="w-4 h-4 text-yellow-600 fill-yellow-600" aria-hidden="true" />
            <span className={`font-bold text-yellow-600 dark:text-yellow-500 ${sizeClasses[size]}`}>
                {score.toLocaleString()}
            </span>
            {showLabel && (
                <span className={`font-semibold text-gray-600 dark:text-gray-400 ${labelSizes[size]}`}>
                    pts
                </span>
            )}
        </div>
    );

    const renderGold = () => (
        <div
            className={`
        inline-flex flex-col items-center justify-center
        px-4 py-2 rounded-lg
        bg-gradient-to-br from-yellow-400 to-yellow-600
        shadow-lg
        ${className}
      `}
            aria-label={`${score} points`}
        >
            <span className={`font-bold text-white ${sizeClasses[size]}`}>
                {score.toLocaleString()}
            </span>
            {showLabel && (
                <span className={`text-white/90 ${labelSizes[size]} uppercase tracking-wide`}>
                    Points
                </span>
            )}
        </div>
    );

    const renderCompact = () => (
        <span
            className={`font-bold text-yellow-600 dark:text-yellow-500 ${sizeClasses[size]} ${className}`}
            aria-label={`${score} points`}
        >
            {score.toLocaleString()}{showLabel && ' pts'}
        </span>
    );

    switch (variant) {
        case 'gold':
            return renderGold();
        case 'compact':
            return renderCompact();
        default:
            return renderDefault();
    }
}
