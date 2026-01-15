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
                return <Medal className="h-5 w-5 text-slate-400" />;
            case 3:
                return <Medal className="h-5 w-5 text-orange-600" />;
            default:
                return <Award className="h-5 w-5 text-slate-300" />;
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center p-4 space-y-6">
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.1, 1],
                            opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="p-6 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50"
                    >
                        <Trophy className="h-12 w-12 text-yellow-500" />
                    </motion.div>
                    <div className="flex flex-col items-center space-y-2">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Extraction du classement...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-[#FDFCFB]">
                {/* Header Background Pattern */}
                <div className="absolute top-0 left-0 w-full h-[500px] bg-white border-b border-slate-100/50 -z-10 overflow-hidden">
                    <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[80%] bg-yellow-500/[0.03] rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 left-[-5%] w-[40%] h-[50%] bg-blue-500/[0.02] rounded-full blur-[100px]" />
                </div>

                <div className="max-w-7xl mx-auto py-12 px-6 lg:px-8 space-y-12">
                    {/* Header Section */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-8"
                    >
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-50 border border-yellow-200 shadow-sm shadow-yellow-500/5">
                                <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse" />
                                <span className="text-[10px] font-black text-yellow-600 uppercase tracking-widest leading-none">Hall of Fame</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
                                Classement <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-200">Élite</span>
                            </h1>
                            <p className="text-slate-500 font-medium max-w-lg text-lg leading-relaxed">
                                Suivez l'excellence et la progression de vos stagiaires en temps réel à travers vos différentes formations.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 bg-white p-2 rounded-[1.5rem] border border-slate-100 shadow-xl shadow-slate-200/30">
                            <Tabs value={period} onValueChange={setPeriod} className="w-auto">
                                <TabsList className="bg-slate-50 h-10 p-1 rounded-xl">
                                    {[
                                        { id: 'all', label: 'Global' },
                                        { id: 'month', label: 'Mensuel' },
                                        { id: 'week', label: 'Hebdo' }
                                    ].map(p => (
                                        <TabsTrigger 
                                            key={p.id}
                                            value={p.id} 
                                            className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-slate-400 text-[10px] font-black uppercase tracking-widest px-6 h-full rounded-lg transition-all"
                                        >
                                            {p.label}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </Tabs>
                        </div>
                    </motion.div>

                    {/* Filter Bar */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col lg:flex-row items-center justify-between gap-8 p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/[0.02] rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-yellow-500/[0.04] transition-colors duration-700" />
                        
                        <div className="flex items-center gap-8 relative z-10 w-full lg:w-auto">
                            <div className="flex items-center gap-4">
                                <div className="p-4 rounded-2xl bg-yellow-50 border border-yellow-200 shadow-sm shadow-yellow-500/5">
                                    <Filter className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Périmètre d'analyse</p>
                                    <Select value={selectedFormationId} onValueChange={setSelectedFormationId}>
                                        <SelectTrigger className="w-full sm:w-[320px] h-11 border-slate-100 bg-slate-50/50 hover:bg-white text-slate-900 font-black text-sm rounded-xl focus:ring-yellow-500/20 transition-all shadow-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-slate-100 text-slate-900 rounded-2xl shadow-2xl p-2">
                                            <SelectItem value="global" className="rounded-xl hover:bg-slate-50 focus:bg-slate-50 cursor-pointer font-black text-xs py-3.5 transition-colors">
                                                🌍 TOUS MES STAGIAIRES
                                            </SelectItem>
                                            <div className="h-px bg-slate-50 my-1" />
                                            {formations.map((f) => (
                                                <SelectItem key={f.id} value={String(f.id)} className="rounded-xl hover:bg-slate-50 focus:bg-slate-50 cursor-pointer font-black text-xs py-3.5 transition-colors">
                                                    🎓 {f.nom.toUpperCase()}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-12 relative z-10 w-full lg:w-auto lg:border-l lg:border-slate-100 lg:pl-12 py-2">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Compétiteurs</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black text-slate-900">{ranking.length}</span>
                                    <Users className="h-4 w-4 text-slate-200" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Leaderbord Peak</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black text-yellow-600">{ranking[0]?.total_points || 0}</span>
                                    <Trophy className="h-4 w-4 text-yellow-300" />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Table Section */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden"
                    >
                        <div className="relative overflow-x-auto custom-scrollbar">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="border-slate-50 hover:bg-transparent">
                                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] pl-12 h-20">Rang Mondiale</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] h-20">Identité Stagiaire</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] text-center h-20">Points Totaux</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] text-center h-20">Engagement Quiz</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] text-right pr-12 h-20">Ratio Précision</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <AnimatePresence mode="popLayout">
                                        {ranking.map((stagiaire, index) => (
                                            <motion.tr 
                                                key={stagiaire.id}
                                                layout
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.04 }}
                                                className="border-slate-50 hover:bg-slate-50/40 transition-all duration-400 group/row"
                                            >
                                                <TableCell className="pl-12 py-8">
                                                    <div className="flex items-center gap-6">
                                                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center relative shadow-lg transition-transform group-hover/row:scale-110 duration-500 ${
                                                            stagiaire.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-yellow-500/20' :
                                                            stagiaire.rank === 2 ? 'bg-gradient-to-br from-slate-200 to-slate-400 shadow-slate-400/20' :
                                                            stagiaire.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-700 shadow-orange-700/20' :
                                                            'bg-white border border-slate-100 shadow-sm'
                                                        }`}>
                                                            {stagiaire.rank <= 3 && (
                                                                <div className="absolute -top-2 -right-2 h-5 w-5 bg-white rounded-full flex items-center justify-center border-2 border-slate-100 shadow-sm">
                                                                    <div className="h-1.5 w-1.5 bg-slate-900 rounded-full" />
                                                                </div>
                                                            )}
                                                            <span className={`text-base font-black tracking-tighter ${
                                                                stagiaire.rank <= 3 ? 'text-white' : 'text-slate-400'
                                                            }`}>
                                                                #{stagiaire.rank}
                                                            </span>
                                                        </div>
                                                        {stagiaire.rank <= 3 && (
                                                            <div className="hidden sm:block">
                                                                <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-widest px-3 h-6 border-none shadow-none ${
                                                                    stagiaire.rank === 1 ? 'bg-yellow-50 text-yellow-700' :
                                                                    stagiaire.rank === 2 ? 'bg-slate-50 text-slate-700' :
                                                                    'bg-orange-50 text-orange-700'
                                                                }`}>
                                                                    {stagiaire.rank === 1 ? 'Champion' : stagiaire.rank === 2 ? 'Argente' : 'Bronze'}
                                                                </Badge>
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-6">
                                                        <div className="h-14 w-14 rounded-3xl bg-white border border-slate-100 flex items-center justify-center shadow-xl shadow-slate-200/50 group-hover/row:border-yellow-200 group-hover/row:shadow-yellow-500/10 transition-all duration-500 relative overflow-hidden">
                                                            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent flex items-center justify-center">
                                                                <span className="text-sm font-black text-slate-400 group-hover/row:text-yellow-600 transition-colors uppercase">
                                                                    {stagiaire.prenom[0]}{stagiaire.nom[0]}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-base font-black text-slate-900 truncate">
                                                                {stagiaire.prenom} {stagiaire.nom}
                                                            </p>
                                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-0.5 truncate group-hover/row:text-slate-400 transition-colors">{stagiaire.email}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="inline-flex flex-col items-center group-hover/row:translate-y-[-2px] transition-transform">
                                                        <span className="text-2xl font-black text-slate-900">{stagiaire.total_points}</span>
                                                        <span className="text-[8px] font-black text-yellow-600 uppercase tracking-[0.2em] mt-1">XP Points</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="inline-flex items-center gap-2.5 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 group-hover/row:bg-white transition-colors">
                                                        <Award className="h-3.5 w-3.5 text-slate-300" />
                                                        <span className="text-xs font-black text-slate-700">{stagiaire.total_quiz} SESSION{stagiaire.total_quiz > 1 ? 'S' : ''}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right pr-12">
                                                    <div className="inline-flex items-center gap-4">
                                                        <div className="h-1.5 w-20 bg-slate-50 rounded-full overflow-hidden hidden md:block border border-slate-100/50">
                                                            <motion.div 
                                                                initial={{ width: 0 }}
                                                                whileInView={{ width: `${stagiaire.avg_score}%` }}
                                                                viewport={{ once: true }}
                                                                transition={{ delay: 0.5, duration: 1.5, type: "spring" }}
                                                                className={`h-full ${
                                                                    stagiaire.avg_score >= 80 ? 'bg-green-400' :
                                                                    stagiaire.avg_score >= 50 ? 'bg-yellow-400' :
                                                                    'bg-red-400'
                                                                }`}
                                                            />
                                                        </div>
                                                        <div className={`text-sm font-black w-14 text-right ${
                                                            stagiaire.avg_score >= 80 ? 'text-green-600' :
                                                            stagiaire.avg_score >= 50 ? 'text-yellow-600' :
                                                            'text-red-600'
                                                        }`}>
                                                            {stagiaire.avg_score}%
                                                        </div>
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

export default FormateurClassementPage;
