import { useEffect, useState, useCallback } from 'react';
import { Globe, Smartphone, Monitor, UserX, AlertTriangle, Mail, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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

    const getClientIcon = (client: string | null) => {
        switch (client) {
            case 'web':
                return <Globe className="h-4 w-4" />;
            case 'android':
            case 'ios':
                return <Smartphone className="h-4 w-4" />;
            default:
                return <Monitor className="h-4 w-4" />;
        }
    };

    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    if (loading) {
        return (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-10 h-[400px] flex flex-col items-center justify-center space-y-6">
                <AlertTriangle className="h-10 w-10 text-orange-500/20 animate-pulse" />
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest animate-pulse">Audit d'assiduité...</p>
            </div>
        );
    }

    const start = (page - 1) * pageSize;
    const paginated = inactiveStagiaires.slice(start, start + pageSize);

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden group hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-700">
            {/* Header Section */}
            <div className="p-8 border-b border-slate-50 space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/[0.02] rounded-full -mr-32 -mt-32 blur-3xl" />
                
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/20 shadow-sm shadow-orange-500/5">
                            <UserX className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Stagiaires en Sommeil</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{inactiveStagiaires.length} profils à réengager</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                        <Tabs value={scope} onValueChange={(v) => setScope(v as 'mine' | 'all')} className="w-auto">
                            <TabsList className="bg-white border border-slate-200/50 h-9 p-1 rounded-xl shadow-sm">
                                <TabsTrigger 
                                    value="mine" 
                                    className="data-[state=active]:bg-slate-900 data-[state=active]:text-white text-slate-400 text-[10px] font-black uppercase tracking-wider px-4 rounded-lg h-full transition-all"
                                >
                                    Portefeuille
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="all"
                                    className="data-[state=active]:bg-slate-900 data-[state=active]:text-white text-slate-400 text-[10px] font-black uppercase tracking-wider px-4 rounded-lg h-full transition-all"
                                >
                                    Fglobal
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <div className="h-6 w-[1px] bg-slate-200 mx-1" />
                        <div className="flex gap-1.5">
                            {[7, 14, 30].map((d) => (
                                <Button
                                    key={d}
                                    size="sm"
                                    variant="ghost"
                                    className={`h-9 px-4 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                                        days === d 
                                            ? 'bg-orange-100 text-orange-700 shadow-sm' 
                                            : 'text-slate-400 hover:text-slate-900 hover:bg-white'
                                    }`}
                                    onClick={() => {
                                        setDays(d);
                                        setPage(1);
                                        setLoading(true);
                                    }}
                                >
                                    {d}J+
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="relative overflow-x-auto custom-scrollbar min-h-[450px]">
                {inactiveStagiaires.length === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 scale-90">
                        <div className="p-8 rounded-full bg-green-50 border border-green-100 mb-6">
                            <AlertTriangle className="h-12 w-12 text-green-500" />
                        </div>
                        <p className="text-sm font-black uppercase tracking-widest text-slate-400">Assiduité totale détectée 🎉</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="border-slate-100 hover:bg-transparent">
                                <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-10 h-14">Profil Stagiaire</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest h-14">Dernier Contact</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-center h-14">Terminal</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-right pr-10 h-14">Sévérité</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <AnimatePresence mode="popLayout">
                                {paginated.map((stagiaire, index) => (
                                    <motion.tr 
                                        key={stagiaire.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        transition={{ delay: index * 0.05, duration: 0.3 }}
                                        className="border-slate-50 hover:bg-slate-50/40 transition-colors group/row"
                                    >
                                        <TableCell className="pl-10 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-11 w-11 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover/row:border-orange-200 transition-colors">
                                                    <span className="text-xs font-black text-slate-400 group-hover/row:text-orange-600 uppercase">
                                                        {stagiaire.prenom.charAt(0)}{stagiaire.nom.charAt(0)}
                                                    </span>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-slate-900 truncate group-hover/row:text-orange-950">
                                                        {stagiaire.prenom} {stagiaire.nom}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-slate-400 truncate uppercase mt-0.5 tracking-tight">{stagiaire.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2.5">
                                                <div className="h-2 w-2 rounded-full bg-red-400 shadow-sm animate-pulse" />
                                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                                                    {stagiaire.never_connected ? 'Sync. en attente' : stagiaire.last_activity_at ? new Date(stagiaire.last_activity_at).toLocaleDateString('fr-FR') : '---'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="inline-flex p-2.5 rounded-xl bg-slate-50 text-slate-400 group-hover/row:bg-white group-hover/row:text-slate-600 group-hover/row:shadow-sm border border-transparent group-hover/row:border-slate-100 transition-all">
                                                {getClientIcon(stagiaire.last_client)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-10">
                                            <div className="flex justify-end gap-3 items-center">
                                                {stagiaire.days_since_activity ? (
                                                    <Badge className="bg-red-50 text-red-600 border border-red-100 text-[9px] font-black shadow-none px-3 h-6 rounded-lg uppercase tracking-wider">
                                                        +{stagiaire.days_since_activity} jours
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-slate-50 text-slate-400 border border-slate-100 text-[9px] font-black shadow-none px-3 h-6 rounded-lg uppercase tracking-wider">
                                                        vierge
                                                    </Badge>
                                                )}
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-10 w-10 text-slate-200 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
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
            <div className="p-6 bg-slate-50/50 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setPage(1);
                            }}
                            className="appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 h-10 text-[10px] font-black text-slate-900 uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-slate-200 shadow-sm transition-all"
                        >
                            {[10, 25, 50].map(v => <option key={v} value={v}>{v} LIGNES</option>)}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <ChevronRight className="h-3 w-3 rotate-90" />
                        </div>
                    </div>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                        {totalCount} RÉSULTATS
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-10 w-10 text-slate-400 hover:text-slate-900 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 disabled:opacity-20 rounded-2xl transition-all"
                        onClick={() => setPage(p => p - 1)}
                        disabled={page <= 1}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    
                    <div className="flex gap-2">
                        {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                            const pNum = i + 1;
                            return (
                                <Button
                                    key={pNum}
                                    size="sm"
                                    variant="ghost"
                                    className={`h-10 w-10 text-[11px] font-black rounded-2xl transition-all shadow-sm ${
                                        page === pNum 
                                            ? 'bg-slate-900 text-white shadow-slate-900/20' 
                                            : 'bg-white border border-slate-100 text-slate-400 hover:text-slate-900'
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
                        className="h-10 w-10 text-slate-400 hover:text-slate-900 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 disabled:opacity-20 rounded-2xl transition-all"
                        onClick={() => setPage(p => p + 1)}
                        disabled={page >= totalPages}
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default InactiveStagiairesTable;
