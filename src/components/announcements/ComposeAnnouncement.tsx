import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Megaphone, Send, Users, Check, Clock, Calendar as CalendarIcon, X } from "lucide-react";
import { toast } from "sonner";
import { AnnouncementService, Recipient } from "@/services/AnnouncementService";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar"; // Assuming you have a calendar component
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ComposeAnnouncementProps {
    onSuccess: () => void;
}

export const ComposeAnnouncement: React.FC<ComposeAnnouncementProps> = ({ onSuccess }) => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [targetAudience, setTargetAudience] = useState<'all' | 'stagiaires' | 'formateurs' | 'autres' | 'specific_users'>('stagiaires');
    const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
    const [availableRecipients, setAvailableRecipients] = useState<Recipient[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingRecipients, setLoadingRecipients] = useState(false);
    
    // Scheduling state
    const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
    const [scheduledTime, setScheduledTime] = useState<string>("09:00");
    const [isScheduling, setIsScheduling] = useState(false);

    useEffect(() => {
        const fetchRecipients = async () => {
            setLoadingRecipients(true);
            try {
                const data = await AnnouncementService.getRecipients();
                if (Array.isArray(data)) {
                    setAvailableRecipients(data);
                } else if ((data as any).data && Array.isArray((data as any).data)) { 
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

        let scheduledAtIso = undefined;
        if (scheduledDate) {
            const [hours, minutes] = scheduledTime.split(':').map(Number);
            const date = new Date(scheduledDate);
            date.setHours(hours, minutes, 0);
            
            if (date <= new Date()) {
                 toast.error("La date de programmation doit être dans le futur");
                 return;
            }
            scheduledAtIso = date.toISOString(); // or format properly for Laravel: YYYY-MM-DD HH:mm:ss
        }

        setLoading(true);
        try {
            await AnnouncementService.sendAnnouncement({
                title,
                message,
                target_audience: targetAudience,
                recipient_ids: targetAudience === 'specific_users' ? selectedRecipients.map(Number) : undefined,
                scheduled_at: scheduledAtIso,
            });
            toast.success(scheduledDate ? "Annonce programmée avec succès !" : "Annonce envoyée avec succès !");
            
            // Reset form
            setTitle('');
            setMessage('');
            setTargetAudience('stagiaires');
            setSelectedRecipients([]);
            setScheduledDate(undefined);
            setIsScheduling(false);
            
            onSuccess();
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de l'envoi");
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Audience Cible
                        </label>
                        <Select 
                            value={targetAudience} 
                            onValueChange={(val: any) => {
                                setTargetAudience(val);
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

                    <div className="space-y-2">
                         <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Programmation (Optionnel)
                        </label>
                        <Popover open={isScheduling} onOpenChange={setIsScheduling}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={`w-full justify-start text-left font-normal border-[#333] ${!scheduledDate ? "text-gray-400 bg-[#0a0a0a]" : "text-yellow-500 border-yellow-500/50 bg-[#0a0a0a]"}`}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {scheduledDate ? (
                                         <span>{format(scheduledDate, "PPP", { locale: fr })} à {scheduledTime}</span>
                                    ) : (
                                        <span>Envoyer maintenant</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-[#1a1a1a] border-[#333] text-white" align="start">
                                <Calendar
                                    mode="single"
                                    selected={scheduledDate}
                                    onSelect={setScheduledDate}
                                    initialFocus
                                    className="p-3 pointer-events-auto"
                                />
                                <div className="p-3 border-t border-[#333] space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <Input 
                                            type="time" 
                                            value={scheduledTime}
                                            onChange={(e) => setScheduledTime(e.target.value)}
                                            className="bg-[#0a0a0a] border-[#333] text-white h-8"
                                        />
                                    </div>
                                    <div className="flex justify-between gap-2">
                                         <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => {
                                                setScheduledDate(undefined);
                                                setIsScheduling(false);
                                            }}
                                            className="text-gray-400 hover:text-white"
                                        >
                                            Effacer
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            onClick={() => setIsScheduling(false)}
                                            className="bg-yellow-600 hover:bg-yellow-500 text-black"
                                        >
                                            Valider
                                        </Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

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
                                    <div className="text-sm text-gray-500 p-2">Aucun utilisateur trouvé.</div>
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
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                     <Button 
                        onClick={handleSend} 
                        disabled={loading}
                        className={`font-semibold ${scheduledDate ? 'bg-green-600 hover:bg-green-500' : 'bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400'} text-black`}
                    >
                        {loading ? 'Traitement...' : (
                            <>
                                {scheduledDate ? <Clock className="w-4 h-4 mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                                {scheduledDate ? 'Programmer l\'envoi' : 'Envoyer maintenant'}
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
