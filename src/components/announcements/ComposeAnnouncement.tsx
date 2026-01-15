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
import { useUser } from '@/hooks/useAuth';

interface Formation {
    id: number;
    nom: string;
    title?: string;
    description?: string;
}

interface ComposeAnnouncementProps {
    onSuccess: () => void;
}

export const ComposeAnnouncement: React.FC<ComposeAnnouncementProps> = ({ onSuccess }) => {
    const { user } = useUser();
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [targetAudience, setTargetAudience] = useState<'all' | 'stagiaires' | 'formateurs' | 'autres' | 'specific_users'>('stagiaires');
    const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
    const [availableRecipients, setAvailableRecipients] = useState<Recipient[]>([]);
    const [availableFormations, setAvailableFormations] = useState<Formation[]>([]);
    const [selectedFormationId, setSelectedFormationId] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'inactive' | 'never'>('all');
    const [loading, setLoading] = useState(false);
    const [loadingRecipients, setLoadingRecipients] = useState(false);
    const [loadingFormations, setLoadingFormations] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Scheduling state
    const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
    const [scheduledTime, setScheduledTime] = useState<string>("09:00");
    const [isScheduling, setIsScheduling] = useState(false);

    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        const fetchRecipients = async () => {
            setLoadingRecipients(true);
            try {
                const responseData = await AnnouncementService.getRecipients();
                const items = Array.isArray(responseData) 
                    ? responseData 
                    : (responseData as unknown as { data: Recipient[] }).data;
                
                if (Array.isArray(items)) {
                    setAvailableRecipients(items);
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

        const fetchFormations = async () => {
            setLoadingFormations(true);
            try {
                const data = await AnnouncementService.getFormations();
                const formationsList: Formation[] = data.formations || data.data || (Array.isArray(data) ? data : []);
                setAvailableFormations(formationsList);
            } catch (error) {
                console.error("Failed to fetch formations", error);
            } finally {
                setLoadingFormations(false);
            }
        };

        fetchRecipients();
        fetchFormations();
    }, []);

    const applyFilters = (formationIdStr: string, status: 'all' | 'online' | 'inactive' | 'never') => {
        let filtered = [...availableRecipients];

        // 1. Formation Filter
        if (formationIdStr && formationIdStr !== 'none') {
            const fid = Number(formationIdStr);
            filtered = filtered.filter(u => u.formation_ids?.includes(fid));
        }

        // 2. Status Filter
        if (status === 'online') {
            filtered = filtered.filter(u => u.is_online);
        } else if (status === 'inactive') {
            // Assume inactive means no activity in last 7 days
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            filtered = filtered.filter(u => {
                if (!u.last_activity_at) return true;
                return new Date(u.last_activity_at) < sevenDaysAgo;
            });
        } else if (status === 'never') {
            filtered = filtered.filter(u => !u.last_login_at);
        }

        setSelectedRecipients(filtered.map(u => String(u.id)));
        if (filtered.length > 0) {
            toast.info(`${filtered.length} stagiaires sélectionnés par filtres`);
        }
    };

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
        <Card className="  overflow-hidden shadow-xl">
            <CardHeader className="border-b border-[#ffff]">
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
                        className="  placeholder:text-gray-600 focus:border-yellow-500/50"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Message</label>
                    <Textarea 
                        placeholder="Votre message ici..." 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="  min-h-[120px] placeholder:text-gray-600 focus:border-yellow-500/50"
                    />
                </div>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Audience Cible
                        </label>
                        <div className="flex flex-wrap gap-2 p-1 bg-black/20 rounded-lg">
                            {isAdmin && (
                                <Button
                                    type="button"
                                    variant={targetAudience === 'all' ? 'default' : 'outline'}
                                    onClick={() => {
                                        setTargetAudience('all');
                                        setSelectedRecipients([]);
                                    }}
                                    className={`h-8 text-xs ${targetAudience === 'all' ? 'bg-yellow-600 text-black hover:bg-yellow-500' : ' '}`}
                                >
                                    Tous les utilisateurs
                                </Button>
                            )}
                            <Button
                                type="button"
                                variant={targetAudience === 'stagiaires' ? 'default' : 'outline'}
                                onClick={() => {
                                    setTargetAudience('stagiaires');
                                    setSelectedRecipients([]);
                                }}
                                className={`h-8 text-xs ${targetAudience === 'stagiaires' ? 'bg-yellow-600 text-black hover:bg-yellow-500' : ' '}`}
                            >
                                {isAdmin ? "Tous les Stagiaires" : "Mes Stagiaires"}
                            </Button>
                            {isAdmin && (
                                <Button
                                    type="button"
                                    variant={targetAudience === 'formateurs' ? 'default' : 'outline'}
                                    onClick={() => {
                                        setTargetAudience('formateurs');
                                        setSelectedRecipients([]);
                                    }}
                                    className={`h-8 text-xs ${targetAudience === 'formateurs' ? 'bg-yellow-600 text-black hover:bg-yellow-500' : ' '}`}
                                >
                                    Formateurs (Admin)
                                </Button>
                            )}
                            {isAdmin && (
                                <Button
                                    type="button"
                                    variant={targetAudience === 'autres' ? 'default' : 'outline'}
                                    onClick={() => {
                                        setTargetAudience('autres');
                                        setSelectedRecipients([]);
                                    }}
                                    className={`h-8 text-xs ${targetAudience === 'autres' ? 'bg-yellow-600 text-black hover:bg-yellow-500' : ' '}`}
                                >
                                    Autres
                                </Button>
                            )}
                            <Button
                                type="button"
                                variant={targetAudience === 'specific_users' ? 'default' : 'outline'}
                                onClick={() => {
                                    setTargetAudience('specific_users');
                                }}
                                className={`h-8 text-xs ${targetAudience === 'specific_users' ? 'bg-yellow-600 text-black hover:bg-yellow-500' : 'border-[#333] hover:bg-[#222]'}`}
                            >
                                Sélection Personnalisée (Filtres)
                            </Button>
                        </div>
                    </div>

                    {targetAudience === 'specific_users' && (
                        <div className="animate-in fade-in slide-in-from-top-2 space-y-4 border border-[#333] p-4 rounded-lg bg-[#ffffff]/5">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1 space-y-2">
                                     <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block">Par Formation</label>
                                     <Select 
                                        value={selectedFormationId} 
                                        onValueChange={(val) => {
                                            setSelectedFormationId(val);
                                            applyFilters(val, statusFilter);
                                        }}
                                    >
                                        <SelectTrigger className="h-9 border-[#333] bg-transparent">
                                            <SelectValue placeholder="Toutes les formations" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#1a1a1a] border-[#333] text-white">
                                            <SelectItem value="none">Toutes les formations</SelectItem>
                                            {availableFormations.map((f: Formation) => (
                                                <SelectItem key={f.id} value={String(f.id)}>{f.nom || f.title}</SelectItem>
                                            ))}
                                        </SelectContent>
                                     </Select>
                                </div>

                                <div className="flex-1 space-y-2">
                                     <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block">Par Statut</label>
                                     <div className="flex gap-2">
                                         {[
                                             { id: 'all', label: 'Tous' },
                                             { id: 'online', label: 'En ligne' },
                                             { id: 'inactive', label: 'Inactifs (+7j)' },
                                             { id: 'never', label: 'Jamais' }
                                         ].map((s) => (
                                             <Button
                                                key={s.id}
                                                type="button"
                                                variant={statusFilter === s.id ? 'secondary' : 'outline'}
                                                onClick={() => {
                                                    const newStatus = s.id as 'all' | 'online' | 'inactive' | 'never';
                                                    setStatusFilter(newStatus);
                                                    applyFilters(selectedFormationId, newStatus);
                                                }}
                                                className={`h-7 px-2 text-[10px] ${statusFilter === s.id ? 'bg-white text-black' : 'border-[#333]'}`}
                                             >
                                                 {s.label}
                                             </Button>
                                         ))}
                                     </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between pt-2 border-t border-[#333]">
                                <span className="text-[10px] text-gray-500 italic">
                                    Les filtres auto-sélectionnent les destinataires ci-dessous.
                                </span>
                                <Button 
                                    variant="link" 
                                    className="h-4 p-0 text-[10px] text-yellow-500"
                                    onClick={() => {
                                        setSelectedFormationId('none');
                                        setStatusFilter('all');
                                        setSelectedRecipients([]);
                                    }}
                                >
                                    Réinitialiser la sélection
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                         <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Programmation (Optionnel)
                        </label>
                        <Popover open={isScheduling} onOpenChange={setIsScheduling}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={`w-full justify-start text-left font-normal border-[#333] ${!scheduledDate ? "text-gray-400  " : "text-yellow-500 border-yellow-500/50  "}`}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {scheduledDate ? (
                                         <span>{format(scheduledDate, "PPP", { locale: fr })} à {scheduledTime}</span>
                                    ) : (
                                        <span>Envoyer maintenant</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0   " align="start">
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
                                            className="  h-8"
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
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-400">
                                    Sélectionner les destinataires ({selectedRecipients.length})
                                </label>
                                <div className="relative w-48">
                                    <Input 
                                        placeholder="Rechercher..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="h-8  border-[#333] text-xs"
                                    />
                                </div>
                            </div>
                            
                            {loadingRecipients ? (
                                <div className="text-sm text-yellow-500">Chargement de votre réseau...</div>
                            ) : (
                                <div className="max-h-48 overflow-y-auto  border border-[#333] rounded-md p-2">
                                    {availableRecipients.length === 0 ? (
                                        <div className="text-sm text-gray-500 p-2">Aucun utilisateur trouvé.</div>
                                    ) : (
                                        availableRecipients
                                            .filter(u => 
                                                u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                                u.email?.toLowerCase().includes(searchTerm.toLowerCase())
                                            )
                                            .map((user) => (
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
