import { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Trophy, MousePointerClick, Calendar, User, CheckCircle2, XCircle, Clock, Smartphone, Globe, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import FormateurService, { TrainerPerformanceResponse, StudentDetails } from '@/services/FormateurService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

const TrainerPerformanceStats = () => {
    const [data, setData] = useState<TrainerPerformanceResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
    const [details, setDetails] = useState<StudentDetails | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await FormateurService.getStudentsPerformance();
                setData(res);
            } catch (err) {
                console.error('Error fetching trainer performance:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleViewDetails = async (id: number) => {
        setSelectedStudentId(id);
        setLoadingDetails(true);
        try {
            const res = await FormateurService.getStagiaireStats(id);
            setDetails(res);
        } catch (err) {
            console.error('Error fetching student details:', err);
        } finally {
            setLoadingDetails(false);
        }
    };

    const closeDetails = () => {
        setSelectedStudentId(null);
        setDetails(null);
    };

    if (loading || !data) {
        return (
            <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/5 p-12 flex flex-col items-center justify-center space-y-4">
                <Trophy className="h-10 w-10 text-yellow-500/50 animate-bounce" />
                <p className="text-gray-500 text-sm font-medium animate-pulse uppercase tracking-widest">Calcul des performances...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Ranking: Most Quizzes */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/5 p-6 shadow-2xl relative overflow-hidden group hover:border-yellow-500/20 transition-all duration-500"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Trophy className="h-24 w-24 text-yellow-500" />
                    </div>
                    
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                            <Trophy className="h-5 w-5 text-yellow-500" />
                        </div>
                        <h2 className="text-lg font-bold text-white tracking-tight">Top Quizzers</h2>
                    </div>

                    <div className="space-y-3 relative z-10">
                        {data.rankings.most_quizzes.map((student, idx) => (
                            <motion.div 
                                key={student.id} 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group/item shadow-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-black text-sm tracking-tighter ${
                                        idx === 0 ? 'bg-yellow-500 text-black' : 'bg-white/5 text-gray-500'
                                    }`}>
                                        {idx + 1}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="font-bold text-sm text-gray-200 truncate group-hover/item:text-white">{student.name}</div>
                                        <div className="text-[10px] font-medium text-gray-600 truncate uppercase tracking-tighter">{student.email}</div>
                                    </div>
                                </div>
                                <Badge variant="outline" className="bg-transparent border-white/10 text-[10px] font-black shadow-none text-yellow-500/80">
                                    {student.total_quizzes} QZ
                                </Badge>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Ranking: Most Active */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/5 p-6 shadow-2xl relative overflow-hidden group hover:border-blue-500/20 transition-all duration-500"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <MousePointerClick className="h-24 w-24 text-blue-500" />
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                            <MousePointerClick className="h-5 w-5 text-blue-400" />
                        </div>
                        <h2 className="text-lg font-bold text-white tracking-tight">Top Actifs</h2>
                    </div>

                    <div className="space-y-3 relative z-10">
                        {data.rankings.most_active.map((student, idx) => (
                            <motion.div 
                                key={student.id} 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group/item shadow-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-black text-sm tracking-tighter ${
                                        idx === 0 ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-500'
                                    }`}>
                                        {idx + 1}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="font-bold text-sm text-gray-200 truncate group-hover/item:text-white">{student.name}</div>
                                        <div className="text-[10px] font-medium text-gray-600 truncate uppercase tracking-tighter">{student.email}</div>
                                    </div>
                                </div>
                                <Badge variant="outline" className="bg-transparent border-white/10 text-[10px] font-black shadow-none text-blue-400/80">
                                    {student.total_logins} LOG
                                </Badge>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Performance Table */}
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden group hover:border-white/20 transition-all duration-500">
                <div className="p-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                            <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 uppercase tracking-widest text-xs">Performance Détaillée</h2>
                            <p className="text-xs text-gray-600 font-bold uppercase tracking-tighter mt-1 italic">Mise à jour en temps réel</p>
                        </div>
                    </div>
                </div>

                <div className="relative overflow-x-auto custom-scrollbar">
                    <Table>
                        <TableHeader className="bg-white/[0.01]">
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableHead className="text-[10px] font-black uppercase text-gray-600 tracking-widest pl-8">Stagiaire</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-gray-600 tracking-widest text-center">Dernier Quiz</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-gray-600 tracking-widest text-center">Engagment</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-gray-600 tracking-widest text-right pr-8">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.performance.map((student, index) => (
                                <motion.tr 
                                    key={student.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="border-white/5 hover:bg-white/[0.04] transition-colors group/row"
                                >
                                    <TableCell className="pl-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/5 flex items-center justify-center group-hover/row:border-yellow-500/30 transition-colors shadow-inner">
                                                <span className="text-xs font-black text-gray-500 group-hover/row:text-yellow-500 uppercase">
                                                    {student.name.charAt(0)}
                                                </span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-gray-200 truncate group-hover/row:text-white">
                                                    {student.name}
                                                </p>
                                                <p className="text-[10px] font-medium text-gray-600 truncate uppercase tracking-tighter">{student.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {student.last_quiz_at ? (
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/5 shadow-sm">
                                                    <Calendar className="h-3 w-3" />
                                                    {format(new Date(student.last_quiz_at), 'dd MMM yyyy', { locale: fr })}
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-600 uppercase">
                                                    {format(new Date(student.last_quiz_at), 'HH:mm')}
                                                </span>
                                            </div>
                                        ) : (
                                            <Badge variant="ghost" className="text-[10px] font-bold text-gray-700 uppercase italic opacity-50">Aucun quiz</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="flex flex-col items-center">
                                                <span className="text-[10px] font-black text-yellow-500/80 mb-0.5">{student.total_quizzes}</span>
                                                <span className="text-[8px] font-bold text-gray-700 uppercase">QUIZ</span>
                                            </div>
                                            <div className="w-[1px] h-4 bg-white/5" />
                                            <div className="flex flex-col items-center">
                                                <span className="text-[10px] font-black text-blue-400/80 mb-0.5">{student.total_logins}</span>
                                                <span className="text-[8px] font-bold text-gray-700 uppercase">LOGINS</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 pl-3 pr-2 text-[10px] font-black uppercase text-gray-500 hover:text-yellow-500 hover:bg-yellow-500/10 rounded-lg group/btn transition-all"
                                            onClick={() => handleViewDetails(student.id)}
                                        >
                                            Exploration
                                            <ChevronRight className="h-3.5 w-3.5 ml-1.5 group-hover/btn:translate-x-0.5 transition-transform" />
                                        </Button>
                                    </TableCell>
                                </motion.tr>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Details Modal */}
            <Dialog open={selectedStudentId !== null} onOpenChange={(open) => !open && closeDetails()}>
                <DialogContent className="max-w-md bg-black/90 backdrop-blur-3xl border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] p-0 overflow-hidden">
                    <DialogHeader className="p-8 pb-4 border-b border-white/5 relative bg-white/[0.01]">
                        <DialogTitle className="text-lg font-black uppercase text-gray-200 tracking-widest text-center">Profil Performance</DialogTitle>
                    </DialogHeader>
                    {loadingDetails ? (
                        <div className="py-24 flex flex-col items-center justify-center space-y-4">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="h-8 w-8 border-2 border-yellow-500/20 border-t-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                            />
                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest animate-pulse">Extraction des données...</p>
                        </div>
                    ) : details ? (
                        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            {/* Student Info */}
                            <div className="flex items-center gap-5 p-5 rounded-2xl bg-white/[0.03] border border-white/5 shadow-inner">
                                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-transparent border border-yellow-500/10 flex items-center justify-center text-yellow-500 font-black text-2xl shadow-[0_8px_16px_rgba(0,0,0,0.2)]">
                                    {details.stagiaire.prenom[0]}{details.stagiaire.nom[0]}
                                </div>
                                <div className="min-w-0">
                                    <div className="text-lg font-black text-white leading-tight truncate">{details.stagiaire.prenom} {details.stagiaire.nom}</div>
                                    <div className="text-xs font-medium text-gray-500 truncate uppercase mt-1 tracking-tighter">{details.stagiaire.email}</div>
                                </div>
                            </div>

                            {/* Quiz Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: 'Quiz Totaux', value: details.quiz_stats.total_quiz, icon: <Trophy className="h-3 w-3" />, color: 'yellow' },
                                    { label: 'Score Moyen', value: `${details.quiz_stats.avg_score}%`, icon: <CheckCircle2 className="h-3 w-3" />, color: 'green' },
                                    { label: 'Réponses', value: `${details.quiz_stats.total_correct}/${details.quiz_stats.total_questions}`, icon: <CheckCircle2 className="h-3 w-3" />, color: 'blue' },
                                    { label: 'Record', value: `${details.quiz_stats.best_score}%`, icon: <Trophy className="h-3 w-3" />, color: 'purple' }
                                ].map((stat, i) => (
                                    <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 relative overflow-hidden group/stat hover:bg-white/[0.04] transition-all">
                                        <div className={`text-[8px] font-black uppercase text-gray-600 mb-1 flex items-center gap-1.5`}>
                                            <span className={`text-${stat.color}-500/50`}>{stat.icon}</span>
                                            {stat.label}
                                        </div>
                                        <div className="text-xl font-black text-gray-100">{stat.value}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Activity Info */}
                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Journal d'activité</h4>
                                <div className="space-y-1">
                                    {[
                                        { label: 'Dernier signal', value: details.activity.last_activity, icon: <Clock className="h-3.5 w-3.5" /> },
                                        { label: 'Statut global', value: details.activity.is_online ? "ACTIF MAINTENANT" : "HORS LIGNE", icon: <Globe className="h-3.5 w-3.5" />, badge: true, online: details.activity.is_online },
                                        { label: 'Canal utilisé', value: details.activity.last_client || 'Inconnu', icon: <Smartphone className="h-3.5 w-3.5" />, capitalize: true }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between text-[11px] py-3 border-b border-white/[0.03]">
                                            <span className="text-gray-500 font-bold uppercase flex items-center gap-2">
                                                <span className="text-gray-700">{item.icon}</span>
                                                {item.label}
                                            </span>
                                            {item.badge ? (
                                                <Badge className={`text-[8px] font-black rounded-full border-none px-2 h-5 shadow-none ${item.online ? 'bg-green-500/10 text-green-500' : 'bg-gray-800 text-gray-500'}`}>
                                                    {item.value}
                                                </Badge>
                                            ) : (
                                                <span className={`font-black text-gray-200 ${item.capitalize ? 'capitalize' : ''}`}>{item.value}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-24 text-center">
                            <XCircle className="h-10 w-10 text-red-500/20 mx-auto mb-4" />
                            <p className="text-xs font-bold text-gray-600 uppercase">Échec de la synchronisation</p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TrainerPerformanceStats;
