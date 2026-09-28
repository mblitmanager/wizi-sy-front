import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Trophy, CheckCircle2, Medal, Clock } from 'lucide-react';
import { User } from '@/types';
import { UserProgress } from '@/types/quiz';
import { getLevelProgress } from '@/hooks/quiz/useQuizOverview';
import { LEVEL_THRESHOLDS } from '@/components/quiz/quizUtils';
import { cn } from '@/lib/utils';

interface MinimalAchievement {
    id: string | number;
    name?: string;
}

interface UserStatsProps {
    user: User | null;
    userProgress?: UserProgress | null;
    achievements?: MinimalAchievement[];
}

function formatDuration(seconds: number) {
    if (!seconds) return '—';
    const h = Math.floor(seconds / 3600);
    const m = Math.round((seconds % 3600) / 60);
    return h > 0 ? `${h} h ${m.toString().padStart(2, '0')}` : `${m} min`;
}

/**
 * Statistiques du stagiaire (GET /stagiaire/progress).
 * Le niveau suit les paliers de déblocage des quiz du backend (0 / 50 / 100 points).
 */
const UserStats: React.FC<UserStatsProps> = ({ user, userProgress, achievements = [] }) => {
    const totalPoints =
        userProgress?.totalScore ||
        userProgress?.totalPoints ||
        userProgress?.total_points ||
        userProgress?.points ||
        user?.points ||
        0;
    const completed = userProgress?.completedQuizzes || userProgress?.completed_quizzes || 0;
    const rank = userProgress?.rank;
    const { current, next } = getLevelProgress(totalPoints);
    // Paliers équidistants (0 / 50 / 100) : la barre couvre toute l'échelle, alignée sur les repères
    const maxPoints = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1].minPoints;
    const percent = Math.min(100, Math.round((totalPoints / maxPoints) * 100));

    const tiles = [
        { icon: Trophy, label: 'Points', value: String(totalPoints), tone: 'bg-gold/15 text-gold-deep', to: '/classement' },
        { icon: CheckCircle2, label: 'Quiz terminés', value: String(completed), tone: 'bg-emerald-50 text-emerald-600', to: '/quizzes' },
        { icon: Medal, label: 'Classement', value: rank ? `${rank}${rank === 1 ? 'er' : 'e'}` : '—', tone: 'bg-accent text-primary', to: '/classement' },
        { icon: Award, label: 'Badges', value: String(achievements.length), tone: 'bg-rose-50 text-rose-600', to: '/profile/badges' },
    ];

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                {tiles.map((t) => (
                    <Link
                        key={t.label}
                        to={t.to}
                        className="group rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-sm)] transition-colors hover:border-primary/25"
                    >
                        <span className={cn('mb-3 flex h-9 w-9 items-center justify-center rounded-xl', t.tone)}>
                            <t.icon className="h-[18px] w-[18px]" />
                        </span>
                        <p className="font-poppins text-2xl font-bold tabular-nums text-foreground">{t.value}</p>
                        <p className="text-sm text-muted-foreground group-hover:text-foreground">{t.label}</p>
                    </Link>
                ))}
            </div>

            <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-sm)]">
                <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                        <h2 className="text-base font-semibold text-foreground">Niveau {current.label}</h2>
                        <p className="text-sm text-muted-foreground">
                            {next
                                ? `Encore ${next.minPoints - totalPoints} pts pour débloquer les quiz ${next.label.toLowerCase()}s.`
                                : 'Tous les niveaux de quiz sont débloqués.'}
                        </p>
                    </div>
                    {userProgress?.totalTimeSpent ? (
                        <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {formatDuration(userProgress.totalTimeSpent)} de quiz
                        </span>
                    ) : null}
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-gold transition-[width] duration-500" style={{ width: `${percent}%` }} />
                </div>
                <ol className="mt-3 grid grid-cols-3 text-xs">
                    {LEVEL_THRESHOLDS.map((t, i) => {
                        const unlocked = totalPoints >= t.minPoints;
                        return (
                            <li
                                key={t.level}
                                className={cn(
                                    i === 1 && 'text-center',
                                    i === 2 && 'text-right',
                                    unlocked ? 'font-semibold text-foreground' : 'text-muted-foreground'
                                )}
                            >
                                {t.label}
                                <span className="block font-normal text-muted-foreground">{t.minPoints} pts</span>
                            </li>
                        );
                    })}
                </ol>
            </section>
        </div>
    );
};

export default UserStats;
