import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { 
    TrendingUp, 
    TrendingDown, 
    Users, 
    CheckCircle2, 
    Star, 
    Calendar,
    Filter,
    ArrowLeft,
    BarChart3,
    Activity,
    UserCircle2,
    BookOpen,
    AlertCircle,
    Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import FormateurService from '@/services/FormateurService';
import TrainerPerformanceStats, { RankingsSection, StudentPerformanceTable, StudentDetailModal } from '@/components/formateur/TrainerPerformanceStats';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function Analytiques() {
    const navigate = useNavigate();
    const [period, setPeriod] = useState(30);
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState<any>(null);
    const [successStats, setSuccessStats] = useState<any[]>([]);
    const [activityByDay, setActivityByDay] = useState<any[]>([]);
    const [dropoutStats, setDropoutStats] = useState<any[]>([]);
    const [formations, setFormations] = useState<any[]>([]);
    const [formationId, setFormationId] = useState('');
    const [formationsPerformance, setFormationsPerformance] = useState<any[]>([]);
    const [studentsPerformance, setStudentsPerformance] = useState<any>(null);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

    useEffect(() => {
        loadFormations();
    }, []);

    useEffect(() => {
        loadData();
    }, [period, formationId]);

    const loadFormations = async () => {
        try {
            const data = await FormateurService.getFormations();
            setFormations(data);
        } catch (error) {
            console.error('Error loading formations:', error);
        }
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const [summaryData, successData, activityData, dropoutData, performanceData, studentsData, activityLog] = await Promise.all([
                FormateurService.getDashboardSummary(period, formationId),
                FormateurService.getQuizSuccessRate(period, formationId),
                FormateurService.getActivityHeatmap(period, formationId),
                FormateurService.getDropoutRate(formationId),
                FormateurService.getFormationsPerformance(),
                FormateurService.getStudentsPerformance(formationId),
                FormateurService.getRecentActivity()
            ]);

            setSummary(summaryData);
            setSuccessStats(successData);
            setActivityByDay(activityData);
            setDropoutStats(dropoutData);
            setFormationsPerformance(performanceData);
            setStudentsPerformance(studentsData);
            setRecentActivity(activityLog.activity || []);
        } catch (error) {
            console.error('Error loading analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { label: "Vue d'ensemble", icon: BarChart3 },
        { label: "Formations", icon: BookOpen },
        { label: "Taux de réussite", icon: CheckCircle2 },
        { label: "Activité", icon: Activity },
    ];

    return (
        <Layout>
            <div className="pb-20 -mx-3 -mt-3 md:-mx-4 md:-mt-4 lg:-mx-6 lg:-mt-6 min-h-full bg-[#F8FAFC]">
                {/* Header */}
                <header className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm px-6 py-4 mb-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="rounded-full md:hidden"
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 tracking-tight">Analytiques & Rapports</h1>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Intelligence & Pilotage de formation</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Period Selector */}
                        <div className="bg-slate-50 p-1 rounded-2xl border border-slate-100 flex gap-1">
                            {[30, 60, 90].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPeriod(p)}
                                    className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                                        period === p 
                                        ? "bg-white text-brand-primary-dark shadow-sm border border-slate-100" 
                                        : "text-slate-400 hover:text-slate-600"
                                    }`}
                                >
                                    {p}j
                                </button>
                            ))}
                        </div>

                        {/* Formation Filter */}
                        <div className="relative group">
                            <select 
                                value={formationId} 
                                onChange={(e) => setFormationId(e.target.value)}
                                className="appearance-none bg-slate-50 border border-slate-100 text-[11px] font-black uppercase tracking-wider text-slate-700 px-10 py-2.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all cursor-pointer min-w-[200px]"
                            >
                                <option value="">Toutes les formations</option>
                                {formations.map((f: any) => (
                                    <option key={f.id} value={f.id}>{f.titre}</option>
                                ))}
                            </select>
                            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 mt-8">
                {/* Custom Tabs */}
                <div className="flex overflow-x-auto custom-scrollbar gap-2 mb-8 pb-2">
                    {tabs.map((tab, idx) => (
                        <button
                            key={idx}
                            onClick={() => setTabValue(idx)}
                            className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl whitespace-nowrap transition-all duration-300 ${
                                tabValue === idx 
                                ? "bg-brand-primary text-slate-900 font-black shadow-lg shadow-brand-primary/20 scale-[1.02]" 
                                : "bg-white text-slate-400 font-bold border border-slate-100 hover:border-slate-200"
                            }`}
                        >
                            <tab.icon className={`h-4 w-4 ${tabValue === idx ? "text-slate-900" : "text-slate-300"}`} />
                            <span className="text-[11px] uppercase tracking-wider">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 space-y-6">
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                            className="h-12 w-12 border-4 border-brand-primary/10 border-t-brand-primary rounded-full"
                        />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Synthèse des données en cours...</p>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={tabValue}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Tab 0: Vue d'ensemble */}
                            {tabValue === 0 && summary && studentsPerformance && (
                                <div className="space-y-12">
                                    <OverviewTab summary={summary} />
                                    <StudentPerformanceTable 
                                        performance={studentsPerformance.performance} 
                                        onViewDetails={setSelectedStudentId} 
                                    />
                                    <StudentDetailModal 
                                        studentId={selectedStudentId} 
                                        onClose={() => setSelectedStudentId(null)} 
                                    />
                                </div>
                            )}

                            {/* Tab 1: Formations */}
                            {tabValue === 1 && studentsPerformance && (
                                <div className="space-y-12">
                                    <FormationsTab performance={formationsPerformance} />
                                    <div className="pt-8 border-t border-slate-100">
                                        <RankingsSection data={studentsPerformance} />
                                    </div>
                                    <div className="pt-8 border-t border-slate-100">
                                        <h2 className="text-xl font-black text-slate-900 tracking-tight mb-8">Stagiaires de cette formation</h2>
                                        <StudentPerformanceTable 
                                            performance={studentsPerformance.performance} 
                                            onViewDetails={setSelectedStudentId} 
                                        />
                                    </div>
                                    <StudentDetailModal 
                                        studentId={selectedStudentId} 
                                        onClose={() => setSelectedStudentId(null)} 
                                    />
                                </div>
                            )}

                            {/* Tab 2: Taux de réussite */}
                            {tabValue === 2 && <SuccessRateTab stats={successStats} />}

                            {/* Tab 3: Activité */}
                            {tabValue === 3 && (
                                <ActivityTab 
                                    heatmap={activityByDay} 
                                    dropout={dropoutStats} 
                                    activityLog={recentActivity}
                                    onViewStudent={setSelectedStudentId}
                                />
                            )}
                            {tabValue === 3 && (
                                <StudentDetailModal 
                                    studentId={selectedStudentId} 
                                    onClose={() => setSelectedStudentId(null)} 
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                )}
            </main>
            </div>
        </Layout>
    );
}

