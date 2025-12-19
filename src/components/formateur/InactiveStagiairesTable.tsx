import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface InactiveStagiaire {
    id: number;
    prenom: string;
    nom: string;
    email: string;
    last_activity_at: string | null;
    days_since_activity: number | null;
    never_connected: boolean;
    last_client: string | null;
}

export function InactiveStagiairesTable() {
    const [inactiveStagiaires, setInactiveStagiaires] = useState<InactiveStagiaire[]>([]);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(7);
    const [scope, setScope] = useState<'mine' | 'all'>('mine');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    const fetchInactiveStagiaires = React.useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            setLoading(true);
            const response = await axios.get(
                `${API_URL}/formateur/stagiaires/inactive?days=${days}&scope=${scope}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // API responses vary; try common fields for items
            const items = response.data.inactive_stagiaires || response.data.items || response.data.data || [];

            // client-side pagination: derive total from the fetched items
            setInactiveStagiaires(items);
            setTotalCount(items.length);
        } catch (err) {
            console.error('Erreur chargement stagiaires inactifs:', err);
        } finally {
            setLoading(false);
        }
    }, [days, scope]);

    useEffect(() => {
        fetchInactiveStagiaires();
    }, [fetchInactiveStagiaires]);

    // page is reset to 1 where appropriate (days buttons and pageSize selector)

    const getClientIcon = (client: string | null) => {
        switch (client) {
            case 'web':
                return '🌐';
            case 'android':
                return '📱';
            case 'ios':
                return '🍎';
            default:
                return '❓';
        }
    };

    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    if (loading) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">Chargement...</p>
                </CardContent>
            </Card>
        );
    }

    const start = (page - 1) * pageSize;
    const paginated = inactiveStagiaires.slice(start, start + pageSize);

    return (
        <Card>
            <CardHeader className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                        Stagiaires Inactifs ({inactiveStagiaires.length})
                    </CardTitle>
                    <Tabs value={scope} onValueChange={(v) => setScope(v as 'mine' | 'all')} className="w-full md:w-auto">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="mine">Mes stagiaires</TabsTrigger>
                            <TabsTrigger value="all">Tous les stagiaires</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant={days === 7 ? 'default' : 'outline'}
                            onClick={() => {
                                setDays(7);
                                setPage(1);
                                setLoading(true);
                            }}
                        >
                            7 jours
                        </Button>
                        <Button
                            size="sm"
                            variant={days === 14 ? 'default' : 'outline'}
                            onClick={() => {
                                setDays(14);
                                setPage(1);
                                setLoading(true);
                            }}
                        >
                            14 jours
                        </Button>
                        <Button
                            size="sm"
                            variant={days === 30 ? 'default' : 'outline'}
                            onClick={() => {
                                setDays(30);
                                setPage(1);
                                setLoading(true);
                            }}
                        >
                            30 jours
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Afficher</span>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setPage(1);
                            }}
                            className="rounded-md border px-2 py-1 text-sm"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                        <span className="text-sm text-muted-foreground">/ {totalCount} résultats</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                if (page > 1) {
                                    setPage((p) => p - 1);
                                }
                            }}
                            disabled={page <= 1}
                        >
                            Préc
                        </Button>

                        {/* simple page number buttons, cap to a window */}
                        {Array.from({ length: Math.min(7, totalPages) }).map((_, i) => {
                            // center current page in the window when possible
                            const half = Math.floor(Math.min(7, totalPages) / 2);
                            let start = Math.max(1, page - half);
                            if (start + Math.min(7, totalPages) - 1 > totalPages) {
                                start = Math.max(1, totalPages - Math.min(7, totalPages) + 1);
                            }
                            const pageNumber = start + i;
                            if (pageNumber > totalPages) return null;
                            return (
                                <Button
                                    key={pageNumber}
                                    size="sm"
                                    variant={pageNumber === page ? 'default' : 'ghost'}
                                    onClick={() => setPage(pageNumber)}
                                >
                                    {pageNumber}
                                </Button>
                            );
                        })}

                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                if (page < totalPages) {
                                    setPage((p) => p + 1);
                                }
                            }}
                            disabled={page >= totalPages}
                        >
                            Suiv
                        </Button>
                    </div>
                </div>
                {inactiveStagiaires.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">
                        Aucun stagiaire inactif trouvé 🎉
                    </p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Dernière Activité</TableHead>
                                <TableHead>Plateforme</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginated.map((stagiaire) => (
                                <TableRow key={stagiaire.id}>
                                    <TableCell>
                                        <div className="font-medium">
                                            {stagiaire.prenom} {stagiaire.nom}
                                        </div>
                                        {stagiaire.never_connected && (
                                            <Badge variant="destructive" className="mt-1">
                                                Jamais connecté
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {stagiaire.email}
                                    </TableCell>
                                    <TableCell>
                                        {typeof stagiaire.days_since_activity === 'number' && stagiaire.days_since_activity > 0 ? (
                                            <Badge variant="outline" className="bg-orange-50">
                                                Il y a {stagiaire.days_since_activity} jours
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary">Jamais</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <span title={stagiaire.last_client || 'Inconnu'}>
                                            {getClientIcon(stagiaire.last_client)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => window.open(`mailto:${stagiaire.email}`)}
                                            >
                                                <Mail className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}

export default InactiveStagiairesTable;
