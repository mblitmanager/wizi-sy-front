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

    useEffect(() => {
        fetchInactiveStagiaires();
    }, [days]);

    const fetchInactiveStagiaires = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/formateur/stagiaires/inactive?days=${days}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setInactiveStagiaires(response.data.inactive_stagiaires);
        } catch (err) {
            console.error('Erreur chargement stagiaires inactifs:', err);
        } finally {
            setLoading(false);
        }
    };

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

    if (loading) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">Chargement...</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                        Stagiaires Inactifs ({inactiveStagiaires.length})
                    </CardTitle>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant={days === 7 ? 'default' : 'outline'}
                            onClick={() => setDays(7)}
                        >
                            7 jours
                        </Button>
                        <Button
                            size="sm"
                            variant={days === 14 ? 'default' : 'outline'}
                            onClick={() => setDays(14)}
                        >
                            14 jours
                        </Button>
                        <Button
                            size="sm"
                            variant={days === 30 ? 'default' : 'outline'}
                            onClick={() => setDays(30)}
                        >
                            30 jours
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
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
                            {inactiveStagiaires.map((stagiaire) => (
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
                                        {stagiaire.days_since_activity ? (
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
