import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { api } from '@/lib/api';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Mail, Phone, Calendar, Clock, Trophy, 
  BookOpen, Star, Activity, Award, Users, Shield, 
  Zap, TrendingUp, ChevronRight, Monitor, Smartphone, Globe
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';

interface StagiaireProfile {
  stagiaire: {
    id: number;
    prenom: string;
    nom: string;
    email: string;
    telephone: string;
    image?: string;
    created_at: string;
    date_inscription: string;
    date_debut_formation: string;
    last_login: string;
  };
  contacts: {
    formateurs: Array<{
      id: number;
      nom: string;
      telephone: string;
      email: string;
      image?: string;
      civilite?: string;
    }>;
    pole_relation: Array<{
      id: number;
      nom: string;
      telephone: string;
      email: string;
      image?: string;
      civilite?: string;
    }>;
    commercials: Array<{
      id: number;
      nom: string;
      telephone: string;
      email: string;
      image?: string;
      civilite?: string;
    }>;
    partenaire?: {
      id: number;
      nom: string;
      email?: string;
      telephone?: string;
    } | null;
  };
  stats: {
    total_points: number;
    current_badge: string;
    formations_completed: number;
    formations_in_progress: number;
    quizzes_completed: number;
    average_score: number;
    total_time_minutes: number;
    login_streak: number;
  };
  formations: Array<{
    id: number;
    title: string;
    category: string;
    progress: number;
    started_at: string;
    completed_at: string;
  }>;
  quiz_history: Array<{
    id: number;
    quiz_id: number;
    correctAnswers: number;
    totalQuestions: number;
    score: number;
    completedAt: string;
    timeSpent: number;
    quiz: {
      id: number;
      titre: string;
      niveau: string;
      formation: {
        categorie: string;
      };
    };
  }>;
  activity: {
    last_30_days: Array<{ date: string; actions: number }>;
    recent_activities: Array<{ type: string; title: string; score: number; timestamp: string }>;
  };
  login_history: Array<{
    id: number;
    ip_address: string;
    device: string;
    browser: string;
    platform: string;
    login_at: string;
  }>;
  video_stats: {
    total_watched: number;
    total_time_watched: number;
  };
}
const formatPhone = (phone) => {
  if (!phone) return "";

  // enlève tout sauf les chiffres
  const digits = phone.replace(/\D/g, "");

  // ex: 0341234567 → 034 12 345 67
  if (digits.length === 10) {
    return digits.replace(/(\d{3})(\d{2})(\d{3})(\d{2})/, "$1 $2 $3 $4");
  }

  // fallback si format différent
  return phone;
};


