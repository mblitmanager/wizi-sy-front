import { useEffect, useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useUser } from '@/hooks/useAuth';
import { UserProgress } from '@/types/quiz';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Calendar } from 'lucide-react';

export interface User {
    id: string | number;
    name: string;
    email: string;
    points?: number;
    level?: number;
    avatar?: string | null;
    role?: string;
    stagiaire: {
        prenom?: string;
        civilite?: string;
        telephone?: string;
        adresse?: string;
        code_postal?: string;
        ville?: string;
        date_debut_formation?: string;
        date_inscription?: string;
    };
    user?: {
        id: string | number;
        name: string;
        email: string;
        role?: string;
        image?: string | null;
        updated_at?: string;
        adresse?: string | null;
    };
}

interface AchievementMinimal {
    id: string | number;
    name?: string;
    type?: string;
    level?: string;
}

interface ProfileHeaderProps {
    user: User | null;
    userProgress?: UserProgress | null;
    achievements?: AchievementMinimal[];
    achievementsLoading?: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    user,
    userProgress,
    achievements,
    achievementsLoading,
}) => {
    const [localAchievements, setLocalAchievements] = useState<AchievementMinimal[]>([]);
    const [localAchievementsLoading, setLocalAchievementsLoading] = useState(false);
    const [imageError, setImageError] = useState(false);

    const VITE_API_URL_MEDIA = import.meta.env.VITE_API_URL_MEDIA;
    const VITE_API_URL = import.meta.env.VITE_API_URL;
    const { t } = useTranslation();
    const isTrainer = user?.role === 'formateur' || user?.role === 'formatrice';

    useEffect(() => {
        if (achievements !== undefined || !user?.user?.id) return;
        setLocalAchievementsLoading(true);
        axios
            .get(`${VITE_API_URL}/achievements/${user.user.id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            })
            .then((res) => setLocalAchievements(res.data || []))
            .catch(() => toast.error('Erreur lors du chargement des succès'))
            .finally(() => setLocalAchievementsLoading(false));
    }, [user?.user?.id, VITE_API_URL, achievements]);

    const getInitials = useCallback(() => {
        const first = user?.stagiaire?.prenom?.charAt(0).toUpperCase() || '';
        const last = user?.user?.name?.charAt(0).toUpperCase() || '';
        return `${first}${last}` || 'U';
    }, [user]);

    const imageUrl = useMemo(() => {
        if (!user?.user?.image) return null;
        return `${VITE_API_URL_MEDIA}/${user.user.image}?${new Date(user?.user?.updated_at).getTime()}`;
    }, [user?.user?.image, user?.user?.updated_at, VITE_API_URL_MEDIA]);

    const formatDate = (value?: string) => {
        if (!value) return '—';
        const d = new Date(value);
        if (isNaN(d.getTime())) return '—';
        return new Intl.DateTimeFormat('fr-FR').format(d);
    };

    const fullName =
        [user?.stagiaire?.prenom, user?.user?.name].filter(Boolean).join(' ') || 'Utilisateur';
    const email = user?.user?.email || user?.email;
    const phone = user?.stagiaire?.telephone;
    const ville = user?.stagiaire?.ville;
    const cp = user?.stagiaire?.code_postal;
    const adresse = user?.stagiaire?.adresse;

    const locationParts = [adresse, cp && ville ? `${cp} ${ville}` : ville || cp].filter(Boolean);

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
            {/* Bandeau top coloré */}
            <div className="h-20 bg-gradient-to-r from-amber-400 to-orange-500 relative">
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                    }}
                />
            </div>

            <div className="px-6 pb-6">
                {/* Avatar chevauchant la bannière */}
                <div className="flex items-end gap-5 -mt-10 mb-5">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-white dark:ring-gray-900 shadow-md flex-shrink-0">
                        {imageUrl && !imageError ? (
                            <img
                                src={imageUrl}
                                alt={fullName}
                                className="w-full h-full object-cover"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl font-medium">
                                {getInitials()}
                            </div>
                        )}
                    </div>
                    <div className="pb-1">
                        <h1 className="text-lg font-medium text-gray-900 dark:text-white leading-tight">
                            {fullName}
                        </h1>
                        {email && (
                            <p className="text-sm text-gray-400 dark:text-gray-500">{email}</p>
                        )}
                    </div>
                </div>

                {/* Séparateur */}
                <div className="h-px bg-gray-100 dark:bg-gray-800 mb-5" />

                {/* Infos en 2 colonnes propres */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {email && (
                        <InfoItem
                            icon={<Mail className="h-3.5 w-3.5" />}
                            label="Email"
                            value={email}
                        />
                    )}
                    {phone && (
                        <InfoItem
                            icon={<Phone className="h-3.5 w-3.5" />}
                            label="Téléphone"
                            value={phone}
                        />
                    )}
                    {locationParts.length > 0 && (
                        <InfoItem
                            icon={<MapPin className="h-3.5 w-3.5" />}
                            label="Localisation"
                            value={locationParts.join(', ')}
                        />
                    )}
                    {!isTrainer && user?.stagiaire?.date_debut_formation && (
                        <InfoItem
                            icon={<Calendar className="h-3.5 w-3.5" />}
                            label="Début de formation"
                            value={formatDate(user.stagiaire.date_debut_formation)}
                        />
                    )}
                    {!isTrainer && user?.stagiaire?.date_inscription && (
                        <InfoItem
                            icon={<Calendar className="h-3.5 w-3.5" />}
                            label="Date d'inscription"
                            value={formatDate(user.stagiaire.date_inscription)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

const InfoItem = ({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) => (
    <div className="flex items-start gap-2.5">
        <div className="mt-0.5 text-gray-400 flex-shrink-0">{icon}</div>
        <div className="min-w-0">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{label}</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{value}</p>
        </div>
    </div>
);

export default ProfileHeader;
