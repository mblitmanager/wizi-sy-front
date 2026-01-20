import { useEffect, useState, useCallback } from 'react';
import { Layout } from '@/components/layout/Layout';
import {
    Trophy,
    Users,
    ChevronDown,
    ChevronUp,
    Filter,
    Gamepad2,
    Search,
} from 'lucide-react';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useUser } from '@/hooks/useAuth';

interface Stagiaire {
    id: number;
    prenom: string;
    nom: string;
    image: string | null;
    points: number;
}

interface FormateurRanking {
    id: number;
    prenom: string;
    nom: string;
    image: string | null;
    total_stagiaires: number;
    total_points: number;
    stagiaires: Stagiaire[];
}

interface Formation {
    id: number;
    nom: string;
}

export function TrainerArenaPage() {
    const { user } = useUser();
    const [ranking, setRanking] = useState<FormateurRanking[]>([]);
    const [formations, setFormations] = useState<Formation[]>([]);
    const [selectedFormationId, setSelectedFormationId] = useState<string>('all');
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<string>('all');
    const [expandedFormateur, setExpandedFormateur] = useState<number | null>(null);

    const fetchRanking = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/formateur/classement/arena', {
                params: { 
                    period,
                    formation_id: selectedFormationId === 'all' ? undefined : selectedFormationId
                },
            });
            setRanking(response.data || []);
            // Auto-expand the current user's card if found
            if (response.data && user) {
                const myCard = response.data.find((f: FormateurRanking) => f.nom === user.name);
                if (myCard) setExpandedFormateur(myCard.id);
            }
        } catch (err) {
            console.error('Erreur chargement classement arena:', err);
        } finally {
            setLoading(false);
        }
    }, [period, selectedFormationId, user]);

    useEffect(() => {
        const fetchFormations = async () => {
            try {
                const response = await api.get('/formateur/formations');
                setFormations(response.data?.formations || []);
            } catch (err) {
                console.error('Erreur chargement formations:', err);
            }
        };
        fetchFormations();
    }, []);

    useEffect(() => {
        fetchRanking();
    }, [fetchRanking]);

    const toggleExpand = (id: number) => {
        setExpandedFormateur(expandedFormateur === id ? null : id);
    };

    if (loading && ranking.length === 0) {
        return (
            <Layout>
                <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-4">
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full"
                    />
                    <p className="text-slate-400 font-medium mt-4 text-sm tracking-widest uppercase">Initialisation de l'Arène...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans selection:bg-yellow-500/30">
                <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 relative z-10">

                    {/* Top Navigation */}
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-2xl font-black tracking-tight flex items-center gap-3 text-slate-900">
                            <Gamepad2 className="w-8 h-8 text-yellow-500" />
                            Arène des Formateurs
                        </h1>
                        <button className="p-2 bg-slate-200/50 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                            <Search className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Period Switcher */}
                    <div className="bg-slate-200/50 p-1 rounded-2xl flex items-center mb-6 border border-slate-200/50">
                        {[
                            { id: 'week', label: 'Hebdomadaire' },
                            { id: 'month', label: 'Mensuel' },
                            { id: 'all', label: 'Tout temps' }
                        ].map((p) => (
                            <button
                                key={p.id}
                                onClick={() => setPeriod(p.id)}
                                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-300 ${
                                    period === p.id 
                                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' 
                                    : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>

                    {/* Filters Row */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-8">
                        <div className="flex-1">
                            <Select value={selectedFormationId} onValueChange={setSelectedFormationId}>
                                <SelectTrigger className="w-full bg-white border-slate-200 h-12 rounded-2xl focus:ring-yellow-500/20 text-slate-700 font-bold text-sm shadow-sm">
                                    <SelectValue placeholder="Toutes les Formations" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200 text-slate-900 rounded-2xl">
                                    <SelectItem value="all">Toutes les Formations</SelectItem>
                                    {formations.map((f) => (
                                        <SelectItem key={f.id} value={String(f.id)}>{f.nom}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-1">
                            <Select defaultValue="all">
                                <SelectTrigger className="w-full bg-white border-slate-200 h-12 rounded-2xl focus:ring-yellow-500/20 text-slate-700 font-bold text-sm shadow-sm">
                                    <SelectValue placeholder="Tous les Formateurs" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200 text-slate-900 rounded-2xl">
                                    <SelectItem value="all">Tous les Formateurs</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Leaderboard */}
                    <div className="space-y-4">
                        <AnimatePresence>
                            {ranking.map((formateur, index) => {
                                const isExpanded = expandedFormateur === formateur.id;
                                const isMe = user?.name === formateur.nom;

                                return (
                                    <motion.div
                                        key={formateur.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`rounded-3xl border transition-all duration-500 overflow-hidden shadow-sm ${
                                            isMe 
                                            ? 'bg-gradient-to-br from-yellow-500/10 to-white border-yellow-200' 
                                            : 'bg-white border-slate-200 hover:border-slate-300'
                                        }`}
                                    >
                                        {/* Formateur Header Card */}
                                        <div 
                                            onClick={() => toggleExpand(formateur.id)}
                                            className="p-5 flex items-center justify-between cursor-pointer"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <div className="h-16 w-16 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center border-2 border-slate-100">
                                                        {formateur.image ? (
                                                            <img src={formateur.image} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="text-xl font-black text-slate-300">
                                                                {formateur.prenom[0]}{formateur.nom[0]}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className={`absolute -top-2 -left-2 h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-black shadow-md ${
                                                        index === 0 ? 'bg-yellow-500 text-black' : 
                                                        index === 1 ? 'bg-slate-200 text-slate-700' :
                                                        index === 2 ? 'bg-amber-700 text-white' : 'bg-slate-100 text-slate-500 border border-slate-200'
                                                    }`}>
                                                        {index + 1}
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="font-black text-lg flex items-center gap-2 text-slate-900">
                                                        Formateur {formateur.prenom} {formateur.nom}
                                                        {isMe && <span className="text-[10px] bg-yellow-500 text-black px-1.5 py-0.5 rounded font-black uppercase">Vous</span>}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                                                        <Users className="w-3.5 h-3.5" />
                                                        Équipe de {formateur.total_stagiaires} Apprenti{formateur.total_stagiaires > 1 ? 's' : ''}
                                                    </div>
                                                    <div className="text-yellow-500 font-black text-sm uppercase tracking-wider">
                                                        {formateur.total_points.toLocaleString()} Pts Total
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <button className={`p-2 rounded-xl transition-all shadow-sm ${isExpanded ? 'bg-yellow-500 text-black' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                                                    {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Expanded Stagiaires List */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="border-t border-slate-100 bg-slate-50/50"
                                                >
                                                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {formateur.stagiaires.length > 0 ? (
                                                            formateur.stagiaires.map((stagiaire) => (
                                                                <div 
                                                                    key={stagiaire.id}
                                                                    className="bg-white p-4 rounded-2xl flex items-center justify-between group hover:bg-slate-50 transition-all border border-slate-200/50 shadow-sm"
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="h-10 w-10 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200/50">
                                                                            {stagiaire.image ? (
                                                                                <img src={stagiaire.image} alt="" className="w-full h-full object-cover" />
                                                                            ) : (
                                                                                <span className="text-xs font-black text-white/20">
                                                                                    {stagiaire.prenom[0]}{stagiaire.nom[0]}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-bold text-sm text-slate-700 group-hover:text-slate-900 transition-colors">
                                                                                {stagiaire.prenom} {stagiaire.nom}
                                                                            </p>
                                                                            <p className="text-[10px] text-yellow-500 font-black uppercase tracking-tight">
                                                                                {stagiaire.points.toLocaleString()} Pts
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="h-1.5 w-1.5 rounded-full bg-yellow-500/50 group-hover:bg-yellow-500 transition-colors" />
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="col-span-full py-4 text-center text-slate-400 font-bold text-xs uppercase tracking-widest italic">
                                                                Aucun défi relevé par cette équipe
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                        {ranking.length === 0 && !loading && (
                            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
                                <Trophy className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                <p className="text-slate-500 font-black uppercase tracking-widest text-sm">L'arène est vide pour le moment</p>
                                <p className="text-slate-400 text-xs mt-2">Revenez plus tard quand les formateurs auront formé leurs équipes.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default TrainerArenaPage;
