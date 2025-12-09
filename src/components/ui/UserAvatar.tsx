import React from 'react';
import { User } from 'lucide-react';

interface UserAvatarProps {
    imageUrl?: string;
    name: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'default' | 'gold' | 'silver' | 'bronze';
    showBadge?: boolean;
    className?: string;
}

/**
 * UserAvatar - Composant d'avatar utilisateur réutilisable
 * 
 * Affiche la photo de profil de l'utilisateur avec un fallback vers une icône.
 * Supporte différentes tailles et variantes colorées pour les podiums.
 * 
 * @param {string} imageUrl - URL de l'image de profil
 * @param {string} name - Nom de l'utilisateur (pour alt text et fallback)
 * @param {string} size - Taille de l'avatar: 'sm' (32px), 'md' (48px), 'lg' (64px), 'xl' (80px)
 * @param {string} variant - Style: 'default', 'gold', 'silver', 'bronze'
 * @param {boolean} showBadge - Afficher un badge "connecté" (point vert)
 * @param {string} className - Classes CSS additionnelles
 * 
 * @example
 * // Avatar basique
 * <UserAvatar imageUrl="/avatar.jpg" name="John Doe" />
 * 
 * @example
 * // Avatar podium or avec badge
 * <UserAvatar 
 *   imageUrl="/avatar.jpg" 
 *   name="John Doe"
 *   size="lg" 
 *   variant="gold"
 *   showBadge
 * />
 */
export function UserAvatar({
    imageUrl,
    name,
    size = 'md',
    variant = 'default',
    showBadge = false,
    className = '',
}: UserAvatarProps) {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
        xl: 'w-20 h-20',
    };

    const iconSizes = {
        sm: 16,
        md: 24,
        lg: 32,
        xl: 40,
    };

    const variantClasses = {
        default: 'ring-2 ring-gray-200',
        gold: 'ring-4 ring-yellow-400',
        silver: 'ring-4 ring-gray-300',
        bronze: 'ring-4 ring-orange-400',
    };

    const initial = name?.charAt(0).toUpperCase() || '?';

    return (
        <div className={`relative inline-block ${className}`}>
            <div
                className={`
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          rounded-full overflow-hidden
          transition-all duration-300
          hover:shadow-lg hover:scale-105
        `}
                title={name}
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={`Photo de profil de ${name}`}
                        className="w-full h-full object-cover bg-white"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <User size={iconSizes[size]} className="text-gray-600" />
                    </div>
                )}
            </div>

            {showBadge && (
                <div
                    className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-md"
                    aria-label="Utilisateur connecté"
                />
            )}
        </div>
    );
}
