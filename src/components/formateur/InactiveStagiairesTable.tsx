import { useEffect, useState, useCallback } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Mail, ChevronLeft, ChevronRight, UserX, Clock, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

interface InactiveStagiaire {
    id: number;
    prenom: string;
    nom: string;
    email: string;
    last_activity_at: string | null;
    days_since_activity: number | null;
    never_connected: boolean;
    last_client: string | null;
}

export function InactiveStagiairesTable() {
    const [inactiveStagiaires, setInactiveStagiaires] = useState<InactiveStagiaire[]>([]);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(7);
    const [scope, setScope] = useState<'mine' | 'all'>('mine');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    const fetchInactiveStagiaires = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get(`/formateur/stagiaires/inactive`, {
                params: { days, scope },
            });

            // API responses vary; try common fields for items
            const items = response.data?.inactive_stagiaires || response.data?.items || response.data?.data || [];

            // client-side pagination: derive total from the fetched items
            setInactiveStagiaires(items);
            setTotalCount(items.length);
        } catch (err) {
            console.error('Erreur chargement stagiaires inactifs:', err);
        } finally {
            setLoading(false);
        }
    }, [days, scope]);

    useEffect(() => {
        fetchInactiveStagiaires();
    }, [fetchInactiveStagiaires]);

    // page is reset to 1 where appropriate (days buttons and pageSize selector)

    const getClientIcon = (client: string | null) => {
        switch (client) {
            case 'web':
                return '🌐';
            case 'android':
                return '📱';
            case 'ios':
                return '🍎';
            default:
                return '❓';
        }
    };

    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    if (loading) {
        return (
            <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/5 p-6 h-[400px] flex flex-col items-center justify-center space-y-4">
                <AlertTriangle className="h-8 w-8 text-orange-500/50 animate-pulse" />
                <p className="text-gray-500 text-sm animate-pulse">Détection des inactivités...</p>
            </div>
        );
    }

    const start = (page - 1) * pageSize;
    const paginated = inactiveStagiaires.slice(start, start + pageSize);

    return (
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden group hover:border-white/20 transition-all duration-500">
            {/* Header Section */}
            <div className="p-6 border-b border-white/5 space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
                            <UserX className="h-5 w-5 text-orange-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white tracking-tight">Stagiaires en Sommeil</h2>
                            <p className="text-xs text-gray-500 font-medium">{inactiveStagiaires.length} utilisateurs sans activité récente</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 bg-black/40 p-1.5 rounded-xl border border-white/5">
                        <Tabs value={scope} onValueChange={(v) => setScope(v as 'mine' | 'all')} className="w-auto">
                            <TabsList className="bg-transparent h-8 border-none p-0 gap-1">
                                <TabsTrigger 
                                    value="mine" 
                                    className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-500 text-[10px] font-bold uppercase tracking-wider px-3"
                                >
                                    Mes stagiaires
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="all"
                                    className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-gray-500 text-[10px] font-bold uppercase tracking-wider px-3"
                                >
                                    Tous
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <div className="h-4 w-[1px] bg-white/5 mx-1" />
                        <div className="flex gap-1">
                            {[7, 14, 30].map((d) => (
                                <Button
                                    key={d}
                                    size="sm"
                                    variant="ghost"
                                    className={`h-8 px-3 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                                        days === d ? 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20' : 'text-gray-500 hover:text-white'
                                    }`}
                                    onClick={() => {
                                        setDays(d);
                                        setPage(1);
                                        setLoading(true);
                                    }}
                                >
                                    {d}J
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="relative overflow-x-auto custom-scrollbar min-h-[400px]">
                {inactiveStagiaires.length === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40">
                        <div className="p-4 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
                            <AlertTriangle className="h-8 w-8 text-green-500" />
                        </div>
                        <p className="text-sm font-medium">Tout le monde est actif ! 🎉</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader className="bg-white/[0.01]">
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableHead className="text-[10px] font-black uppercase text-gray-600 tracking-widest pl-6">Stagiaire</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-gray-600 tracking-widest">Dernière Connexion</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-gray-600 tracking-widest text-center">Appareil</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-gray-600 tracking-widest text-right pr-6">Engagement</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <AnimatePresence mode="popLayout">
                                {paginated.map((stagiaire, index) => (
                                    <motion.tr 
                                        key={stagiaire.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-white/5 hover:bg-white/[0.04] transition-colors group/row"
                                    >
                                        <TableCell className="pl-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/5 flex items-center justify-center group-hover/row:border-yellow-500/30 transition-colors">
                                                    <span className="text-xs font-black text-gray-500 group-hover/row:text-yellow-500 uppercase">
                                                        {stagiaire.prenom.charAt(0)}{stagiaire.nom.charAt(0)}
                                                    </span>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-gray-200 truncate group-hover/row:text-white">
                                                        {stagiaire.prenom} {stagiaire.nom}
                                                    </p>
                                                    <p className="text-[10px] font-medium text-gray-600 truncate">{stagiaire.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                                <span className="text-xs font-medium text-gray-400">
                                                    {stagiaire.never_connected ? 'Jamais connecté' : stagiaire.last_activity_at ? new Date(stagiaire.last_activity_at).toLocaleDateString('fr-FR') : 'Inconnu'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className="text-xl" title={stagiaire.last_client || 'Inconnu'}>
                                                {getClientIcon(stagiaire.last_client)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="flex justify-end gap-2">
                                                {stagiaire.days_since_activity ? (
                                                    <Badge className="bg-red-500/10 text-red-400 border-none text-[10px] font-black shadow-none lowercase">
                                                        +{stagiaire.days_since_activity} jours
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-gray-800 text-gray-500 border-none text-[10px] font-black shadow-none lowercase">
                                                        jamais
                                                    </Badge>
                                                )}
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 text-gray-500 hover:text-yellow-500 hover:bg-yellow-500/10 rounded-lg"
                                                    onClick={() => window.open(`mailto:${stagiaire.email}`)}
                                                >
                                                    <Mail className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </TableBody>
                    </Table>
                )}
            </div>

            {/* Pagination Section */}
            <div className="p-4 bg-black/20 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setPage(1);
                        }}
                        className="bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] font-bold text-gray-500 uppercase focus:outline-none focus:border-yellow-500/50"
                    >
                        {[10, 25, 50].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                        sur {totalCount} resultats
                    </span>
                </div>

                <div className="flex items-center gap-1.5">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-gray-500 hover:text-white hover:bg-white/5 disabled:opacity-30 rounded-lg"
                        onClick={() => setPage(p => p - 1)}
                        disabled={page <= 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                            const pNum = i + 1;
                            return (
                                <Button
                                    key={pNum}
                                    size="sm"
                                    variant="ghost"
                                    className={`h-8 w-8 text-[10px] font-bold rounded-lg transition-all ${
                                        page === pNum ? 'bg-yellow-500/10 text-yellow-500' : 'text-gray-500 hover:text-white'
                                    }`}
                                    onClick={() => setPage(pNum)}
                                >
                                    {pNum}
                                </Button>
                            );
                        })}
                    </div>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-gray-500 hover:text-white hover:bg-white/5 disabled:opacity-30 rounded-lg"
                        onClick={() => setPage(p => p + 1)}
                        disabled={page >= totalPages}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default InactiveStagiairesTable;
