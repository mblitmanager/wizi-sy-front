import * as React from 'react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, TrendingDown, AlertTriangle, Video, Trophy } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';

interface DashboardStats {

    total_stagiaires: number;
    total_formations: number;
    total_quizzes_taken: number;
    active_this_week: number;
    inactive_count: number;
    never_connected: number;
    avg_quiz_score: number;
    total_video_hours: number;
    formations: Array<{
        id: number;
        nom: string;
        total_stagiaires: number;
        stagiaires_actifs: number;
        score_moyen: number;
    }>;
    formateurs: Array<{
        id: number;
        prenom: string;
        nom: string;
        total_stagiaires: number;
    }>;
}

export function FormateurDashboardStats() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/formateur/dashboard/stats', {
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0',
                    }
                });
                setStats(response.data);
            } catch (err) {
                console.error('Erreur chargement stats:', err);
                setError('Impossible de charger les statistiques');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-32 rounded-[2rem] bg-background animate-pulse border border-border" />
                ))}
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="p-10 text-center rounded-[2rem] bg-destructive/10 border border-destructive/20">
                <AlertTriangle className="h-10 w-10 text-destructive-foreground mx-auto mb-4" />
                <p className="text-destructive-foreground font-black uppercase text-xs tracking-widest">{error || 'Erreur critique'}</p>
            </div>
        );
    }

    const statCards = [
        {
            title: "Stagiaires",
            value: stats.total_stagiaires,
            subValue: `${stats.active_this_week} actifs`,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-500/5",
            border: "border-blue-500/10",
            path: "/formateur/mes-stagiaires"
        },
        {
            title: "Formations",
            value: stats.total_formations,
            subValue: "Programmes actifs",
            icon: Video,
            color: "text-purple-600",
            bg: "bg-purple-500/5",
            border: "border-purple-500/10",
            path: "/formateur/videos"
        },
        {
            title: "Quiz Complétés",
            value: stats.total_quizzes_taken,
            subValue: `Moyenne : ${stats.avg_quiz_score}%`,
            icon: Trophy,
            color: "text-brand-primary-dark",
            bg: "bg-brand-primary/5",
            border: "border-brand-primary/20",
            path: "/formateur/quizzes"
        },
        {
            title: "Inactifs",
            value: stats.inactive_count,
            subValue: "7+ jours d'absence",
            icon: TrendingDown,
            color: "text-orange-600",
            bg: "bg-orange-500/5",
            border: "border-orange-500/10",
            path: "/formateur/mes-stagiaires?filter=inactive"
        },
        {
            title: "Jamais Connectés",
            value: stats.never_connected,
            subValue: "En attente",
            icon: AlertTriangle,
            color: "text-destructive",
            bg: "bg-destructive/5",
            border: "border-destructive/10",
            path: "/formateur/mes-stagiaires?filter=never_connected"
        },
        {
            title: "Heures Vidéos",
            value: `${stats.total_video_hours}h`,
            subValue: "Visionnage cumulé",
            icon: Video,
            color: "text-indigo-600",
            bg: "bg-indigo-500/5",
            border: "border-indigo-500/10",
            path: "/formateur/videos"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {statCards.map((card, index) => (
                <motion.div
                    key={index}
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className={`relative overflow-hidden group rounded-[2.5rem] border ${card.border} bg-card p-8 shadow-xl shadow-background hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-500 cursor-pointer`}
                    onClick={() => navigate(card.path)}
                >

                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                        <card.icon className="h-24 w-24" />
                    </div>
                    
                    <div className="flex items-start justify-between relative z-10">
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{card.title}</p>
                            <h3 className="text-4xl font-black text-foreground tracking-tighter">{card.value}</h3>
                        </div>
                        <div className={`p-4 rounded-2xl ${card.bg} border border-transparent group-hover:border-current/10 transition-colors ${card.color}`}>
                            <card.icon className="h-6 w-6" />
                        </div>
                    </div>
                    
                    <div className="mt-8 flex items-center justify-between relative z-10">
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full bg-background text-muted-foreground border border-border group-hover:bg-card group-hover:border-border transition-all`}>
                            {card.subValue}
                        </span>
                        <div className="h-1 w-12 bg-secondary rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '60%' }}
                                transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                                className={`h-full ${card.color.replace('text', 'bg')} opacity-40`}
                            />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

export default FormateurDashboardStats;
