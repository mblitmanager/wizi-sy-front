import { useState } from 'react';
import { GraduationCap, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Paginated, useFormateurDashboardStats } from '@/hooks/queries/useFormateurQueries';

interface Formateur {
    id: number;
    prenom: string;
    nom: string;
    total_stagiaires: number;
}

export function FormateurStatsFormateurs() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const { data, isLoading: loading, isPlaceholderData } = useFormateurDashboardStats<{ formateurs?: Paginated<Formateur> }>({
        formateursPage: currentPage,
    });
    const formateurs = data?.formateurs?.data ?? [];
    const lastPage = data?.formateurs?.last_page ?? 1;
    const total = data?.formateurs?.total ?? 0;

    if (loading) {
        return (
            <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/5 p-6 h-[400px] flex flex-col items-center justify-center space-y-4">
                <GraduationCap className="h-8 w-8 text-gray-700 animate-pulse" />
                <p className="text-gray-500 text-sm animate-pulse">Consultation de l'académie...</p>
            </div>
        );
    }

    const noFormateurs = !formateurs || formateurs.length === 0;

    return (
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl flex flex-col h-[600px] overflow-hidden group hover:border-white/20 transition-all duration-500">
            {/* Header */}
            <div className="p-6 border-b border-white/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
                            <GraduationCap className="h-5 w-5 text-orange-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white tracking-tight">Vue par Formateur</h2>
                            <p className="text-xs text-gray-500 font-medium">{total} formateur{total > 1 ? 's' : ''} actif{total > 1 ? 's' : ''}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className={`flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 transition-opacity ${isPlaceholderData ? "opacity-50" : ""}`} aria-busy={isPlaceholderData}>
                {noFormateurs ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-40">
                        <Users className="h-10 w-10 text-gray-600 mb-3" />
                        <p className="text-sm font-medium">Aucun formateur</p>
                    </div>
                ) : (
                    formateurs.map((formateur, index) => (
                        <motion.div
                            key={formateur.id}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => navigate('/formateur/arena')}
                            className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all group/item cursor-pointer"
                        >
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-white/5 to-white/[0.01] border border-white/10 flex items-center justify-center shadow-inner group-hover/item:border-yellow-500/30 transition-colors shrink-0">
                                <span className="text-xs font-black text-gray-400 group-hover/item:text-yellow-500 tracking-tighter transition-colors">
                                    {formateur.prenom.charAt(0)}{formateur.nom.charAt(0)}
                                </span>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm text-gray-200 truncate group-hover/item:text-white transition-colors">
                                    {formateur.prenom} {formateur.nom}
                                </h4>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <Users className="h-3 w-3 text-gray-600" />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                                        {formateur.total_stagiaires} stagiaire{formateur.total_stagiaires > 1 ? 's' : ''} assigné{formateur.total_stagiaires > 1 ? 's' : ''}
                                    </span>
                                </div>
                            </div>

                            <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8 text-gray-600 hover:text-yellow-500 hover:bg-yellow-500/10 rounded-lg opacity-0 group-hover/item:opacity-100 transition-all"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </motion.div>
                    ))
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

export default FormateurStatsFormateurs;