// --- Sub-components for Tabs ---

const OverviewTab = ({ summary }: { summary: any }) => {
    const cards = [
        { label: 'Stagiaires', value: summary.total_stagiaires, icon: Users, color: 'bg-blue-500', iconColor: 'text-blue-500' },
        { label: 'Actifs', value: summary.active_stagiaires, icon: Activity, color: 'bg-green-500', iconColor: 'text-green-500' },
        { label: 'Quiz Complétés', value: summary.total_completions, icon: CheckCircle2, color: 'bg-orange-500', iconColor: 'text-orange-500' },
        { label: 'Score Moyen', value: `${summary.average_score.toFixed(1)}%`, icon: Star, color: 'bg-purple-500', iconColor: 'text-purple-500' },
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/20 relative overflow-hidden group hover:-translate-y-1 transition-transform"
                    >
                        <div className={`absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity ${card.iconColor}`}>
                            <card.icon className="h-20 w-20" />
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`p-3 rounded-2xl ${card.color.replace('bg-', 'bg-')}/10 shadow-sm border ${card.color.replace('bg-', 'border-')}/20`}>
                                <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{card.label}</span>
                        </div>
                        <div className="text-3xl font-black text-slate-900 tracking-tighter">{card.value}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Trend Card */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 flex items-center justify-center gap-10">
                    <div className={`p-6 rounded-full ${summary.trend_percentage >= 0 ? "bg-green-50 text-green-500" : "bg-red-50 text-red-500"}`}>
                        {summary.trend_percentage >= 0 ? <TrendingUp className="h-10 w-10" /> : <TrendingDown className="h-10 w-10" />}
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Tendance</p>
                        <div className={`text-5xl font-black tracking-tighter ${summary.trend_percentage >= 0 ? "text-green-500" : "text-red-500"}`}>
                            {summary.trend_percentage >= 0 ? "+" : ""}{summary.trend_percentage.toFixed(1)}%
                        </div>
                        <p className="text-[11px] font-bold text-slate-400 mt-2 italic whitespace-nowrap">par rapport à la période précédente</p>
                    </div>
                </div>

                {/* Top Formations Summary */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Performances Récentes</h3>
                        <Badge variant="outline" className="text-[9px] font-black border-slate-100 px-3">Temps réel</Badge>
                    </div>
                    <div className="space-y-4">
                        {summary.formations?.slice(0, 3).map((f: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center">
                                        <BookOpen className="h-5 w-5 text-brand-primary" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-black text-slate-900 truncate max-w-[150px]">{f.titre || f.nom}</p>
                                        <p className="text-[9px] font-bold text-slate-400">{f.studentCount} Apprenants</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-black text-brand-primary-dark">{f.avgScore.toFixed(0)}%</div>
                                    <div className="text-[8px] font-black text-slate-300 uppercase leading-none">Score Moyen</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const FormationsTab = ({ performance }: { performance: any[] }) => {
    return (
        <div className="space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20">
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-brand-primary/10 rounded-2xl border border-brand-primary/20">
                        <BarChart3 className="h-5 w-5 text-brand-primary-dark" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-slate-900 tracking-tight uppercase">Performance Comparative</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Synthèse par catalogue de formation</p>
                    </div>
                </div>

                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={performance} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis 
                                dataKey="titre" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 900 }}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 900 }}
                            />
                            <Tooltip 
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                cursor={{ fill: '#F8FAFC' }}
                            />
                            <Bar 
                                name="Taux de complétion (%)" 
                                dataKey="completion_rate" 
                                fill="#F7931E" 
                                radius={[6, 6, 0, 0]} 
                                barSize={30}
                            />
                            <Bar 
                                name="Score Moyen (%)" 
                                dataKey="average_score" 
                                fill="#FACC15" 
                                radius={[6, 6, 0, 0]} 
                                barSize={30}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {performance.map((f, i) => (
                    <motion.div 
                        key={i}
                        className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/10 group hover:border-brand-primary/20 transition-all"
                    >
                        <h3 className="text-sm font-black text-slate-900 mb-4 truncate">{f.titre || f.nom}</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase mb-1.5">
                                    <span>Complétion</span>
                                    <span className="text-slate-900">{f.completion_rate}%</span>
                                </div>
                                <Progress value={f.completion_rate} className="h-1.5 bg-slate-50" />
                            </div>
                            <div>
                                <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase mb-1.5">
                                    <span>Score Moyen</span>
                                    <span className="text-slate-900">{f.average_score}%</span>
                                </div>
                                <Progress value={f.average_score} className="h-1.5 bg-slate-50" />
                            </div>
                            <div className="flex items-center justify-between pt-2">
                                <span className="text-[10px] font-bold text-slate-300 italic">{f.student_count} Apprenants</span>
                                <Badge className="bg-green-50 text-green-600 border-none px-2 h-5 text-[9px] font-black">{f.total_completions} Terminé(s)</Badge>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const SuccessRateTab = ({ stats }: { stats: any[] }) => {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
                <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                            <Star className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-sm font-black text-slate-900 tracking-tight uppercase">Dashboard Réussite par Quiz</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Analyse de la difficulté des thématiques</p>
                        </div>
                    </div>
                </div>
                
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stats.map((stat, i) => (
                            <motion.div 
                                key={i}
                                className="p-6 rounded-3xl bg-slate-50/50 border border-slate-100 relative group overflow-hidden"
                            >
                                <div className="absolute top-4 right-4 text-xs font-black text-slate-200 uppercase tracking-tighter group-hover:text-slate-300 group-hover:scale-110 transition-all opacity-20"># {i+1}</div>
                                <div className="mb-6">
                                    <h3 className="text-sm font-black text-slate-900 mb-1 truncate pr-8">{stat.quiz_name}</h3>
                                    <Badge variant="outline" className="text-[8px] font-black border-slate-200 text-slate-400 uppercase">{stat.category}</Badge>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-end justify-between">
                                        <div className="text-3xl font-black text-slate-900 tracking-tighter">
                                            {stat.success_rate.toFixed(1)}<span className="text-sm ml-0.5">%</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] font-black text-slate-900">{stat.successful_attempts}/{stat.total_attempts}</span>
                                            <span className="text-[8px] font-black text-slate-300 uppercase">Réussites</span>
                                        </div>
                                    </div>

                                    <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-slate-100 p-0.5 shadow-inner">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${stat.success_rate}%` }}
                                            className={`h-full rounded-full ${
                                                stat.success_rate >= 80 ? "bg-green-500" :
                                                stat.success_rate >= 50 ? "bg-orange-500" :
                                                "bg-red-500"
                                            }`}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ActivityTab = ({ heatmap, dropout, activityLog, onViewStudent }: { 
    heatmap: any[], 
    dropout: any[], 
    activityLog: any[],
    onViewStudent: (id: number) => void
}) => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Activity Heatmap Alternative (Bar Chart) */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20">
                            <Activity className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-sm font-black text-slate-900 tracking-tight uppercase">Activité Journalière</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Intensité des connexions & participations</p>
                        </div>
                    </div>

                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={heatmap}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis 
                                    dataKey="day" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 900 }}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 900 }}
                                />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none' }}
                                    cursor={{ fill: '#FFF7ED' }}
                                />
                                <Bar 
                                    dataKey="activity_count" 
                                    fill="#F7931E" 
                                    radius={[4, 4, 0, 0]} 
                                    barSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity Feed */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-brand-primary/10 rounded-2xl border border-brand-primary/20">
                                <Clock className="h-5 w-5 text-brand-primary-dark" />
                            </div>
                            <div>
                                <h2 className="text-sm font-black text-slate-900 tracking-tight uppercase">Activités Récentes</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Flux en temps réel des stagiaires</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar max-h-[350px] pr-2">
                        {activityLog.length > 0 ? activityLog.map((log) => (
                            <div key={log.id} className="flex items-start gap-4 p-3 rounded-2xl bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer group" onClick={() => onViewStudent(log.user.id)}>
                                <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-brand-primary/30 transition-colors">
                                    {log.user.image ? (
                                        <img 
                                            src={log.user.image.startsWith('http') ? log.user.image : `${import.meta.env.VITE_API_URL_MEDIA}/${log.user.image.startsWith('/') ? log.user.image.substring(1) : log.user.image}`} 
                                            alt={log.user.name} 
                                            className="h-full w-full object-cover" 
                                        />
                                    ) : (
                                        <span className="text-xs font-black text-slate-400">
                                            {log.user.prenom?.[0]}{log.user.name?.[0]}
                                        </span>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-xs font-bold text-slate-900 truncate">{log.user.prenom} {log.user.name.toUpperCase()}</p>
                                        <span className="text-[9px] font-black text-slate-300 uppercase shrink-0">
                                            {format(new Date(log.created_at), 'dd/MM HH:mm', { locale: fr })}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-medium mt-0.5 line-clamp-1">
                                        A terminé le quiz <span className="font-black text-brand-primary-dark">{log.content.quiz_title}</span> avec un score de <span className="font-black">{log.content.score*10}%</span>
                                    </p>
                                </div>
                            </div>
                        )) : (
                            <div className="flex flex-col items-center justify-center py-10 opacity-40">
                                <Activity className="h-8 w-8 mb-2" />
                                <p className="text-[10px] font-black uppercase">Aucune activité récente</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Dropout Stats */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-sm font-black text-slate-900 tracking-tight uppercase">Fuites & Abandons (Top 5)</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Points de friction critiques identifiés</p>
                        </div>
                    </div>
                    <Badge className="bg-red-50 text-red-600 border-none font-black text-[10px] py-1 px-4 uppercase tracking-wider">Alerte Rétention</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {dropout.slice(0, 5).map((d, i) => (
                        <div key={i} className="bg-slate-50 rounded-3xl p-6 border border-slate-100 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-12 h-12 bg-red-500/5 rotate-45 translate-x-6 -translate-y-6" />
                           <p className="text-xs font-black text-slate-900 mb-1 truncate pr-4">{d.quiz_name}</p>
                           <p className="text-[9px] font-bold text-slate-400 uppercase mb-4">{d.abandoned} Abandons</p>
                           
                           <div className="flex items-center justify-between">
                               <div className="text-2xl font-black text-red-500 tracking-tighter">{d.dropout_rate.toFixed(1)}%</div>
                               <div className="h-8 w-8 rounded-full border border-red-100 flex items-center justify-center bg-white shadow-sm">
                                   <TrendingDown className="h-4 w-4 text-red-500" />
                               </div>
                           </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
