import React, { useEffect, useState, useCallback } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Medal, Award, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface StagiaireRanking {
    rank: number;
    id: number;
    prenom: string;
    nom: string;
    email: string;
    total_points: number;
    total_quiz: number;
    avg_score: number;
}

export function FormateurClassementPage() {
    const [ranking, setRanking] = useState<StagiaireRanking[]>([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<string>('all');

    const fetchRanking = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/formateur/classement/mes-stagiaires`, {
                params: { period },
                headers: { Authorization: `Bearer ${token}` },
            });
            setRanking(response.data.ranking);
        } catch (err) {
            console.error('Erreur chargement classement:', err);
        } finally {
            setLoading(false);
        }
    }, [period]);

    useEffect(() => {
        fetchRanking();
    }, [fetchRanking]);

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Trophy className="h-5 w-5 text-yellow-500" />;
            case 2:
                return <Medal className="h-5 w-5 text-gray-400" />;
            case 3:
                return <Medal className="h-5 w-5 text-orange-600" />;
            default:
                return <Award className="h-5 w-5 text-gray-300" />;
        }
    };

    const getRankColor = (rank: number) => {
        switch (rank) {
            case 1:
                return 'bg-yellow-50 border-yellow-200';
            case 2:
                return 'bg-gray-50 border-gray-200';
            case 3:
                return 'bg-orange-50 border-orange-200';
            default:
                return '';
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="container mx-auto py-6 px-4">
                    <p className="text-center">Chargement...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto py-6 px-4">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Classement des Stagiaires
                    </h1>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
                        <p className="text-gray-600 dark:text-gray-400">
                            Classement de vos stagiaires par points
                        </p>
                        
                        <Tabs value={period} onValueChange={setPeriod} className="w-full md:w-auto">
                            <TabsList className="grid w-full grid-cols-3 md:w-[300px]">
                                <TabsTrigger value="all" className="flex items-center gap-2">
                                    Tout
                                </TabsTrigger>
                                <TabsTrigger value="month" className="flex items-center gap-2">
                                    Mois
                                </TabsTrigger>
                                <TabsTrigger value="week" className="flex items-center gap-2">
                                    Semaine
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Trophy className="h-5 w-5 text-amber-600" />
                            Top Stagiaires ({ranking.length})
                        </CardTitle>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {period === 'week' ? 'Cette semaine' : period === 'month' ? 'Ce mois' : 'Tout temps'}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-16">Rang</TableHead>
                                    <TableHead>Stagiaire</TableHead>
                                    <TableHead className="text-right">Points Totaux</TableHead>
                                    <TableHead className="text-right">Quiz Complétés</TableHead>
                                    <TableHead className="text-right">Score Moyen</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ranking.map((stagiaire) => (
                                    <TableRow
                                        key={stagiaire.id}
                                        className={getRankColor(stagiaire.rank)}
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {getRankIcon(stagiaire.rank)}
                                                <span className="font-semibold">#{stagiaire.rank}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">
                                                    {stagiaire.prenom} {stagiaire.nom}
                                                </p>
                                                <p className="text-sm text-gray-500">{stagiaire.email}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant="outline" className="bg-blue-50">
                                                {stagiaire.total_points} pts
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {stagiaire.total_quiz}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Badge
                                                variant={stagiaire.avg_score >= 70 ? 'default' : 'secondary'}
                                            >
                                                {stagiaire.avg_score}%
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}

export default FormateurClassementPage;
