import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, TrendingDown, AlertTriangle, Video, Trophy } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-4 w-32" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-16" />
                        </CardContent>
                    </Card>
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

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Total Stagiaires */}
            <Card className="border-l-4 border-l-blue-500 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Stagiaires</CardTitle>
                    <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total_stagiaires}</div>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="bg-green-100 text-green-700 text-[10px]">
                            {stats.active_this_week} actifs
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Total Formations */}
            <Card className="border-l-4 border-l-purple-500 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Formations</CardTitle>
                    <Video className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total_formations}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Catalogues assignés
                    </p>
                </CardContent>
            </Card>

            {/* Total Quiz Taken */}
            <Card className="border-l-4 border-l-amber-500 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Quiz Complétés</CardTitle>
                    <Trophy className="h-4 w-4 text-amber-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total_quizzes_taken}</div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-amber-600 font-medium">
                        Moyenne : {stats.avg_quiz_score}%
                    </div>
                </CardContent>
            </Card>

            {/* Stagiaires Inactifs */}
            <Card className="border-l-4 border-l-orange-500 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Stagiaires Inactifs</CardTitle>
                    <TrendingDown className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{stats.inactive_count}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Inactifs 7+ jours
                    </p>
                </CardContent>
            </Card>

            {/* Jamais Connectés */}
            <Card className="border-l-4 border-l-red-500 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Jamais Connectés</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-600">{stats.never_connected}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Comptes non activés
                    </p>
                </CardContent>
            </Card>

            {/* Heures Vidéos */}
            <Card className="border-l-4 border-l-purple-400 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Heures Vidéos</CardTitle>
                    <Video className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-purple-600">{stats.total_video_hours}h</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Total visionnées
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

export default FormateurDashboardStats;
