import { useState, useEffect } from 'react';
import { BookOpen, Users, TrendingUp, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL;

interface Formation {
    id: number;
    nom: string;
    total_stagiaires: number;
    stagiaires_actifs: number;
    score_moyen: number;
}

interface PaginationData {
    data: Formation[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export function FormateurStatsFormations() {
    const navigate = useNavigate();
    const [formations, setFormations] = useState<Formation[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFormations = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/formateur/dashboard/stats`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0',
                    },
                    params: {
                        formations_page: currentPage,
                        formations_per_page: 5
                    }
                });
                const data = response.data.formations as PaginationData;
                setFormations(data.data || []);
                setCurrentPage(data.current_page);
                setLastPage(data.last_page);
                setTotal(data.total);
            } catch (err) {
                console.error('Erreur chargement formations:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchFormations();
    }, [currentPage]);

    if (loading) {
        return (
            <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/5 p-6 h-[400px] flex flex-col items-center justify-center space-y-4">
                <BookOpen className="h-8 w-8 text-gray-700 animate-pulse" />
                <p className="text-gray-500 text-sm animate-pulse">Analyse des formations...</p>
            </div>
        );
    }

    const noFormations = !formations || formations.length === 0;

    return (
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl flex flex-col h-[600px] overflow-hidden group hover:border-white/20 transition-all duration-500">
            {/* Header */}
            <div className="p-6 border-b border-white/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
                            <BookOpen className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white tracking-tight">Vue par Formation</h2>
                            <p className="text-xs text-gray-500 font-medium">{total} catalogue{total > 1 ? 's' : ''} actif{total > 1 ? 's' : ''}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                {noFormations ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-40 py-10">
                        <BookOpen className="h-12 w-12 text-gray-600 mb-4" />
                        <p className="text-sm font-medium">Aucune formation</p>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {formations.map((formation, index) => (
                            <motion.div
                                key={formation.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                onClick={() => navigate('/formateur/formations')}
                                className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all group/item shadow-sm cursor-pointer"
                            >
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-sm text-gray-200 group-hover/item:text-yellow-500 transition-colors truncate mb-1">
                                        {formation.nom}
                                    </h4>
                                    <div className="flex gap-4 text-[10px] font-medium text-gray-500 uppercase tracking-tighter">
                                        <div className="flex items-center gap-1.5">
                                            <Users className="h-3 w-3" />
                                            <span>{formation.total_stagiaires} inscrits</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="h-1.5 w-1.5 rounded-full bg-green-500/80" />
                                            <span>{formation.stagiaires_actifs} actifs</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <div className="text-right flex flex-col items-end mr-2">
                                        <span className="text-[10px] text-gray-600 font-bold uppercase mb-1">Moyenne</span>
                                        <Badge
                                            variant="outline"
                                            className={`bg-transparent border-white/10 text-xs py-0.5 px-2 font-black shadow-none ${
                                                formation.score_moyen >= 70 ? "text-yellow-500 border-yellow-500/30" : "text-gray-400"
                                            }`}
                                        >
                                            {Number(formation.score_moyen).toFixed(2)}%
                                        </Badge>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-gray-600 group-hover/item:text-yellow-500 transition-colors" />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Pagination */}
            {lastPage > 1 && (
                <div className="p-4 bg-black/20 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                        Page {currentPage} / {lastPage}
                    </span>
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === lastPage}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FormateurStatsFormations;
