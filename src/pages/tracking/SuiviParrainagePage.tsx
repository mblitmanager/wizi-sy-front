import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import { 
    Users, 
    Search, 
    Gift, 
    UserPlus, 
    TrendingUp, 
    CircleDollarSign,
    ShieldCheck,
    ChevronRight,
    ArrowUpRight,
    Filter
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/UserContext';
import axios from 'axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const API_URL = import.meta.env.VITE_API_URL;

interface Parrainage {
    id: number;
    date: string;
    points: number;
    gains: string | number;
    parrain: {
        name: string;
    } | null;
    filleul: {
        name: string;
        prenom: string;
        statut: string;
    } | null;
}

const SuiviParrainagePage = () => {
    const { user } = useUser();
    const [parrainages, setParrainages] = useState<Parrainage[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchParrainages = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/formateur/suivi/parrainage`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setParrainages(response.data.data || response.data);
            } catch (error) {
                console.error('Erreur lors du chargement des parrainages:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchParrainages();
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'en_attente':
                return <Badge className="bg-amber-100 text-amber-700 border-amber-200 uppercase font-black text-[10px]">En attente</Badge>;
            case 'validé':
            case 'complete':
            case 'actif':
                return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 uppercase font-black text-[10px]">Actif</Badge>;
            default:
                return <Badge className="bg-slate-100 text-slate-700 border-slate-200 uppercase font-black text-[10px]">{status}</Badge>;
        }
    };

    const totalPoints = parrainages.reduce((acc, p) => acc + (p.points || 0), 0);
    const totalGains = parrainages.reduce((acc, p) => acc + (Number(p.gains) || 0), 0);

    const filteredParrainages = parrainages.filter(p => 
        (p.filleul?.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.filleul?.prenom?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.parrain?.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                    <div className="w-12 h-12 border-4 border-[#3B82F6]/20 border-t-[#3B82F6] rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Analyse du réseau...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-[#F8FAFC] pb-20">
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-white border-b border-gray-100 px-8 py-12 md:px-12 md:py-16 shadow-sm mb-10">
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full -ml-20 -mb-20 blur-3xl"></div>
                    <div className="relative z-10 max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                            <div className="space-y-4">
                                <Badge className="bg-blue-50 text-blue-600 border-blue-100 py-1.5 px-3 rounded-full font-black text-[10px] uppercase tracking-wider">
                                    <TrendingUp className="w-3 h-3 mr-2" /> Croissance du Réseau
                                </Badge>
                                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                                    Suivi <span className="text-blue-600">Parrainage</span>
                                </h1>
                                <p className="text-gray-500 font-medium max-w-2xl text-lg leading-relaxed">
                                    Suivez l'activité de vos filleuls et visualisez vos récompenses accumulées.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <div className="bg-white shadow-xl shadow-blue-500/5 border border-blue-50 p-6 rounded-[2rem] min-w-[160px]">
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Points</p>
                                    <p className="text-3xl font-black text-gray-900 leading-none">{totalPoints}</p>
                                </div>
                                <div className="bg-white shadow-xl shadow-emerald-500/5 border border-emerald-50 p-6 rounded-[2rem] min-w-[160px]">
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Gains Estimés</p>
                                    <p className="text-3xl font-black text-emerald-600 leading-none">{totalGains}€</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6">
                    {/* Filter & Search */}
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <Input 
                                placeholder="Rechercher par nom d'élève ou parrain..." 
                                className="pl-14 py-8 bg-white border-gray-100 rounded-[2rem] focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all text-sm font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button className="rounded-[2rem] px-8 h-[64px] bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20 font-black uppercase tracking-widest text-[10px] border-4 border-white transition-all">
                            <Filter className="w-4 h-4 mr-2" /> Filtrer
                        </Button>
                    </div>

                    {/* Table */}
                    <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[3rem] overflow-hidden bg-white">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="border-slate-50">
                                        <TableHead className="py-8 pl-10 font-black text-[10px] uppercase tracking-widest text-slate-400">Date</TableHead>
                                        <TableHead className="py-8 font-black text-[10px] uppercase tracking-widest text-slate-400">Filleul</TableHead>
                                        <TableHead className="py-8 font-black text-[10px] uppercase tracking-widest text-slate-400">Parrain</TableHead>
                                        <TableHead className="py-8 font-black text-[10px] uppercase tracking-widest text-slate-400 text-center">Récompense</TableHead>
                                        <TableHead className="py-8 font-black text-[10px] uppercase tracking-widest text-slate-400">Statut</TableHead>
                                        <TableHead className="py-8 pr-10 text-right font-black text-[10px] uppercase tracking-widest text-slate-400">Fiche</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredParrainages.length > 0 ? (
                                        filteredParrainages.map((p) => (
                                            <TableRow key={p.id} className="border-slate-50 hover:bg-slate-50/30 transition-all group">
                                                <TableCell className="py-8 pl-10">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black text-slate-900">{format(new Date(p.date), 'dd/MM/yyyy')}</span>
                                                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">{format(new Date(p.date), 'HH:mm')}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-[1.25rem] bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 shadow-sm relative overflow-hidden group-hover:scale-105 transition-transform">
                                                            <UserPlus className="w-5 h-5" />
                                                            <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-slate-900 text-sm leading-tight">{p.filleul?.prenom} {p.filleul?.name}</p>
                                                            <div className="flex items-center gap-1.5 mt-1">
                                                                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Vérifié</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-8">
                                                    <Badge variant="outline" className="border-slate-200 text-slate-500 rounded-lg py-1 px-3 bg-white font-bold text-[10px]">
                                                        {p.parrain?.name || 'Inconnu'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-8">
                                                    <div className="flex flex-col items-center">
                                                        <div className="flex items-center gap-1.5 text-blue-600 mb-1">
                                                            <Gift className="w-3.5 h-3.5" />
                                                            <span className="font-black text-sm">{p.points}pts</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-emerald-500">
                                                            <CircleDollarSign className="w-3 h-3" />
                                                            <span className="text-[10px] font-black">{p.gains}€</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-8">
                                                    {getStatusBadge(p.filleul?.statut || 'en_attente')}
                                                </TableCell>
                                                <TableCell className="py-8 pr-10 text-right">
                                                    <Button size="icon" variant="ghost" className="h-10 w-10 rounded-2xl bg-slate-50 hover:bg-blue-600 hover:text-white transition-all border border-slate-100 group/btn shadow-sm">
                                                        <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-0.5 transition-transform" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="py-32 text-center">
                                                <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-slate-50 mb-6 border border-slate-100">
                                                    <Users className="w-10 h-10 text-slate-200" />
                                                </div>
                                                <h3 className="text-xl font-black text-slate-900 mb-2">Aucun filleul trouvé</h3>
                                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Élargissez votre réseau pour voir des données ici.</p>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default SuiviParrainagePage;
