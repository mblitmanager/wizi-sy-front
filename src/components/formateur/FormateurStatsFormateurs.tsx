import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface Formateur {
    id: number;
    prenom: string;
    nom: string;
    total_stagiaires: number;
}

interface PaginationData {
    data: Formateur[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export function FormateurStatsFormateurs() {
    const [formateurs, setFormateurs] = useState<Formateur[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFormateurs = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/formateur/dashboard/stats`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        formateurs_page: currentPage,
                        formateurs_per_page: 5
                    }
                });
                const data = response.data.formateurs as PaginationData;
                setFormateurs(data.data || []);
                setCurrentPage(data.current_page);
                setLastPage(data.last_page);
                setTotal(data.total);
            } catch (err) {
                console.error('Erreur chargement formateurs:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchFormateurs();
    }, [currentPage]);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Stats par Formateur
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">Chargement...</p>
                </CardContent>
            </Card>
        );
    }

    if (!formateurs || formateurs.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Stats par Formateur
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">Aucun formateur disponible</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Stats par Formateur ({formateurs.length})
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {formateurs.map((formateur) => (
                        <div
                            key={formateur.id}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-sm font-semibold text-blue-700">
                                        {formateur.prenom.charAt(0)}{formateur.nom.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium text-sm">
                                        {formateur.prenom} {formateur.nom}
                                    </p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Users className="h-3 w-3" />
                                        {formateur.total_stagiaires} stagiaires assignés
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Footer */}
                {lastPage > 1 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                            Page {currentPage} sur {lastPage} • {total} formateur(s)
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

export default FormateurStatsFormateurs;
