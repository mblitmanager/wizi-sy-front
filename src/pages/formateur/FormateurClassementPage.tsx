import { useEffect, useState, useCallback } from 'react';
import { Layout } from '@/components/layout/Layout';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Medal, Award, Calendar, Users, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';

interface StagiaireRanking {
    rank: number;
    id: number;
    prenom: string;
    nom: string;
    email: string;
    total_points: number;
    total_quiz: number;
    avg_score: number;
}

export function FormateurClassementPage() {
interface Formation {
    id: number;
    nom: string;
}

export function FormateurClassementPage() {
    const [ranking, setRanking] = useState<StagiaireRanking[]>([]);
    const [formations, setFormations] = useState<Formation[]>([]);
    const [selectedFormationId, setSelectedFormationId] = useState<string>('global');
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<string>('all');

    const fetchRanking = useCallback(async () => {
        try {
            setLoading(true);
            const endpoint = selectedFormationId === 'global' 
                ? `/formateur/classement/mes-stagiaires` 
                : `/formateur/classement/formation/${selectedFormationId}`;
            
            const response = await api.get(endpoint, {
                params: { period },
            });
            setRanking(response.data?.ranking || []);
        } catch (err) {
            console.error('Erreur chargement classement:', err);
        } finally {
            setLoading(false);
        }
    }, [period, selectedFormationId]);

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

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Trophy className="h-5 w-5 text-yellow-500" />;
            case 2:
                return <Medal className="h-5 w-5 text-gray-400" />;
            case 3:
                return <Medal className="h-5 w-5 text-orange-600" />;
            default:
                return <Award className="h-5 w-5 text-gray-300" />;
        }
    };

    const getRankColor = (rank: number) => {
        switch (rank) {
            case 1:
                return 'bg-yellow-50 border-yellow-200';
            case 2:
                return 'bg-gray-50 border-gray-200';
            case 3:
                return 'bg-orange-50 border-orange-200';
            default:
                return '';
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 space-y-6">
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.1, 1],
                            opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="p-4 rounded-3xl bg-yellow-500/10 border border-yellow-500/20 shadow-[0_0_30px_rgba(234,179,8,0.1)]"
                    >
                        <Trophy className="h-12 w-12 text-yellow-500" />
                    </motion.div>
                    <div className="flex flex-col items-center space-y-2">
                        <p className="text-sm font-black text-gray-400 uppercase tracking-[0.3em] animate-pulse">Extraction du classement</p>
                        <div className="h-1 w-32 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                                animate={{ x: [-128, 128] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                className="h-full w-1/2 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"
                            />
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-[#050505] pb-20">
                <div className="max-w-7xl mx-auto py-12 px-6 lg:px-8 space-y-12">
                    
                    {/* Header Section */}
                    <div className="relative">
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col md:flex-row md:items-end justify-between gap-8"
                        >
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 shadow-sm">
                                    <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse" />
                                    <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest leading-none">Hall of Fame</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                                    Classement <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-200">Élite</span>
                                </h1>
                                <p className="text-gray-500 font-medium max-w-md">
                                    Suivez l'excellence et la progression de vos stagiaires en temps réel à travers vos différentes formations.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 bg-white/[0.03] p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
                                <Tabs value={period} onValueChange={setPeriod} className="w-auto">
                                    <TabsList className="bg-transparent h-10 border-none p-0 gap-1">
                                        {[
                                            { id: 'all', label: 'Global' },
                                            { id: 'month', label: 'Mensuel' },
                                            { id: 'week', label: 'Hebdo' }
                                        ].map(p => (
                                            <TabsTrigger 
                                                key={p.id}
                                                value={p.id} 
                                                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-500 text-[10px] font-black uppercase tracking-widest px-4 h-full rounded-xl transition-all"
                                            >
                                                {p.label}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </Tabs>
                            </div>
                        </motion.div>
                    </div>

                    {/* Stats & Filter Bar */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col lg:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                                    <Filter className="h-5 w-5 text-yellow-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1 leading-none">Perspective</p>
                                    <Select value={selectedFormationId} onValueChange={setSelectedFormationId}>
                                        <SelectTrigger className="w-[260px] h-9 border-none bg-black/40 hover:bg-black/60 text-white font-bold text-sm rounded-xl focus:ring-0 transition-all">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#0a0a0a]/95 backdrop-blur-3xl border-white/10 text-white rounded-2xl shadow-2xl">
                                            <SelectItem value="global" className="hover:bg-white/5 focus:bg-white/5 cursor-pointer font-bold text-sm py-3 transition-colors">
                                                🌍 Tous mes stagiaires
                                            </SelectItem>
                                            {formations.map((f) => (
                                                <SelectItem key={f.id} value={String(f.id)} className="hover:bg-white/5 focus:bg-white/5 cursor-pointer font-bold text-sm py-3 transition-colors">
                                                    🎓 {f.nom}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-8 lg:border-l lg:border-white/5 lg:pl-8">
                            <div className="text-center lg:text-left">
                                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1 leading-none">Compétiteurs</p>
                                <div className="text-2xl font-black text-white">{ranking.length}</div>
                            </div>
                            <div className="text-center lg:text-left">
                                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1 leading-none">Score Max</p>
                                <div className="text-2xl font-black text-yellow-500">{ranking[0]?.total_points || 0}</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Table Section */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/[0.03] backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden"
                    >
                        <div className="relative overflow-x-auto custom-scrollbar">
                            <Table>
                                <TableHeader className="bg-white/[0.01]">
                                    <TableRow className="border-white/5 hover:bg-transparent">
                                        <TableHead className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em] pl-10 h-20">Rang</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em] h-20">Candidat</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em] text-center h-20">Points</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em] text-center h-20">Quiz</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em] text-right pr-10 h-20">Précision</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <AnimatePresence mode="popLayout">
                                        {ranking.map((stagiaire, index) => (
                                            <motion.tr 
                                                key={stagiaire.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.04 }}
                                                className={`border-white/5 hover:bg-white/[0.06] transition-all duration-300 group/row relative ${
                                                    stagiaire.rank <= 3 ? 'bg-yellow-500/[0.02]' : ''
                                                }`}
                                            >
                                                <TableCell className="pl-10 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`h-10 w-10 rounded-2xl flex items-center justify-center relative shadow-lg ${
                                                            stagiaire.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                                                            stagiaire.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                                                            stagiaire.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-700' :
                                                            'bg-white/5 border border-white/10'
                                                        }`}>
                                                            {stagiaire.rank <= 3 && (
                                                                <div className="absolute -top-1 -right-1 h-3 w-3 bg-white rounded-full flex items-center justify-center border-2 border-black">
                                                                    <div className="h-1 w-1 bg-black rounded-full" />
                                                                </div>
                                                            )}
                                                            <span className={`text-sm font-black tracking-tighter ${
                                                                stagiaire.rank <= 3 ? 'text-black' : 'text-gray-500 group-hover/row:text-white transition-colors'
                                                            }`}>
                                                                {stagiaire.rank}
                                                            </span>
                                                        </div>
                                                        {stagiaire.rank <= 3 && (
                                                            <div className="hidden sm:block">
                                                                {stagiaire.rank === 1 && <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">Champion</span>}
                                                                {stagiaire.rank === 2 && <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Élite</span>}
                                                                {stagiaire.rank === 3 && <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Expert</span>}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center group-hover/row:border-yellow-500/30 transition-colors shadow-inner overflow-hidden">
                                                            <span className="text-xs font-black text-gray-500 group-hover/row:text-yellow-500 transition-colors">
                                                                {stagiaire.prenom[0]}{stagiaire.nom[0]}
                                                            </span>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-black text-gray-100 group-hover/row:text-white transition-colors truncate">
                                                                {stagiaire.prenom} {stagiaire.nom}
                                                            </p>
                                                            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter truncate group-hover/row:text-gray-500">{stagiaire.email}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="inline-flex flex-col items-center">
                                                        <span className="text-lg font-black text-yellow-500/90 group-hover/row:scale-110 transition-transform duration-300">{stagiaire.total_points}</span>
                                                        <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">Points</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                                        <Trophy className="h-3 w-3 text-gray-600" />
                                                        <span className="text-[10px] font-black text-gray-400">{stagiaire.total_quiz}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right pr-10">
                                                    <div className="inline-flex items-center gap-3">
                                                        <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden hidden md:block">
                                                            <motion.div 
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${stagiaire.avg_score}%` }}
                                                                className={`h-full ${
                                                                    stagiaire.avg_score >= 80 ? 'bg-green-500' :
                                                                    stagiaire.avg_score >= 50 ? 'bg-yellow-500' :
                                                                    'bg-red-500'
                                                                } opacity-50`}
                                                            />
                                                        </div>
                                                        <Badge className={`text-[10px] font-black rounded-lg border-none px-2 h-7 shadow-none ${
                                                            stagiaire.avg_score >= 70 ? 'bg-green-500/10 text-green-500' :
                                                            stagiaire.avg_score >= 40 ? 'bg-yellow-500/10 text-yellow-500' :
                                                            'bg-red-500/10 text-red-500'
                                                        }`}>
                                                            {stagiaire.avg_score}%
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </TableBody>
                            </Table>
                        </div>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
}
    );
}

export default FormateurClassementPage;
