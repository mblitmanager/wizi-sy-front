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
            <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/5 p-6 h-[500px] flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                    <Users className="h-10 w-10 text-gray-700 animate-pulse" />
                    <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full" />
                </div>
                <p className="text-gray-500 text-sm animate-pulse">Synchronisation des présences...</p>
            </div>
        );
    }

    return (
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl flex flex-col h-[600px] overflow-hidden group hover:border-white/20 transition-all duration-500">
            {/* Header */}
            <div className="p-6 border-b border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                            <Users className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white tracking-tight">Stagiaires Actifs</h2>
                            <p className="text-xs text-gray-500 font-medium">{total} utilisateur{total > 1 ? 's' : ''} en ligne</p>
                        </div>
                    </div>
                </div>

                <div className="relative group/search">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within/search:text-yellow-500 transition-colors" />
                    <Input 
                        placeholder="Rechercher un stagiaire..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-10 bg-black/40 border-white/5 focus-visible:ring-yellow-500/50 focus-visible:border-yellow-500/50 text-sm placeholder:text-gray-600 rounded-xl"
                    />
                </div>

                <AnimatePresence>
                    {selectedIds.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2 pt-2"
                        >
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDisconnect(selectedIds)}
                                disabled={disconnecting}
                                className="bg-red-500/80 hover:bg-red-500 text-white border-none rounded-lg h-8 text-xs font-semibold px-4"
                            >
                                <LogOut className="h-3.5 w-3.5 mr-2" />
                                Déconnecter ({selectedIds.length})
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setSelectedIds([])}
                                className="text-gray-400 hover:text-white hover:bg-white/5 rounded-lg h-8 text-xs"
                            >
                                Annuler
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
                {filteredStagiaires.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-40 py-10">
                        <Users className="h-12 w-12 text-gray-600 mb-4" />
                        <p className="text-sm font-medium">Aucun stagiaire trouvé</p>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {filteredStagiaires.map((stagiaire, index) => (
                            <motion.div
                                key={stagiaire.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2, delay: index * 0.03 }}
                                className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-300 ${
                                    selectedIds.includes(stagiaire.id)
                                        ? 'bg-yellow-500/10 border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.05)]'
                                        : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.04] hover:border-white/10'
                                }`}
                            >
                                <div className="pt-1">
                                    <Checkbox
                                        checked={selectedIds.includes(stagiaire.id)}
                                        onCheckedChange={() => toggleSelection(stagiaire.id)}
                                        className="h-4 w-4 rounded-md border-white/20 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
                                    />
                                </div>
                                
                                <div className="relative shrink-0">
                                    {stagiaire.avatar ? (
                                        <img
                                            src={stagiaire.avatar}
                                            alt={`${stagiaire.prenom} ${stagiaire.nom}`}
                                            className="h-10 w-10 rounded-full object-cover ring-2 ring-white/5"
                                        />
                                    ) : (
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-white/5 flex items-center justify-center shadow-inner">
                                            <span className="text-xs font-bold text-gray-400">
                                                {getInitials(stagiaire.prenom, stagiaire.nom)}
                                            </span>
                                        </div>
                                    )}
                                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-[#050505] shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="font-semibold text-sm text-gray-100 truncate group-hover:text-yellow-500 transition-colors">
                                            {stagiaire.prenom} {stagiaire.nom}
                                        </p>
                                        <span className="text-[10px] text-gray-500 font-medium shrink-0">
                                            {getRelativeTime(stagiaire.last_activity_at)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 truncate mb-2">{stagiaire.email}</p>
                                    
                                    <div className="flex flex-wrap gap-1.5 focus:outline-none">
                                        {stagiaire.formations.slice(0, 1).map((formation, idx) => (
                                            <Badge key={idx} variant="secondary" className="bg-white/5 border-white/5 text-[10px] py-0 h-5 font-normal text-gray-400 capitalize">
                                                {formation}
                                            </Badge>
                                        ))}
                                        {stagiaire.formations.length > 1 && (
                                            <Badge variant="secondary" className="bg-white/5 border-white/5 text-[10px] py-0 h-5 font-normal text-gray-500">
                                                +{stagiaire.formations.length - 1}
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg shrink-0"
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
