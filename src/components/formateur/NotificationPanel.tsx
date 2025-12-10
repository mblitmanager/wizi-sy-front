import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Bell, Send, Users, Check } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface Stagiaire {
    id: number;
    prenom: string;
    nom: string;
    email: string;
}

export function NotificationPanel() {
    const [stagiaires, setStagiaires] = useState<Stagiaire[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchStagiaires();
    }, []);

    const fetchStagiaires = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/formateur/stagiaires`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStagiaires(response.data.stagiaires);
        } catch (err) {
            console.error('Erreur chargement stagiaires:', err);
            toast({
                title: 'Erreur',
                description: 'Impossible de charger la liste des stagiaires',
                variant: 'destructive',
            });
        }
    };

    const handleSendNotification = async () => {
        if (selectedIds.length === 0) {
            toast({
                title: 'Attention',
                description: 'Sélectionnez au moins un stagiaire',
                variant: 'destructive',
            });
            return;
        }

        if (!title || !message) {
            toast({
                title: 'Attention',
                description: 'Le titre et le message sont requis',
                variant: 'destructive',
            });
            return;
        }

        setSending(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${API_URL}/formateur/send-notification`,
                {
                    recipient_ids: selectedIds,
                    title,
                    body: message,
                    data: {},
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            toast({
                title: 'Succès',
                description: `Notification envoyée à ${selectedIds.length} stagiaire(s)`,
            });

            setTitle('');
            setMessage('');
            setSelectedIds([]);
        } catch (err) {
            console.error('Erreur envoi notification:', err);
            toast({
                title: 'Erreur',
                description: 'Impossible d\'envoyer la notification',
                variant: 'destructive',
            });
        } finally {
            setSending(false);
        }
    };

    const filteredStagiaires = stagiaires.filter((s) =>
        `${s.prenom} ${s.nom} ${s.email}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleAll = () => {
        if (selectedIds.length === filteredStagiaires.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredStagiaires.map((s) => s.id));
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-blue-600" />
                    Envoyer une Notification FCM
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Sélection destinataires */}
                <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Destinataires ({selectedIds.length} sélectionné(s))
                    </label>

                    <Input
                        placeholder="Rechercher un stagiaire..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mb-2"
                    />

                    <div className="border rounded-lg p-4 max-h-64 overflow-y-auto space-y-2">
                        <div className="flex items-center space-x-2 pb-2 border-b">
                            <Checkbox
                                checked={selectedIds.length === filteredStagiaires.length && filteredStagiaires.length > 0}
                                onCheckedChange={toggleAll}
                            />
                            <label className="text-sm font-medium">
                                Tous ({filteredStagiaires.length})
                            </label>
                        </div>

                        {filteredStagiaires.map((stagiaire) => (
                            <div key={stagiaire.id} className="flex items-center space-x-2">
                                <Checkbox
                                    checked={selectedIds.includes(stagiaire.id)}
                                    onCheckedChange={(checked) => {
                                        setSelectedIds(
                                            checked
                                                ? [...selectedIds, stagiaire.id]
                                                : selectedIds.filter((id) => id !== stagiaire.id)
                                        );
                                    }}
                                />
                                <label className="text-sm">
                                    {stagiaire.prenom} {stagiaire.nom}
                                    <span className="text-gray-500 ml-1">({stagiaire.email})</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Titre */}
                <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Titre
                    </label>
                    <Input
                        placeholder="Ex: Nouveau quiz disponible"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={100}
                    />
                    <p className="text-xs text-gray-500 mt-1">{title.length}/100 caractères</p>
                </div>

                {/* Message */}
                <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Message
                    </label>
                    <Textarea
                        placeholder="Écrivez le contenu de la notification..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="min-h-32"
                        maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1">{message.length}/500 caractères</p>
                </div>

                {/* Preview */}
                {title && message && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs font-semibold text-gray-600 mb-2">Aperçu</p>
                        <div className="flex items-start gap-3 bg-white p-3 rounded shadow-sm">
                            <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div className="flex-1">
                                <p className="font-semibold text-sm">{title}</p>
                                <p className="text-sm text-gray-800 mt-1">{message}</p>
                                <p className="text-xs text-gray-400 mt-1">À l'instant</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bouton envoi */}
                <Button
                    onClick={handleSendNotification}
                    disabled={sending || selectedIds.length === 0}
                    className="w-full"
                >
                    <Send className="w-4 h-4 mr-2" />
                    {sending ? 'Envoi en cours...' : `Envoyer à ${selectedIds.length} stagiaire(s)`}
                </Button>
            </CardContent>
        </Card>
    );
}

export default NotificationPanel;
