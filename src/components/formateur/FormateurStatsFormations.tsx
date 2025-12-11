import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, TrendingUp, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface Formation {
    id: number;
    nom: string;
    total_stagiaires: number;
    stagiaires_actifs: number;
    score_moyen: number;
}

interface PaginationData {
    data: Formation[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export function FormateurStatsFormations() {
    const [formations, setFormations] = useState<Formation[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFormations = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/formateur/dashboard/stats`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        formations_page: currentPage,
                        formations_per_page: 5
                    }
                });
                const data = response.data.formations as PaginationData;
                setFormations(data.data || []);
                setCurrentPage(data.current_page);
                setLastPage(data.last_page);
                setTotal(data.total);
            } catch (err) {
                console.error('Erreur chargement formations:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchFormations();
    }, [currentPage]);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Stats par Formation
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">Chargement...</p>
                </CardContent>
            </Card>
        );
    }

    if (!formations || formations.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Stats par Formation
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">Aucune formation disponible</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Stats par Formation ({formations.length})
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {formations.map((formation) => (
                        <div
                            key={formation.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex-1">
                                <h4 className="font-semibold text-sm mb-2">{formation.nom}</h4>
                                <div className="flex gap-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Users className="h-3 w-3" />
                                        <span>{formation.total_stagiaires} stagiaires</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <TrendingUp className="h-3 w-3 text-green-600" />
                                        <span>{formation.stagiaires_actifs} actifs</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant={formation.score_moyen >= 70 ? "default" : "secondary"}
                                    className="flex items-center gap-1"
                                >
                                    <Trophy className="h-3 w-3" />
                                    {formation.score_moyen}%
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Footer */}
                {lastPage > 1 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                            Page {currentPage} sur {lastPage} • {total} formation(s)
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === lastPage}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default FormateurStatsFormations;