const getGenderedRole = (baseRole: 'formateur' | 'commercial', civilite?: string) => {
  const isFeminine = civilite?.toLowerCase().includes('mme') || civilite?.toLowerCase().includes('mlle');
  
  if (baseRole === 'formateur') {
    return isFeminine ? 'Formatrice' : 'Formateur';
  }
  if (baseRole === 'commercial') {
    return isFeminine ? 'Conseillère' : 'Conseiller';
  }
  return baseRole;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function StagiaireProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<StagiaireProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/formateur/stagiaire/${id}/profile`);
        const payload = response.data?.data || response.data;
        setData(payload);
      } catch (error) {
        console.error('Erreur chargement profil:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
       loadProfile();
    }
  }, [id]);

  const activityData = useMemo(() => {
    if (!data?.activity?.last_30_days) return [];
    return data.activity.last_30_days.map(d => ({
      date: new Date(d.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
      actions: d.actions
    }));
  }, [data]);

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-brand-primary/20 border-t-brand-primary animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Star className="h-6 w-6 text-brand-primary animate-pulse" />
            </div>
          </div>
          <p className="text-muted-foreground font-medium animate-pulse">Chargement du profil premium...</p>
        </div>
      </Layout>
    );
  }

  if (!data) return null;
 
  const { 
    stagiaire = {} as any, 
    stats = {} as any, 
    contacts = { formateurs: [], pole_relation: [], commercials: [] } as any,
    formations = [], 
    quiz_history = [],
    login_history = []
  } = data;

  return (
    <Layout>
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 pb-20">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8"
        >
          
          {/* Back Button */}
          <motion.button 
            variants={itemVariants}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-brand-primary transition-all group px-4 py-2 rounded-lg hover:bg-white dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold text-sm">Retour à la liste des stagiaires</span>
          </motion.button>

          {/* Header Profile - Glassmorphism */}
          <motion.div 
            variants={itemVariants}
            className="relative overflow-hidden rounded-3xl border border-white/40 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-2xl shadow-brand-primary/5"
          >
            {/* Background Decorative patterns */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-primary/5 pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="h-48 bg-brand-primary relative">
               {/* Pattern overlay */}
               <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
               
               <div className="absolute -bottom-16 left-12 group">
                  <div className="relative">
                    <Avatar className="h-32 w-32 border-[6px] border-white dark:border-slate-900 shadow-2xl transition-transform duration-500 group-hover:scale-105">
                      <AvatarImage src={stagiaire.image && stagiaire.image.startsWith('http') ? stagiaire.image : (stagiaire.image ? `${import.meta.env.VITE_API_URL_MEDIA}/${stagiaire.image}` : undefined)} />
                      <AvatarFallback className="text-4xl font-black bg-slate-100 dark:bg-slate-800 text-brand-primary">
                        {stagiaire.prenom?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-green-500 border-4 border-white dark:border-slate-900 rounded-full flex items-center justify-center shadow-lg">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                  </div>
               </div>
            </div>

            <div className="pt-20 pb-10 px-12 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                      {stagiaire.prenom} <span className="text-brand-primary">{stagiaire.nom}</span>
                    </h1>
                    {/* <Badge className="bg-brand-primary/10 text-brand-primary border-none text-xs font-black  px-3 py-1">
                      Stagiaire Actif
                    </Badge> */}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mt-4">
                    <div className="space-y-2">
                      <a href={`mailto:${stagiaire.email}`} className="flex items-center gap-3 text-slate-500 hover:text-brand-primary transition-colors text-sm font-medium">
                        <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <Mail className="h-4 w-4" />
                        </div>
                        {stagiaire.email}
                      </a>
                      {stagiaire.telephone && (
                        <a
                          href={`tel:${stagiaire.telephone.replace(/\D/g, "")}`}
                          className="flex items-center gap-3 text-slate-500 hover:text-brand-primary transition-colors text-sm font-medium"
                        >
                          <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <Phone className="h-4 w-4" />
                          </div>
                          {formatPhone(stagiaire.telephone)}
                        </a>
                      )}

                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                        <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <Calendar className="h-4 w-4" />
                        </div>
                        Membre depuis le {new Date(stagiaire.date_inscription).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </div>
                      {stagiaire.date_debut_formation && (
                        <div className="flex items-center gap-3 text-brand-primary text-sm font-bold">
                          <div className="h-8 w-8 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                            <Zap className="h-4 w-4" />
                          </div>
                          Formation démarrée le {new Date(stagiaire.date_debut_formation).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-4 min-w-[200px]">
                 {/* <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border border-slate-100 dark:border-white/10 w-full">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Badge Actuel</span>
                      <Trophy className="h-3 w-3 text-brand-primary" />
                    </div>
                    <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                      {stats.current_badge || 'BRONZE'}
                    </p>
                 </div> */}
                 <span className="text-xs font-bold text-slate-400 flex items-center gap-2">
                   <Clock className="h-3.5 w-3.5" />
                   Dernière activité: {stagiaire.last_login ? new Date(stagiaire.last_login).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Inconnue'}
                 </span>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid - Premium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <PremiumStatCard 
              icon={Star} 
              label="Points Totaux" 
              value={stats.total_points} 
              trend="+12%"
              color="bg-amber-500"
              delay={0.1}
            />
            <PremiumStatCard 
              icon={BookOpen} 
              label="Formations" 
              value={`${stats.formations_completed}/${stats.formations_completed + stats.formations_in_progress}`} 
              trend="En cours"
              color="bg-blue-600"
              delay={0.2}
            />
            <PremiumStatCard 
              icon={Activity} 
              label="Score Moyen" 
              value={`${stats.average_score}%`} 
              trend={`${stats.quizzes_completed} quiz`}
              color="bg-emerald-600"
              delay={0.3}
            />
            <PremiumStatCard 
              icon={Clock} 
              label="Total Learning" 
              value={`${Math.round(stats.total_time_minutes / 60)}h`} 
              trend={`${stats.total_time_minutes % 60}m restants`}
              color="bg-purple-600"
              delay={0.4}
            />
            <PremiumStatCard 
              icon={Monitor} 
              label="Vidéos" 
              value={data.video_stats?.total_watched || 0} 
              trend={`${data.video_stats?.total_time_watched || 0}m`}
              color="bg-rose-600"
              delay={0.5}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Activity Chart */}
              <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-white/10 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-brand-primary" />
                      Engagement 30 derniers jours
                    </h2>
                    <p className="text-sm text-slate-400 font-medium">Suivi des actions et participations</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="rounded-full px-4 py-1.5 font-bold border-slate-100 text-slate-500">30 Jours</Badge>
                  </div>
                </div>
                
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activityData}>
                      <defs>
                        <linearGradient id="colorActions" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FB923C" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#FB923C" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fontWeight: 700, fill: '#64748B'}} 
                        dy={10}
                      />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '16px', 
                          border: 'none', 
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                          padding: '12px' 
                        }}
                        itemStyle={{ fontWeight: 800, color: '#FB923C' }}
                        labelStyle={{ fontWeight: 800, marginBottom: '4px' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="actions" 
                        stroke="#FB923C" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorActions)" 
                        animationDuration={2000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Formations List - Enhanced */}
              <div className="space-y-6">
                <div className="flex justify-between items-end px-2">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-brand-primary" />
                      </div>
                      Parcours de formation
                    </h2>
                  </div>
                  <span className="text-xs font-black text-brand-primary uppercase tracking-widest bg-brand-primary/5 px-4 py-2 rounded-full">
                    {formations.length} Programmes
                  </span>
                </div>
                
                <div className="grid gap-6">
                  {formations.length === 0 ? (
                    <div className="p-12 text-center rounded-3xl border-2 border-dashed border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                      <BookOpen className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                      <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Aucune formation assignée à ce profil</p>
                    </div>
                  ) : (
                    formations.map((formation, idx) => (
                      <motion.div 
                        key={formation.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * idx }}
                        className="group relative"
                      >
                        <Card className="overflow-hidden border-slate-100 dark:border-white/10 hover:border-brand-primary/30 shadow-sm hover:shadow-xl hover:shadow-brand-primary/5 transition-all duration-300 rounded-3xl">
                          <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row">
                              <div className="w-full md:w-2 bg-brand-primary" />
                              <div className="flex-1 p-8">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter border-slate-100 text-slate-400">
                                        ID: #{formation.id}
                                      </Badge>
                                      <span className="text-[10px] font-black uppercase text-brand-primary tracking-widest">
                                        {formation.category || 'Général'}
                                      </span>
                                    </div>
                                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-brand-primary transition-colors">
                                      {formation.title}
                                    </h3>
                                  </div>
                                  <div className="flex flex-col items-end">
                                    <div className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider ${
                                      formation.progress === 100 
                                      ? "bg-green-500/10 text-green-600" 
                                      : "bg-brand-primary/10 text-brand-primary"
                                    }`}>
                                      {formation.progress === 100 ? "Validée" : `${formation.progress}% Complété`}
                                    </div>
                                    {formation.completed_at && (
                                      <span className="text-[10px] font-bold text-slate-400 mt-2">
                                        Fini le {new Date(formation.completed_at).toLocaleDateString()}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="space-y-6 mt-6">
                                  <div className="space-y-3">
                                    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                                      <span>Progression du module</span>
                                      <span className="text-slate-900 dark:text-white">{formation.progress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-white/5 h-4 rounded-full overflow-hidden p-1 border border-slate-200/50 dark:border-white/5">
                                      <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${formation.progress}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className={`h-full rounded-full shadow-inner ${
                                          formation.progress === 100 
                                          ? "bg-emerald-600" 
                                          : "bg-brand-primary"
                                        }`}
                                      />
                                    </div>
                                  </div>

                                  {/* Level Breakdown Integration */}
                                  {formation.levels && formation.levels.length > 0 && (
                                    <div className="pt-4 border-t border-slate-50 dark:border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                      {formation.levels.map((level) => (
                                        <div key={level.name} className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl border border-transparent hover:border-brand-primary/20 transition-colors">
                                          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{level.name}</div>
                                          <div className="flex justify-between items-end">
                                            <span className="text-sm font-black text-slate-900 dark:text-white">{level.avg_score}%</span>
                                            <span className="text-[9px] font-bold text-slate-400">{level.completions} quiz</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar Columns */}
            <div className="space-y-8">
              
              {/* Recent Quiz - Enhanced List */}
              <div className="space-y-6">
                <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                   <div className="h-10 w-10 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-brand-primary" />
                  </div>
                  Performances Quiz
                </h2>
                <Card className="rounded-3xl border-slate-100 dark:border-white/10 overflow-hidden shadow-sm">
                  <CardContent className="p-0">
                    <AnimatePresence>
                      {quiz_history.length === 0 ? (
                        <div className="p-12 text-center">
                          <Activity className="h-8 w-8 text-slate-100 mx-auto mb-2" />
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Aucune participation</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-50 dark:divide-white/5">
                          {quiz_history.slice(0, 6).map((quiz, i) => (
                            <motion.div 
                              key={i} 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="p-5 hover:bg-slate-50 dark:hover:bg-white/5 transition-all group pointer-events-none"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="space-y-0.5">
                                  <span className="text-[9px] font-black  text-brand-primary tracking-widest">
                                    {quiz.quiz?.formation?.categorie || 'Quiz'}
                                  </span>
                                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1">
                                    {quiz.quiz?.titre || 'Participation'}
                                  </h4>
                                </div>
                                <div className={`text-xl font-black rounded-xl px-2.5 py-1 ${
                                  quiz.score >= 8 ? 'text-green-600 bg-green-50' : 
                                  quiz.score >= 5 ? 'text-orange-500 bg-orange-50' : 'text-red-500 bg-red-50'
                                }`}>
                                  {quiz.score*10}%
                                </div>
                              </div>
                              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-3 w-3" />
                                  {Math.floor(quiz.timeSpent / 60)}m {quiz.timeSpent % 60}s
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(quiz.completedAt).toLocaleString('fr-FR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </div>

                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </AnimatePresence>
                    {quiz_history.length > 6 && (
                      <div className="p-4 bg-slate-50/50 dark:bg-white/5 text-center">
                        <button className="text-[10px] font-black uppercase tracking-widest text-brand-primary active:scale-95 transition-transform">
                          Voir tout l'historique
                        </button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Accompagnement - Better Cards */}
              <div className="space-y-6">
                <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-brand-primary" />
                  </div>
                  Équipe Dédiée
                </h2>
                <div className="space-y-4">
                   {contacts.formateurs.length > 0 && (
                     <ContactSection title="Equipe formation" contacts={contacts.formateurs} roleType="formateur" />
                   )}
   
                   {contacts.pole_relation.length > 0 && (
                     <ContactSection title="Suivi Administratif" contacts={contacts.pole_relation} roleType="relation" />
                   )}
   
                   {contacts.commercials.length > 0 && (
                     <ContactSection title="Equipe commerciale" contacts={contacts.commercials} roleType="commercial" />
                   )}
   
                   {contacts.partenaire && (
                      <div className="space-y-3">
                        <p className="text-[10px] font-black  tracking-widest text-slate-400 ml-1">Partenaire Social</p>
                        <ContactSmallCard 
                          name={contacts.partenaire.nom} 
                          firstname={contacts.partenaire.prenom} 
                          role="Entreprise" 
                          email={contacts.partenaire.email || undefined} 
                          phone={contacts.partenaire.telephone || undefined} 
                        />
                      </div>
                   )}
                </div>
              </div>

              {/* Device/IP Log - Visual overhaul */}
              <div className="space-y-6">
                <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-brand-primary" />
                  </div>
                  Sécurité & Accès
                </h2>
                <Card className="rounded-3xl border-slate-100 dark:border-white/10 overflow-hidden shadow-sm">
                  <CardContent className="p-0">
                    {login_history.length === 0 ? (
                      <div className="p-12 text-center text-[10px] font-black text-slate-300  tracking-widest">
                        Aucun log de sécurité
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-50 dark:divide-white/5">
                        {login_history.slice(0, 5).map((h: any, i: number) => (
                          <div key={i} className="p-5 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                            <div className="flex gap-4 items-center">
                              <div className="h-10 w-10 shrink-0 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500">
                                {h.platform?.toLowerCase().includes('win') ? <Monitor className="h-5 w-5" /> : 
                                 h.platform?.toLowerCase().includes('ios') || h.platform?.toLowerCase().includes('android') ? <Smartphone className="h-5 w-5" /> : 
                                 <Globe className="h-5 w-5" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-0.5">
                                  <span className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                                    {h.platform} — {h.browser}
                                  </span>
                                  <span className="text-[9px] font-black text-brand-primary shrink-0 ml-2">
                                    {h.login_at ? new Date(h.login_at).toLocaleDateString() : '-'}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <p className="text-[10px] font-black text-slate-400  tracking-tighter truncate opacity-70">
                                    IP: {h.ip_address}
                                  </p>
                                  <span className="text-[9px] font-black text-slate-300 ">
                                     {h.login_at ? new Date(h.login_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
const getContactRoleLabel = (
  roleType: 'formateur' | 'commercial' | 'relation',
  contact: any
): string => {
  switch (roleType) {
    case 'formateur':
      return getGenderedRole('formateur', contact.civilite);

    case 'commercial':
      return getGenderedRole('commercial', contact.civilite);

    case 'relation':
      // libellé venant de l’API ou fallback
      return contact.role || 'Relation';

    default:
      return '';
  }
};

function ContactSection({
  title,
  contacts,
  roleType,
}: {
  title: string;
  contacts: any[];
  roleType: 'formateur' | 'commercial' | 'relation';
}) {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-black tracking-widest text-slate-400 ml-1">
        {title}
      </p>

      <div className="grid gap-3">
        {contacts.map((contact) => (
          <ContactSmallCard
            key={contact.id}
            name={contact.nom}
            firstname={contact.prenom}
            role={getContactRoleLabel(roleType, contact)}
            email={contact.email}
            phone={contact.telephone}
            image={contact.image}
          />
        ))}
      </div>
    </div>
  );
}


function PremiumStatCard({ icon: Icon, label, value, trend, color, delay }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      whileHover={{ y: -5 }}
      className="relative group h-full"
    >
      <div className={`absolute inset-0 ${color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`} />
      <Card className="h-full border-white/40 dark:border-white/5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md shadow-sm hover:shadow-2xl hover:shadow-brand-primary/10 transition-all rounded-3xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col h-full space-y-4">
            <div className={`h-12 w-12 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400  tracking-widest mb-1">{label}</p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{value}</h3>
              <div className="flex items-center gap-2 mt-2">
                <div className={`h-1.5 w-6 rounded-full ${color}`} />
                <p className="text-[10px] font-black text-slate-400  tracking-widest truncate">{trend}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ContactSmallCard({ name, firstname, role, email, phone, image }: { 
  name: string; 
  firstname: string;
  role: string; 
  email?: string; 
  phone?: string;
  image?: string;
}) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="group">
      <Card className="p-4 border-slate-100 dark:border-white/10 hover:border-brand-primary/30 bg-white dark:bg-slate-900 rounded-2xl shadow-sm transition-all">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-white dark:border-slate-800 shadow-md">
              <AvatarImage src={image && image.startsWith('http') ? image : (image ? `${import.meta.env.VITE_API_URL_MEDIA}/${image}` : undefined)} />
              <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-brand-primary font-bold text-sm">
                {firstname.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-brand-primary rounded-full border-2 border-white dark:border-slate-900" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate group-hover:text-brand-primary transition-colors">{firstname} {name}</h4>
              <span className="text-[9px] font-black bg-brand-primary/5 text-brand-primary  tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap">
                {role}
              </span>
            </div>
            <div className="flex gap-4 mt-1.5">
              {email && (
                <a href={`mailto:${email}`} className="group/link flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-brand-primary transition-colors">
                  <Mail className="h-3 w-3" />
                  Envoyer un mail
                </a>
              )}
              {phone && (
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="group/link flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-brand-primary transition-colors">
                  <Phone className="h-3 w-3" />
                  Appeler
                </a>
              )}
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-200 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
        </div>
      </Card>
    </motion.div>
  );
}

