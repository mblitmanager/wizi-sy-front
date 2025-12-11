import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Circle, LogOut, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface OnlineStagiaire {
    id: number;
    prenom: string;
    nom: string;
    email: string;
    avatar: string | null;
    last_activity_at: string;
    formations: string[];
}

export function OnlineStagiairesCard() {
    const [stagiaires, setStagiaires] = useState<OnlineStagiaire[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [disconnecting, setDisconnecting] = useState(false);
    const { toast } = useToast();

    const fetchOnlineStagiaires = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/formateur/stagiaires/online`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStagiaires(response.data.stagiaires || []);
            setTotal(response.data.total || 0);
            setSelectedIds([]); // Reset selection after refresh
        } catch (err) {
            console.error('Erreur chargement stagiaires en ligne:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOnlineStagiaires();

        // Rafraîchir toutes les 30 secondes
        const interval = setInterval(fetchOnlineStagiaires, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleDisconnect = async (stagiaireIds: number[]) => {
        if (stagiaireIds.length === 0) return;

        setDisconnecting(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_URL}/formateur/stagiaires/disconnect`,
                { stagiaire_ids: stagiaireIds },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast({
                title: "Succès",
                description: response.data.message,
            });

            // Rafraîchir la liste
            await fetchOnlineStagiaires();
        } catch (err: any) {
            toast({
                title: "Erreur",
                description: err.response?.data?.message || "Erreur lors de la déconnexion",
                variant: "destructive",
            });
        } finally {
            setDisconnecting(false);
        }
    };

    const toggleSelection = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === stagiaires.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(stagiaires.map(s => s.id));
        }
    };

    const getInitials = (prenom: string, nom: string) => {
        return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
    };

    const getRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'À l\'instant';
        if (diffMins < 60) return `Il y a ${diffMins} min`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `Il y a ${diffHours}h`;
        return date.toLocaleDateString('fr-FR');
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Stagiaires En Ligne
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">Chargement...</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Stagiaires En Ligne
                    </div>
                    <Badge variant="default" className="flex items-center gap-1">
                        <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                        {total}
                    </Badge>
                </CardTitle>
                {selectedIds.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDisconnect(selectedIds)}
                            disabled={disconnecting}
                        >
                            <LogOut className="h-4 w-4 mr-1" />
                            Déconnecter ({selectedIds.length})
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedIds([])}
                        >
                            <X className="h-4 w-4 mr-1" />
                            Annuler
                        </Button>
                    </div>
                )}
            </CardHeader>
            <CardContent>
                {stagiaires.length === 0 ? (
                    <div className="text-center py-8">
                        <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-muted-foreground text-sm">Aucun stagiaire en ligne</p>
                    </div>
                ) : (
                    <>
                        {stagiaires.length > 0 && (
                            <div className="flex items-center gap-2 mb-3 pb-3 border-b">
                                <Checkbox
                                    checked={selectedIds.length === stagiaires.length}
                                    onCheckedChange={toggleSelectAll}
                                    className="h-4 w-4"
                                />
                                <span className="text-sm text-muted-foreground">
                                    Sélectionner tout
                                </span>
                            </div>
                        )}
                        <div className="space-y-3 max-h-[400px] overflow-y-auto">
                            {stagiaires.map((stagiaire) => (
                                <div
                                    key={stagiaire.id}
                                    className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${selectedIds.includes(stagiaire.id)
                                            ? 'bg-blue-50 border-blue-200'
                                            : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <Checkbox
                                        checked={selectedIds.includes(stagiaire.id)}
                                        onCheckedChange={() => toggleSelection(stagiaire.id)}
                                        className="mt-2 h-4 w-4"
                                    />
                                    <div className="relative">
                                        {stagiaire.avatar ? (
                                            <img
                                                src={stagiaire.avatar}
                                                alt={`${stagiaire.prenom} ${stagiaire.nom}`}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                <span className="text-sm font-semibold text-blue-700">
                                                    {getInitials(stagiaire.prenom, stagiaire.nom)}
                                                </span>
                                            </div>
                                        )}
                                        <Circle className="absolute -bottom-0.5 -right-0.5 h-3 w-3 fill-green-500 text-green-500 ring-2 ring-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">
                                            {stagiaire.prenom} {stagiaire.nom}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {stagiaire.email}
                                        </p>
                                        {stagiaire.formations.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {stagiaire.formations.slice(0, 2).map((formation, idx) => (
                                                    <Badge key={idx} variant="secondary" className="text-xs">
                                                        {formation}
                                                    </Badge>
                                                ))}
                                                {stagiaire.formations.length > 2 && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        +{stagiaire.formations.length - 2}
                                                    </Badge>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                                            {getRelativeTime(stagiaire.last_activity_at)}
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-6 px-2"
                                            onClick={() => handleDisconnect([stagiaire.id])}
                                            disabled={disconnecting}
                                        >
                                            <LogOut className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

export default OnlineStagiairesCard;
