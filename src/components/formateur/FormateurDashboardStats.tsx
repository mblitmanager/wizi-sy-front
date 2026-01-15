import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, TrendingDown, AlertTriangle, Video, Trophy } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
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
                const response = await api.get('/formateur/dashboard/stats');
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

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-32 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
                ))}
            </div>
        );
    }

    if (error || !stats) {
        return (
            <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                    <p className="text-red-600">{error || 'Erreur de chargement'}</p>
                </CardContent>
            </Card>
        );
    }

    const statCards = [
        {
            title: "Stagiaires",
            value: stats.total_stagiaires,
            subValue: `${stats.active_this_week} actifs`,
            icon: Users,
            color: "text-blue-400",
            borderColor: "border-blue-500/20"
        },
        {
            title: "Formations",
            value: stats.total_formations,
            subValue: "Catalogues assignés",
            icon: Video,
            color: "text-purple-400",
            borderColor: "border-purple-500/20"
        },
        {
            title: "Quiz Complétés",
            value: stats.total_quizzes_taken,
            subValue: `Moyenne : ${stats.avg_quiz_score}%`,
            icon: Trophy,
            color: "text-amber-400",
            borderColor: "border-amber-500/20"
        },
        {
            title: "Inactifs",
            value: stats.inactive_count,
            subValue: "7+ jours d'absence",
            icon: TrendingDown,
            color: "text-orange-400",
            borderColor: "border-orange-500/20"
        },
        {
            title: "Jamais Connectés",
            value: stats.never_connected,
            subValue: "Comptes en attente",
            icon: AlertTriangle,
            color: "text-red-400",
            borderColor: "border-red-500/20"
        },
        {
            title: "Heures Vidéos",
            value: `${stats.total_video_hours}h`,
            subValue: "Temps de visionnage",
            icon: Video,
            color: "text-indigo-400",
            borderColor: "border-indigo-500/20"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statCards.map((card, index) => (
                <motion.div
                    key={index}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className={`relative overflow-hidden group rounded-2xl border ${card.borderColor} bg-white/[0.03] backdrop-blur-md p-6 transition-all hover:bg-white/[0.05] hover:border-white/10`}
                >
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white opacity-[0.02] group-hover:opacity-[0.05] transition-opacity" />
                    
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{card.title}</p>
                            <h3 className="text-3xl font-bold text-white tracking-tight">{card.value}</h3>
                        </div>
                        <div className={`p-3 rounded-xl bg-white/5 border border-white/5 ${card.color}`}>
                            <card.icon className="h-5 w-5" />
                        </div>
                    </div>
                    
                    <div className="mt-4 flex items-center gap-2">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/5 group-hover:border-white/10 transition-colors`}>
                            {card.subValue}
                        </span>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

export default FormateurDashboardStats;
