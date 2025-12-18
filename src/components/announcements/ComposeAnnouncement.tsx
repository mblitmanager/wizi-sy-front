import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Megaphone, Send, Users, Check } from "lucide-react";
import { toast } from "sonner";
import { AnnouncementService, Recipient } from "@/services/AnnouncementService";

interface ComposeAnnouncementProps {
    onSuccess: () => void;
}

export const ComposeAnnouncement: React.FC<ComposeAnnouncementProps> = ({ onSuccess }) => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [targetAudience, setTargetAudience] = useState<'all' | 'stagiaires' | 'formateurs' | 'autres' | 'specific_users'>('stagiaires');
    const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]); // Store IDs as strings for Select value handling
    const [availableRecipients, setAvailableRecipients] = useState<Recipient[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingRecipients, setLoadingRecipients] = useState(false);

    // Fetch recipients when component mounts or audience changes to specific
    useEffect(() => {
        const fetchRecipients = async () => {
            setLoadingRecipients(true);
            try {
                const data = await AnnouncementService.getRecipients();
                // Ensure data is an array
                if (Array.isArray(data)) {
                    setAvailableRecipients(data);
                } else if ((data as any).data && Array.isArray((data as any).data)) { 
                     // Handle pagination or wrapper case just in case
                     setAvailableRecipients((data as any).data);
                } else {
                    setAvailableRecipients([]);
                }
            } catch (error) {
                console.error("Failed to fetch recipients", error);
                toast.error("Impossible de charger la liste des utilisateurs");
            } finally {
                setLoadingRecipients(false);
            }
        };

        // Pre-fetch recipients for user convenience or on demand
        fetchRecipients();
    }, []);

    const handleSend = async () => {
        if (!title || !message) {
            toast.error("Veuillez remplir le titre et le message");
            return;
        }

        if (targetAudience === 'specific_users' && selectedRecipients.length === 0) {
            toast.error("Veuillez sélectionner au moins un utilisateur");
            return;
        }

        setLoading(true);
        try {
            await AnnouncementService.sendAnnouncement({
                title,
                message,
                target_audience: targetAudience,
                recipient_ids: targetAudience === 'specific_users' ? selectedRecipients.map(Number) : undefined,
            });
            toast.success("Annonce envoyée avec succès !");
            setTitle('');
            setMessage('');
            setTargetAudience('stagiaires');
            setSelectedRecipients([]);
            onSuccess();
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de l'envoi de l'annonce");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-[#1a1a1a] border-[#333] text-white overflow-hidden shadow-xl">
            <CardHeader className="bg-gradient-to-r from-[#2a2a2a] to-[#1a1a1a] border-b border-[#333]">
                <CardTitle className="flex items-center gap-2 text-yellow-500">
                    <Megaphone className="w-5 h-5" />
                    Nouvelle Annonce
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Titre (Sujet)</label>
                    <Input 
                        placeholder="Ex: Maintenance prévue..." 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-[#0a0a0a] border-[#333] text-white placeholder:text-gray-600 focus:border-yellow-500/50"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Message</label>
                    <Textarea 
                        placeholder="Votre message ici..." 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="bg-[#0a0a0a] border-[#333] text-white min-h-[120px] placeholder:text-gray-600 focus:border-yellow-500/50"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Audience Cible
                    </label>
                    <Select 
                        value={targetAudience} 
                        onValueChange={(val: any) => {
                            setTargetAudience(val);
                            // Reset selection if switching away from specific_users
                            if (val !== 'specific_users') setSelectedRecipients([]);
                        }}
                    >
                        <SelectTrigger className="bg-[#0a0a0a] border-[#333] text-white">
                            <SelectValue placeholder="Sélectionner une audience" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1a1a] border-[#333] text-white">
                            <SelectItem value="all">Tous les utilisateurs (Admin)</SelectItem>
                            <SelectItem value="stagiaires">Mes Stagiaires</SelectItem>
                            <SelectItem value="formateurs">Formateurs (Admin)</SelectItem>
                            <SelectItem value="autres">Autres</SelectItem>
                            <SelectItem value="specific_users">Utilisateurs spécifiques</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Specific User Selection - Simple Multi-select simulation using native select for simplicity or list */}
                {targetAudience === 'specific_users' && (
                     <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                        <label className="text-sm font-medium text-gray-400">
                            Sélectionner les destinataires ({selectedRecipients.length})
                        </label>
                        {loadingRecipients ? (
                            <div className="text-sm text-yellow-500">Chargement de votre réseau...</div>
                        ) : (
                            <div className="max-h-48 overflow-y-auto bg-[#0a0a0a] border border-[#333] rounded-md p-2">
                                {availableRecipients.length === 0 ? (
                                    <div className="text-sm text-gray-500 p-2">Aucun utilisateur trouvé dans votre réseau.</div>
                                ) : (
                                    availableRecipients.map((user) => (
                                        <div 
                                            key={user.id} 
                                            className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${selectedRecipients.includes(String(user.id)) ? 'bg-yellow-500/10 text-yellow-500' : 'hover:bg-[#222]'}`}
                                            onClick={() => {
                                                const id = String(user.id);
                                                setSelectedRecipients(prev => 
                                                    prev.includes(id) 
                                                    ? prev.filter(p => p !== id) 
                                                    : [...prev, id]
                                                );
                                            }}
                                        >
                                            <span className="text-sm">{user.name} ({user.role})</span>
                                            {selectedRecipients.includes(String(user.id)) && <Check className="w-4 h-4" />}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                        <p className="text-xs text-gray-500">Cliquez pour sélectionner/désélectionner</p>
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                     <Button 
                        onClick={handleSend} 
                        disabled={loading}
                        className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-semibold"
                    >
                        {loading ? 'Envoi...' : (
                            <>
                                <Send className="w-4 h-4 mr-2" />
                                Envoyer
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
