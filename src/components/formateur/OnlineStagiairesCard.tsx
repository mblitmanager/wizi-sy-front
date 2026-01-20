import { useState, useEffect } from 'react';
import { Users, Circle, LogOut, X, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';

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
    const [searchTerm, setSearchTerm] = useState("");
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [disconnecting, setDisconnecting] = useState(false);
    const { toast } = useToast();

    const filteredStagiaires = stagiaires.filter(s => 
        `${s.prenom} ${s.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const fetchOnlineStagiaires = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/formateur/stagiaires/online`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                },
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
        } catch (err: unknown) {
            const error = err as any;
            toast({
                title: "Erreur",
                description: error.response?.data?.message || "Erreur lors de la déconnexion",
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
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8 h-[600px] flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                    <div className="h-16 w-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center animate-pulse">
                        <Users className="h-8 w-8 text-yellow-600/50" />
                    </div>
                </div>
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest animate-pulse">Synchronisation...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col h-[600px] overflow-hidden group hover:shadow-2xl hover:shadow-yellow-500/5 transition-all duration-700">
            {/* Header */}
            <div className="p-8 border-b border-slate-50 space-y-6 relative overflow-hidden">
                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3.5 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                            <Users className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Stagiaires Actifs</h2>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{total} en session</p>
                        </div>
                    </div>
                </div>

                <div className="relative group/search z-10">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within/search:text-yellow-600 transition-colors" />
                    <Input 
                        placeholder="Filtrer les connexions..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-11 h-12 bg-slate-50 border-none focus-visible:ring-yellow-500/20 focus-visible:bg-white focus-visible:shadow-inner text-sm font-medium placeholder:text-slate-300 rounded-2xl transition-all"
                    />
                </div>

                <AnimatePresence>
                    {selectedIds.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="flex items-center gap-2 pt-2 z-10"
                        >
                            <Button
                                size="sm"
                                onClick={() => handleDisconnect(selectedIds)}
                                disabled={disconnecting}
                                className="bg-slate-900 hover:bg-black text-white rounded-xl h-9 text-xs font-bold px-4 shadow-lg shadow-slate-900/20"
                            >
                                <LogOut className="h-3.5 w-3.5 mr-2" />
                                Déconnecter ({selectedIds.length})
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setSelectedIds([])}
                                className="text-slate-400 hover:text-slate-900 rounded-xl h-9 text-xs font-bold"
                            >
                                Annuler
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                {filteredStagiaires.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-30 py-10 scale-90">
                        <Users className="h-16 w-16 text-slate-200 mb-6" />
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Silence radio</p>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {filteredStagiaires.map((stagiaire, index) => (
                            <motion.div
                                key={stagiaire.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                className={`flex items-start gap-4 p-4 rounded-3xl border transition-all duration-400 ${
                                    selectedIds.includes(stagiaire.id)
                                        ? 'bg-yellow-50/50 border-yellow-200/50 shadow-sm'
                                        : 'bg-white border-transparent hover:bg-slate-50/50 hover:border-slate-100 hover:shadow-md'
                                }`}
                            >
                                <div className="pt-2">
                                    <Checkbox
                                        checked={selectedIds.includes(stagiaire.id)}
                                        onCheckedChange={() => toggleSelection(stagiaire.id)}
                                        className="h-5 w-5 rounded-lg border-slate-200 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500 shadow-sm"
                                    />
                                </div>
                                
                                <div className="relative shrink-0">
                                    {stagiaire.avatar ? (
                                        <img
                                            src={stagiaire.avatar}
                                            alt={`${stagiaire.prenom} ${stagiaire.nom}`}
                                            className="h-12 w-12 rounded-2xl object-cover shadow-md"
                                        />
                                    ) : (
                                        <div className="h-12 w-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm">
                                            <span className="text-xs font-black text-slate-400">
                                                {getInitials(stagiaire.prenom, stagiaire.nom)}
                                            </span>
                                        </div>
                                    )}
                                    <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 bg-green-500 rounded-full border-[3px] border-white shadow-sm ring-2 ring-green-100 animate-pulse" />
                                </div>

                                <div className="flex-1 min-w-0 py-0.5">
                                    <div className="flex items-center justify-between gap-2 mb-0.5">
                                        <p className="font-bold text-sm text-slate-900 truncate">
                                            {stagiaire.prenom} {stagiaire.nom}
                                        </p>
                                        <span className="text-[10px] text-slate-300 font-bold uppercase tracking-tighter shrink-0">
                                            {getRelativeTime(stagiaire.last_activity_at)}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 font-medium truncate mb-2">{stagiaire.email}</p>
                                    
                                    <div className="flex flex-wrap gap-1.5">
                                        {stagiaire.formations.slice(0, 1).map((formation, idx) => (
                                            <Badge key={idx} variant="outline" className="bg-slate-50 border-slate-200/60 text-[9px] py-0 px-2 h-5 font-bold text-slate-500 rounded-lg">
                                                {formation}
                                            </Badge>
                                        ))}
                                        {stagiaire.formations.length > 1 && (
                                            <Badge variant="outline" className="bg-yellow-50 border-yellow-200/50 text-[9px] py-0 px-2 h-5 font-bold text-yellow-700 rounded-lg">
                                                +{stagiaire.formations.length - 1}
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-10 w-10 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-2xl shrink-0 transition-colors"
                                    onClick={() => handleDisconnect([stagiaire.id])}
                                    disabled={disconnecting}
                                >
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}

export default OnlineStagiairesCard;
