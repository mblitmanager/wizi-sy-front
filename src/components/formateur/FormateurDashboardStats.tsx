import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, TrendingDown, AlertTriangle, Video, Trophy } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface DashboardStats {
    total_stagiaires: number;
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
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/formateur/dashboard/stats`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
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
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Stagiaires</CardTitle>
                    <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total_stagiaires}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Stagiaires inscrits
                    </p>
                </CardContent>
            </Card>

            {/* Actifs cette semaine */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Actifs cette semaine</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">{stats.active_this_week}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {Math.round((stats.active_this_week / stats.total_stagiaires) * 100)}% des stagiaires
                    </p>
                </CardContent>
            </Card>

            {/* Score Moyen Quiz */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Score Moyen Quiz</CardTitle>
                    <Trophy className="h-4 w-4 text-amber-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-amber-600">{stats.avg_quiz_score}%</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Performance globale
                    </p>
                </CardContent>
            </Card>

            {/* Stagiaires Inactifs */}
            <Card>
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
            <Card>
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
            <Card>
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
