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
    ClipboardList, 
    Search, 
    Calendar, 
    User, 
    BookOpen, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    Filter,
    ArrowUpDown
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/UserContext';
import axios from 'axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const API_URL = import.meta.env.VITE_API_URL;

interface Demande {
    id: number;
    date: string;
    statut: string;
    formation: string;
    stagiaire: {
        name: string;
        prenom: string;
    } | null;
    motif: string;
}

const SuiviDemandesPage = () => {
    const { user } = useUser();
    const [demandes, setDemandes] = useState<Demande[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchDemandes = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/formateur/suivi/demandes`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDemandes(response.data.data || response.data);
            } catch (error) {
                console.error('Erreur lors du chargement des demandes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDemandes();
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'en_attente':
                return <Badge className="bg-amber-100 text-amber-700 border-amber-200 uppercase font-black text-[10px]">En attente</Badge>;
            case 'valide':
            case 'complete':
                return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 uppercase font-black text-[10px]">Validé</Badge>;
            case 'rejete':
            case 'refuse':
                return <Badge className="bg-rose-100 text-rose-700 border-rose-200 uppercase font-black text-[10px]">Rejeté</Badge>;
            default:
                return <Badge className="bg-slate-100 text-slate-700 border-slate-200 uppercase font-black text-[10px]">{status}</Badge>;
        }
    };

    const filteredDemandes = demandes.filter(d => 
        (d.stagiaire?.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (d.stagiaire?.prenom?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (d.formation.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (d.motif?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                    <div className="w-12 h-12 border-4 border-[#FEB823]/20 border-t-[#FEB823] rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Chargement du suivi...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-[#F8FAFC] pb-20">
                {/* Header Section */}
                <div className="relative overflow-hidden bg-white border-b border-gray-100 px-8 py-12 md:px-12 md:py-16 shadow-sm mb-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#FEB823]/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                    <div className="relative z-10 max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                            <div className="space-y-4">
                                <Badge className="bg-[#FEB823]/10 text-[#FEB823] border-[#FEB823]/20 py-1 px-3">
                                    <Clock className="w-3 h-3 mr-2" /> Suivi Administratif
                                </Badge>
                                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                                    Demandes de <span className="text-[#FEB823]">Formation</span>
                                </h1>
                                <p className="text-gray-500 font-medium max-w-2xl text-lg leading-relaxed">
                                    Consultez l'état d'avancement des inscriptions de vos stagiaires en temps réel.
                                </p>
                            </div>

                            <div className="w-full md:w-96">
                                <div className="relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#FEB823] transition-colors" />
                                    <Input 
                                        placeholder="Rechercher un stagiaire ou une formation..." 
                                        className="pl-12 py-6 bg-gray-50/50 border-gray-100 rounded-2xl focus:ring-[#FEB823]/20 focus:border-[#FEB823] transition-all"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="max-w-7xl mx-auto px-6">
                    <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-slate-50/80">
                                        <TableRow className="border-slate-100">
                                            <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 py-6 pl-10">Date Demande</TableHead>
                                            <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 py-6 whitespace-nowrap">Stagiaire</TableHead>
                                            <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 py-6">Formation</TableHead>
                                            <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 py-6">Statut</TableHead>
                                            <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 py-6 pr-10 text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredDemandes.length > 0 ? (
                                            filteredDemandes.map((demande) => (
                                                <TableRow key={demande.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                                    <TableCell className="py-6 pl-10 text-sm font-bold text-slate-500">
                                                        {format(new Date(demande.date), 'dd MMMM yyyy', { locale: fr })}
                                                    </TableCell>
                                                    <TableCell className="py-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center font-black text-[#FEB823] text-sm group-hover:bg-[#FEB823] group-hover:text-white transition-all duration-300">
                                                                {demande.stagiaire?.prenom?.[0] || 'S'}
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-slate-900 text-sm">{demande.stagiaire?.prenom} {demande.stagiaire?.name}</p>
                                                                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Inscrit via plateforme</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-6">
                                                        <div className="flex items-center gap-2">
                                                            <BookOpen className="w-4 h-4 text-[#FEB823]/50" />
                                                            <span className="font-bold text-sm text-slate-900">{demande.formation}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-6">
                                                        {getStatusBadge(demande.statut)}
                                                    </TableCell>
                                                    <TableCell className="py-6 pr-10 text-right">
                                                        <Button variant="ghost" size="sm" className="rounded-xl px-4 py-2 text-[10px] font-black uppercase text-slate-400 hover:bg-[#FEB823]/10 hover:text-[#FEB823] transition-all">
                                                            Détails
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className="py-20 text-center">
                                                    <ClipboardList className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                                                    <p className="text-slate-300 font-bold uppercase tracking-widest text-xs">Aucune demande trouvée</p>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default SuiviDemandesPage;
