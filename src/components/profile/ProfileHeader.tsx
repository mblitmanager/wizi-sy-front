import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Calendar, Settings, Gift, CalendarCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserProgress } from '@/types/quiz';
import type { User as AppUser } from '@/types';
import { getUserAccount } from '@/utils/userAccount';
import { getRoleLabel } from '@/components/layout/Navbar';

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

const VITE_API_URL_MEDIA = import.meta.env.VITE_API_URL_MEDIA;

const formatDate = (value?: string) => {
    if (!value) return null;
    const d = new Date(value);
    if (isNaN(d.getTime())) return null;
    return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
};

function useProfileIdentity(user: User | null) {
    const account = getUserAccount(user as unknown as AppUser);
    const role = user?.role || user?.user?.role;
    const prenom = user?.stagiaire?.prenom;
    const fullName = [prenom, account.name].filter(Boolean).join(' ') || 'Utilisateur';
    const initials = `${prenom?.charAt(0) ?? ''}${account.name.charAt(0)}`.toUpperCase() || 'U';
    const updatedAt = user?.user?.updated_at;
    const imageUrl = account.image
        ? `${VITE_API_URL_MEDIA}/${account.image}${updatedAt ? `?${new Date(updatedAt).getTime()}` : ''}`
        : null;
    const isStagiaire = !role || role === 'stagiaire';
    return { account, role, fullName, initials, imageUrl, isStagiaire };
}

/** En-tête du profil : photo, identité et actions rapides. */
const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
    const [imageError, setImageError] = useState(false);
    const { account, role, fullName, initials, imageUrl, isStagiaire } = useProfileIdentity(user);
    const since = formatDate(user?.stagiaire?.date_inscription);

    return (
        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-sm)]">
            {/* Bandeau aux couleurs des deux marques */}
            <div className="relative h-24 bg-gradient-to-r from-navy via-navy to-navy-light sm:h-28">
                <div
                    aria-hidden
                    className="absolute -right-10 -top-16 h-48 w-48 rounded-[45%_55%_60%_40%/55%_45%_55%_45%] bg-gold/25"
                />
                <div
                    aria-hidden
                    className="absolute bottom-0 right-40 h-20 w-20 translate-y-1/2 rounded-full bg-white/5"
                />
            </div>

            <div className="flex flex-col gap-4 px-5 pb-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-5">
                    <div className="-mt-12 h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-primary shadow-md ring-4 ring-card sm:-mt-14 sm:h-28 sm:w-28">
                        {imageUrl && !imageError ? (
                            <img
                                src={imageUrl}
                                alt={fullName}
                                className="h-full w-full object-cover"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <span className="flex h-full w-full items-center justify-center font-poppins text-3xl font-bold text-primary-foreground">
                                {initials}
                            </span>
                        )}
                    </div>
                    <div className="min-w-0 pb-0.5">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="font-poppins text-xl font-bold text-foreground sm:text-2xl">{fullName}</h1>
                            {role && (
                                <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
                                    {getRoleLabel(role)}
                                </span>
                            )}
                        </div>
                        <p className="mt-0.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            {account.email && (
                                <span className="inline-flex min-w-0 items-center gap-1.5">
                                    <Mail className="h-4 w-4 flex-shrink-0" />
                                    <span className="truncate">{account.email}</span>
                                </span>
                            )}
                            {since && (
                                <span className="inline-flex items-center gap-1.5">
                                    <CalendarCheck className="h-4 w-4" />
                                    Membre depuis le {since}
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {isStagiaire && (
                        <Button asChild variant="outline" className="h-10 rounded-lg">
                            <Link to="/parrainage">
                                <Gift className="h-4 w-4" />
                                Parrainer
                            </Link>
                        </Button>
                    )}
                    <Button asChild className="h-10 rounded-lg">
                        <Link to="/settings">
                            <Settings className="h-4 w-4" />
                            Paramètres
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
};

/** Coordonnées du stagiaire (lecture seule). */
export function ProfileInfoCard({ user }: { user: User | null }) {
    const { account, role } = useProfileIdentity(user);
    const isTrainer = role === 'formateur' || role === 'formatrice';
    const s = user?.stagiaire;
    const location = [s?.adresse, s?.code_postal && s?.ville ? `${s.code_postal} ${s.ville}` : s?.ville || s?.code_postal]
        .filter(Boolean)
        .join(', ');

    const rows = [
        { icon: Mail, label: 'Email', value: account.email },
        { icon: Phone, label: 'Téléphone', value: s?.telephone },
        { icon: MapPin, label: 'Adresse', value: location },
        ...(!isTrainer
            ? [
                  { icon: Calendar, label: 'Début de formation', value: formatDate(s?.date_debut_formation) },
                  { icon: CalendarCheck, label: "Date d'inscription", value: formatDate(s?.date_inscription) },
              ]
            : []),
    ];

    return (
        <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-sm)]">
            <h2 className="mb-4 text-base font-semibold text-foreground">Mes coordonnées</h2>
            <dl className="space-y-4">
                {rows.map((row) => (
                    <div key={row.label} className="flex items-start gap-3">
                        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                            <row.icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                            <dt className="text-xs text-muted-foreground">{row.label}</dt>
                            <dd className={row.value ? 'break-words text-sm font-medium text-foreground' : 'text-sm text-muted-foreground/70'}>
                                {row.value || 'Non renseigné'}
                            </dd>
                        </div>
                    </div>
                ))}
            </dl>
            <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
                Une information à corriger ? Contactez votre conseiller depuis la page{' '}
                <Link to="/contact-support" className="font-medium text-primary underline-offset-2 hover:underline">
                    Contact
                </Link>
                .
            </p>
        </section>
    );
}

export default ProfileHeader;
