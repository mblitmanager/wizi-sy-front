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
import FormateurService, { TrainerPerformanceResponse, StudentDetails, FormationPerformance, StagiaireFormationPerformance } from '@/services/FormateurService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BookOpen, TrendingUp, Award, Circle } from 'lucide-react';

const TrainerPerformanceStats = () => {
    const [data, setData] = useState<TrainerPerformanceResponse | null>(null);
    const [formations, setFormations] = useState<FormationPerformance[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
    const [details, setDetails] = useState<StudentDetails | null>(null);
    const [stagiaireFormations, setStagiaireFormations] = useState<StagiaireFormationPerformance[]>([]);
    const [loadingDetails, setLoadingDetails] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [perfRes, formRes] = await Promise.all([
                    FormateurService.getStudentsPerformance(),
                    FormateurService.getFormationsPerformance()
                ]);
                setData(perfRes);
                setFormations(formRes);
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
            const [statsRes, formRes] = await Promise.all([
                FormateurService.getStagiaireStats(id),
                FormateurService.getStagiaireFormations(id)
            ]);
            setDetails(statsRes);
            setStagiaireFormations(formRes);
        } catch (err) {
            console.error('Error fetching student details:', err);
        } finally {
            setLoadingDetails(false);
        }
    };

    const closeDetails = () => {
        setSelectedStudentId(null);
        setDetails(null);
        setStagiaireFormations([]);
    };

    if (loading || !data) {
        return (
            <div className="bg-white rounded-[2rem] border border-slate-100 p-20 flex flex-col items-center justify-center space-y-6 shadow-sm">
                <Trophy className="h-10 w-10 text-brand-primary/30 animate-pulse" />
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Synthèse analytique en cours...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Ranking: Most Quizzes */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-xl shadow-slate-200/40 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                        <Trophy className="h-24 w-24 text-brand-primary-dark" />
                    </div>
                    
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3.5 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 shadow-sm shadow-brand-primary/5">
                            <Trophy className="h-5 w-5 text-brand-primary-dark" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Top Quizzers</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Champions de la révision</p>
                        </div>
                    </div>

                    <div className="grid gap-3 relative z-10">
                        {(data?.rankings?.most_quizzes || []).map((student, idx) => (
                            <motion.div 
                                key={student.id} 
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-transparent hover:bg-white hover:border-slate-100 hover:shadow-lg hover:shadow-brand-primary/5 transition-all group/item"
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-black text-sm tracking-tighter shadow-sm transition-transform group-hover/item:scale-110 ${
                                        idx === 0 ? 'bg-brand-primary text-slate-900 shadow-brand-primary/20' : 
                                        idx === 1 ? 'bg-slate-200 text-slate-600' :
                                        idx === 2 ? 'bg-orange-100 text-orange-600' :
                                        'bg-white text-slate-400 border border-slate-100'
                                    }`}>
                                        {idx + 1}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="font-bold text-sm text-slate-900 truncate">{student.prenom} {student.name}</div>

                                        <div className="text-[10px] font-bold text-slate-400 truncate  mt-0.5">{student.email}</div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-black text-brand-primary-dark">{student.total_quizzes}</span>
                                    <span className="text-[8px] font-black text-slate-300  leading-none">Quiz</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Ranking: Most Active */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-xl shadow-slate-200/40 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                        <MousePointerClick className="h-24 w-24 text-blue-600" />
                    </div>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 shadow-sm shadow-blue-500/5">
                            <MousePointerClick className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Top Actifs</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Assiduité exemplaire</p>
                        </div>
                    </div>

                    <div className="grid gap-3 relative z-10">
                        {(data?.rankings?.most_active || []).map((student, idx) => (
                            <motion.div 
                                key={student.id} 
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-transparent hover:bg-white hover:border-slate-100 hover:shadow-lg hover:shadow-blue-500/5 transition-all group/item"
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-black text-sm tracking-tighter shadow-sm transition-transform group-hover/item:scale-110 ${
                                        idx === 0 ? 'bg-blue-600 text-white shadow-blue-500/20' : 
                                        'bg-white text-slate-400 border border-slate-100'
                                    }`}>
                                        {idx + 1}
                                    </div>
                                    <div className="min-w-0">
                                        
                                        <div className="font-bold text-sm text-slate-900 truncate">{student.prenom} {student.name}</div>

                                        <div className="text-[10px] font-bold text-slate-400 truncate  mt-0.5">{student.email}</div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-black text-blue-600">{student.total_logins}</span>
                                    <span className="text-[8px] font-black text-slate-300  leading-none">Sessions</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Performance per Formation */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                        <BookOpen className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div>
                        <h2 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Performance par Formation</h2>
                        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-1">Analyse cohorte par thématique</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(formations || []).map((formation, idx) => (
                        <motion.div
                            key={formation.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-lg shadow-slate-200/20 group hover:border-indigo-100 transition-all relative overflow-hidden"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="min-w-0 flex-1 mr-3">
                                    <h3 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                                        {formation.titre}
                                    </h3>
                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                                        {formation.student_count} Stagiaires
                                    </span>
                                </div>
                                <div className={`h-10 w-10 min-w-[2.5rem] rounded-xl flex items-center justify-center font-black text-xs ${
                                    formation.avg_score >= 80 ? 'bg-green-50 text-green-600 border border-green-100' :
                                    formation.avg_score >= 50 ? 'bg-brand-primary/10 text-brand-primary-dark border border-brand-primary/20' :
                                    'bg-red-50 text-red-600 border border-red-100'
                                }`}>
                                    {formation.avg_score}%
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-slate-300 uppercase leading-none mt-1">Moyenne</p>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${formation.avg_score}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className={`h-full rounded-full ${
                                                formation.avg_score >= 80 ? 'bg-green-500' :
                                                formation.avg_score >= 50 ? 'bg-brand-primary' :
                                                'bg-red-500'
                                            }`}
                                        />
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[8px] font-black text-slate-300 uppercase leading-none mb-1">Completions</p>
                                    <div className="text-sm font-black text-slate-900">
                                        {formation.total_completions}
                                        <span className="text-[10px] text-slate-300 font-bold ml-1">Quiz</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Performance Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand-primary/20" />
                
                <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                            <User className="h-5 w-5 text-slate-400" />
                        </div>
                        <div>
                            <h2 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Performance Détaillée</h2>
                            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-1">Audit en temps réel des cohortes</p>
                        </div>
                    </div>
                </div>

                <div className="relative overflow-x-auto custom-scrollbar">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="border-slate-100 hover:bg-transparent">
                                <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-10 h-14">Stagiaire</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-center h-14 whitespace-nowrap px-8">Dernière Activité</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-center h-14 whitespace-nowrap px-8">Indicateurs</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-right pr-10 h-14">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(data?.performance || []).map((student, index) => (
                                <motion.tr 
                                    key={student.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                    className="border-slate-50 hover:bg-slate-50/40 transition-colors group"
                                >
                                    <TableCell className="pl-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-11 w-11 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:border-brand-primary/30 transition-colors">
                                                <span className="text-xs font-black text-slate-400 group-hover:text-brand-primary-dark uppercase">
                                                    {student.name.charAt(0)}
                                                </span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-slate-900 truncate">
                                                    {student.prenom} {student.name}
                                                </p>
                                                <p className="text-[10px] font-bold text-slate-400 truncate mt-0.5 tracking-tight">{student.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center px-8">
                                        {student.last_quiz_at ? (
                                            <div className="inline-flex flex-col items-center group/date">
                                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 px-3 py-1 rounded-xl bg-slate-100 group-hover:bg-brand-primary/10 group-hover:text-brand-primary-dark transition-colors">
                                                    <Calendar className="h-3 w-3" />
                                                    {format(new Date(student.last_quiz_at), 'dd MMM yyyy', { locale: fr })}
                                                </div>
                                                <span className="text-[9px] font-bold text-slate-300 uppercase mt-1 tracking-tighter">
                                                    {format(new Date(student.last_quiz_at), 'HH:mm')}
                                                </span>
                                            </div>
                                        ) : (
                                            <Badge variant="outline" className="text-[9px] font-black text-slate-300 uppercase border-slate-100 bg-slate-50 rounded-lg h-6">Inactif</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center px-8">
                                        <div className="flex items-center justify-center gap-4">
                                            <div className="flex flex-col items-center">
                                                <span className="text-xs font-black text-brand-primary-dark">{student.total_quizzes}</span>
                                                <span className="text-[8px] font-black text-slate-300 uppercase">Quiz</span>
                                            </div>
                                            <div className="w-[1px] h-6 bg-slate-100" />
                                            <div className="flex flex-col items-center">
                                                <span className="text-xs font-black text-blue-600">{student.total_logins}</span>
                                                <span className="text-[8px] font-black text-slate-300 uppercase">Logs</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-10">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-10 px-4 text-[10px] font-black uppercase text-slate-400 hover:text-brand-primary-dark hover:bg-brand-primary/10 rounded-2xl group/btn transition-all"
                                            onClick={() => handleViewDetails(student.id)}
                                        >
                                            Détails
                                            <ChevronRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
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
                <DialogContent className="max-w-md bg-white border-slate-100 rounded-[2.5rem] shadow-2xl p-0 overflow-hidden ring-1 ring-black/5">
                    <DialogHeader className="p-8 pb-4 border-b border-slate-50 relative bg-slate-50/50">
                        <DialogTitle className="text-xs font-black uppercase text-slate-400 tracking-[0.3em] text-center">Filiation Analytique</DialogTitle>
                    </DialogHeader>
                    {loadingDetails ? (
                        <div className="py-24 flex flex-col items-center justify-center space-y-6">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                className="h-12 w-12 border-4 border-brand-primary/10 border-t-brand-primary rounded-full"
                            />
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest animate-pulse">Extraction de données...</p>
                        </div>
                    ) : details ? (
                        <div className="p-10 space-y-10 max-h-[75vh] overflow-y-auto custom-scrollbar">
                            {/* Student Info */}
                            <div className="flex items-center gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100 shadow-inner">
                                <div className="h-16 w-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-brand-primary-dark font-black text-2xl shadow-sm">
                                    {details.stagiaire.prenom[0]}{details.stagiaire.nom[0]}
                                </div>
                                <div className="min-w-0">
                                    <div className="text-xl font-black text-slate-900 truncate leading-tight">{details.stagiaire.prenom} {details.stagiaire.nom}</div>
                                    <div className="text-[11px] font-bold text-slate-400 truncate uppercase mt-1 tracking-tight">{details.stagiaire.email}</div>
                                </div>
                            </div>

                            {/* Quiz Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: 'Quiz Totaux', value: details.quiz_stats.total_quiz, icon: <Trophy className="h-4 w-4" />, color: 'brand-primary' },
                                    { label: 'Score Moyen', value: `${details.quiz_stats.avg_score}%`, icon: <CheckCircle2 className="h-4 w-4" />, color: 'green' },
                                    { label: 'Précision', value: `${details.quiz_stats.total_correct}/${details.quiz_stats.total_questions}`, icon: <Smartphone className="h-4 w-4" />, color: 'blue' },
                                    { label: 'Record personnel', value: `${details.quiz_stats.best_score}%`, icon: <Trophy className="h-4 w-4" />, color: 'orange' }
                                ].map((stat, i) => (
                                    <div key={i} className="p-5 rounded-2xl bg-white border border-slate-100 relative overflow-hidden group/stat hover:shadow-lg hover:shadow-slate-200/40 transition-all">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className={`text-slate-300 group-hover/stat:text-${stat.color}-500 transition-colors`}>{stat.icon}</div>
                                            <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider font-sans">{stat.label}</span>
                                        </div>
                                        <div className="text-2xl font-black text-slate-900 tracking-tighter">{stat.value}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Par Formation Breakdown */}
                            <div className="space-y-6 pt-6 border-t border-slate-100">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Par Formation</h4>
                                    <div className="h-[1px] flex-1 mx-4 bg-slate-50" />
                                </div>
                                <div className="space-y-3">
                                    {stagiaireFormations.length > 0 ? stagiaireFormations.map((sf) => (
                                        <div key={sf.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group/fcoll">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[11px] font-black text-slate-900 truncate max-w-[60%]">{sf.titre}</span>
                                                <Badge className={`text-[8px] font-black h-5 ${
                                                    sf.avg_score >= 80 ? 'bg-green-100 text-green-700 border-green-200' :
                                                    sf.avg_score >= 50 ? 'bg-brand-primary/10 text-brand-primary-dark border-brand-primary/20' :
                                                    'bg-red-100 text-red-700 border-red-200'
                                                }`}>
                                                    {sf.avg_score}%
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex gap-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-[8px] font-black text-slate-300 uppercase">Quiz</span>
                                                        <span className="text-[10px] font-bold text-slate-600">{sf.completions}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[8px] font-black text-slate-300 uppercase">Best</span>
                                                        <span className="text-[10px] font-bold text-slate-600">{sf.best_score}%</span>
                                                    </div>
                                                </div>
                                                {sf.last_activity && (
                                                    <div className="text-right">
                                                        <span className="text-[8px] font-black text-slate-300 uppercase">Activité</span>
                                                        <p className="text-[9px] font-bold text-slate-500">{format(new Date(sf.last_activity), 'dd/MM/yy', { locale: fr })}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-[10px] font-bold text-slate-400 text-center py-4 italic">Aucune formation active</p>
                                    )}
                                </div>
                            </div>

                            {/* Activity Info */}
                            <div className="space-y-6 pt-6 border-t border-slate-100">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Journal système</h4>
                                    <div className="h-[1px] flex-1 mx-4 bg-slate-50" />
                                </div>
                                <div className="grid gap-4">
                                    {[
                                        { label: 'Dernier signal', value: details.activity.last_activity, icon: <Clock className="h-4 w-4" /> },
                                        { label: 'Canal', value: details.activity.last_client || 'Web', icon: <Globe className="h-4 w-4" /> },
                                        { label: 'Statut LIVE', value: details.activity.is_online ? "ACTIF" : "OFFLINE", icon: <Circle className={`h-4 w-4 ${details.activity.is_online ? 'fill-green-500 text-green-500' : 'text-slate-300'}`} />, isBadge: true, active: details.activity.is_online }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between py-1">
                                            <div className="flex items-center gap-3">
                                                <div className="text-slate-400">{item.icon}</div>
                                                <span className="text-[11px] font-bold text-slate-500 tracking-tight">{item.label}</span>
                                            </div>
                                            {item.isBadge ? (
                                                <Badge className={`text-[9px] font-black rounded-lg ${item.active ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-slate-50 text-slate-400 border border-slate-100'} shadow-none h-6`}>
                                                    {item.value}
                                                </Badge>
                                            ) : (
                                                <span className="text-[11px] font-black text-slate-900">{item.value}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-24 text-center">
                            <XCircle className="h-12 w-12 text-slate-100 mx-auto mb-6" />
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Incident réseau détecté</p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TrainerPerformanceStats;
