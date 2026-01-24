import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { api } from '@/lib/api';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Mail, Phone, Calendar, Clock, Trophy, 
  BookOpen, Star, Activity, Award 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StagiaireProfile {
  stagiaire: {
    id: number;
    prenom: string;
    nom: string;
    email: string;
    telephone: string;
    image?: string;
    created_at: string;
    last_login: string;
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
    quiz_id: number;
    title: string;
    category: string;
    score: number;
    completed_at: string;
  }>;
}

export default function StagiaireProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<StagiaireProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
       loadProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);


  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/formateur/stagiaire/${id}/profile`);
      setData(response.data);
    } catch (error) {
      console.error('Erreur chargement profil:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!data) return null;

  const { stagiaire, stats, formations, quiz_history } = data;

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'OR': return 'bg-yellow-400 text-yellow-900 border-yellow-200';
      case 'ARGENT': return 'bg-gray-300 text-gray-800 border-gray-200';
      case 'BRONZE': return 'bg-amber-600 text-white border-amber-700';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background pb-12">
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Retour à la liste
          </button>

          {/* Header Profile */}
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-brand-primary to-brand-secondary/80 relative">
               <div className="absolute -bottom-12 left-8">
                  <Avatar className="h-24 w-24 border-4 border-card shadow-md">
                    <AvatarImage src={stagiaire.image} />
                    <AvatarFallback className="text-2xl font-bold bg-muted">
                      {stagiaire.prenom?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
               </div>
            </div>
            <div className="pt-16 pb-6 px-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {stagiaire.prenom} {stagiaire.nom}
                </h1>
                <div className="flex flex-col gap-1 mt-2">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Mail className="h-4 w-4" />
                    {stagiaire.email}
                  </div>
                  {stagiaire.telephone && (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Phone className="h-4 w-4" />
                      {stagiaire.telephone}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Calendar className="h-4 w-4" />
                    Inscrit le {new Date(stagiaire.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                 <Badge variant="outline" className={`px-4 py-1 text-sm font-bold shadow-sm ${getBadgeColor(stats.current_badge)}`}>
                    <Trophy className="h-3.5 w-3.5 mr-2" />
                    {stats.current_badge}
                 </Badge>
                 <span className="text-xs text-muted-foreground">
                   Dernière connexion: {stagiaire.last_login ? new Date(stagiaire.last_login).toLocaleDateString() : 'Jamais'}
                 </span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              icon={Star} 
              label="Points XP" 
              value={stats.total_points} 
              subtext="Total accumulé"
              color="text-yellow-500"
              bg="bg-yellow-500/10"
            />
            <StatCard 
              icon={BookOpen} 
              label="Formations" 
              value={`${stats.formations_completed}/${stats.formations_completed + stats.formations_in_progress}`} 
              subtext="Complétées"
              color="text-blue-500"
              bg="bg-blue-500/10"
            />
            <StatCard 
              icon={Activity} 
              label="Quiz Joués" 
              value={stats.quizzes_completed} 
              subtext={`Moyenne: ${stats.average_score}%`}
              color="text-green-500"
              bg="bg-green-500/10"
            />
            <StatCard 
              icon={Clock} 
              label="Temps d'apprentissage" 
              value={`${Math.round(stats.total_time_minutes / 60)}h ${stats.total_time_minutes % 60}m`} 
              subtext="Total estimé"
              color="text-purple-500"
              bg="bg-purple-500/10"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formations List */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-brand-primary" />
                Parcours de formation
              </h2>
              <div className="grid gap-4">
                {formations.length === 0 ? (
                  <Card className="p-8 text-center text-muted-foreground">
                    Aucune formation assignée
                  </Card>
                ) : (
                  formations.map((formation) => (
                    <Card key={formation.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="p-4 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-brand-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-semibold">{formation.title}</h3>
                            <Badge variant={formation.progress === 100 ? "default" : "secondary"}>
                              {formation.progress === 100 ? "Terminée" : "En cours"}
                            </Badge>
                          </div>
                          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-brand-primary h-full transition-all duration-500" 
                              style={{ width: `${formation.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Activity className="h-5 w-5 text-brand-primary" />
                Derniers Quiz
              </h2>
              <Card>
                <CardContent className="p-0">
                  {quiz_history.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      Aucune activité récente
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {quiz_history.slice(0, 5).map((quiz, i) => (
                        <div key={i} className="p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-sm truncate max-w-[150px]" title={quiz.title}>
                              {quiz.title}
                            </span>
                            <span className={`text-sm font-bold ${
                              quiz.score >= 80 ? 'text-green-600' : 
                              quiz.score >= 50 ? 'text-orange-500' : 'text-red-500'
                            }`}>
                              {quiz.score}%
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground flex justify-between">
                            <span>{quiz.category}</span>
                            <span>{new Date(quiz.completed_at).toLocaleDateString()}</span>
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
      </div>
    </Layout>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtext: string;
  color: string;
  bg: string;
}

function StatCard({ icon: Icon, label, value, subtext, color, bg }: StatCardProps) {

  return (
    <Card className="border-border shadow-sm hover:shadow-md transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
            <h3 className="text-2xl font-bold text-foreground">{value}</h3>
            <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
          </div>
          <div className={`p-3 rounded-xl ${bg}`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
