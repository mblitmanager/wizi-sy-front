import React, { useEffect, useState } from "react";
import { 
  Bell, 
  Calendar, 
  Clock, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  History,
  Info,
  ChevronLeft,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AutoReminderService, { ReminderStats, ReminderHistoryItem, TargetedUser } from "@/services/AutoReminderService";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

const AutoReminderMonitoring: React.FC = () => {
  const [stats, setStats] = useState<ReminderStats | null>(null);
  const [history, setHistory] = useState<ReminderHistoryItem[]>([]);
  const [targeted, setTargeted] = useState<TargetedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTargeted, setLoadingTargeted] = useState(false);
  const [runningManual, setRunningManual] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  const loadData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [statsData, historyData] = await Promise.all([
        AutoReminderService.getStats(),
        AutoReminderService.getHistory(page)
      ]);
      setStats(statsData);
      setHistory(historyData.data);
      setTotalPages(historyData.last_page);
    } catch (error) {
      console.error("Failed to load reminder data", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de monitoring.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [page, toast]);

  useEffect(() => {
    loadData();
  }, [page, loadData]);

  const loadTargeted = async () => {
    try {
      setLoadingTargeted(true);
      const data = await AutoReminderService.getTargeted();
      setTargeted(data);
    } catch (error) {
      console.error("Failed to load targeted users", error);
    } finally {
      setLoadingTargeted(false);
    }
  };

  const handleRunManual = async () => {
    try {
      setRunningManual(true);
      const response = await AutoReminderService.runManualReminders();
      toast({
        title: "Succès",
        description: response.message || "Rappels déclenchés manuellement.",
      });
      loadData(); // Refresh stats after run
      if (targeted.length > 0) loadTargeted();
    } catch (error: unknown) {
      console.error("Failed to run manual reminders", error);
      const errorMessage = error instanceof Error ? error.message : "Erreur lors du déclenchement des rappels.";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setRunningManual(false);
    }
  };

  if (!stats && loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Monitoring des Rappels Automatiques</h2>
          <p className="text-muted-foreground">
            Suivi des notifications envoyées automatiquement par le système.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-full border border-border shadow-sm">
            <Clock size={14} className="text-primary" />
            <span className="text-xs font-medium">
              Prochain passage : {stats?.last_run ? format(new Date(stats.last_run), "HH:00", { locale: fr }) : "--:--"}
            </span>
          </div>
          <Button 
            variant="default" 
            size="sm" 
            className="rounded-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 gap-2"
            onClick={handleRunManual}
            disabled={runningManual}
          >
            {runningManual ? (
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
            ) : (
              <BellRing size={14} />
            )}
            Déclencher maintenant
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Recent Sends Card */}
        <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Envoyés (24h)</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.values(stats?.recent_sends || {}).reduce((a, b: number) => a + b, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Notifications distribuées aujourd'hui
            </p>
          </CardContent>
        </Card>

        {/* Formation Reminders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rappels Formation</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Début J-7/4/1</span>
                <span className="font-bold">
                  {(stats?.formation["j-7"] || 0) + (stats?.formation["j-4"] || 0) + (stats?.formation["j-1"] || 0)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-orange-400">
                <span>Fin J-3</span>
                <span className="font-bold">{stats?.formation["end-j-3"] || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inactivity Reminders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inactivité Quiz</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>7 jours</span>
                <span className="font-bold">{stats?.inactivity["7d"] || 0}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>30 jours</span>
                <span className="font-bold">{stats?.inactivity["30d"] || 0}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>3 mois</span>
                <span className="font-bold">{stats?.inactivity["90d"] || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* First Quiz Reminders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Jamais joués</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>J+1 après login</span>
                <span className="font-bold">{stats?.no_quiz["1d"] || 0}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>J+3 après login</span>
                <span className="font-bold">{stats?.no_quiz["3d"] || 0}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>J+7 après login</span>
                <span className="font-bold">{stats?.no_quiz["7d"] || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="history" className="w-full">
        <TabsList className="bg-background/50 border border-border shadow-sm overflow-x-auto h-auto p-1 flex-wrap sm:flex-nowrap">
          <TabsTrigger value="history" className="flex items-center gap-2 px-6">
            <History size={16} /> Historique
          </TabsTrigger>
          <TabsTrigger value="targeted" onClick={() => targeted.length === 0 && loadTargeted()} className="flex items-center gap-2 px-6">
            <Users size={16} /> Destinataires Cibles
          </TabsTrigger>
          <TabsTrigger value="info" className="flex items-center gap-2 px-6">
            <Info size={16} /> Fonctionnement
          </TabsTrigger>
        </TabsList>
        <TabsContent value="history" className="mt-4 animate-in fade-in duration-300">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Dernières notifications envoyées</CardTitle>
                <CardDescription>
                  Liste des {history.length} derniers rappels distribués automatiquement.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft size={16} />
                </Button>
                <div className="flex items-center px-2 text-sm font-medium">
                  Page {page} / {totalPages}
                </div>
                <Button 
                  variant="outline" 
                   size="icon" 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : history.length > 0 ? (
                  <div className="grid gap-3">
                    {history.map((item) => (
                      <div key={item.id} className="flex items-start gap-4 p-3 rounded-xl border border-border/50 bg-card/30 hover:bg-muted/30 transition-all group shadow-sm">
                        <div className={`p-2.5 rounded-full shadow-sm group-hover:scale-110 transition-transform ${
                          item.type === 'formation' || item.type === 'formation_end' ? 'bg-orange-100 text-orange-600' :
                          item.type === 'inactivity_quiz' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          <Bell size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold truncate text-foreground/90">{item.user?.name || "Utilisateur inconnu"}</p>
                            <Badge variant="outline" className={`text-[10px] shrink-0 border-primary/20 ${
                              item.type === 'formation' || item.type === 'formation_end' ? 'text-orange-500 bg-orange-500/5' :
                              item.type === 'inactivity_quiz' ? 'text-yellow-500 bg-yellow-500/5' :
                              'text-blue-500 bg-blue-500/5'
                            }`}>
                              {item.type === 'formation' ? 'Lancement Formation' : 
                               item.type === 'formation_end' ? 'Fin Formation' :
                               item.type === 'inactivity_quiz' ? 'Inactivité Quiz' : 
                               'Nouveau Stagiaire'}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-1 leading-relaxed">{item.message}</p>
                          <div className="flex items-center gap-3 mt-2">
                             <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                                <Clock size={10} />
                                {format(new Date(item.created_at), "d MMM yyyy HH:mm", { locale: fr })}
                             </div>
                             <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                                <Users size={10} />
                                {item.user?.email}
                             </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                    <Bell size={48} className="mb-4 opacity-20" />
                    <p>Aucun rappel envoyé récemment.</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="targeted" className="mt-4 animate-in fade-in duration-300">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Utilisateurs ciblés pour le prochain run</CardTitle>
                <CardDescription>
                  Ces {targeted.length} utilisateurs recevront une notification lors du prochain passage automatique à 08:00.
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={loadTargeted}
                disabled={loadingTargeted}
              >
                {loadingTargeted ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                ) : (
                  <TrendingUp size={14} />
                )}
                Actualiser
              </Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {loadingTargeted ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : targeted.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {targeted.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card/30 hover:bg-muted/30 transition-all shadow-sm">
                        <div className={`p-2 rounded-full ${
                          item.type === 'formation' || item.type === 'formation_end' ? 'bg-orange-100 text-orange-600' :
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          <Users size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate leading-none mb-1">{item.user?.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate mb-1.5">{item.user?.email}</p>
                          <Badge variant="secondary" className="text-[9px] font-bold px-1.5 py-0 h-4 bg-muted text-muted-foreground uppercase tracking-wider">
                            {item.reason}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                    <CheckCircle size={48} className="mb-4 opacity-20 text-primary" />
                    <p>Aucun utilisateur ciblé pour le moment.</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="info" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Comment fonctionnent les rappels ?</CardTitle>
              <CardDescription>
                Détails sur la logique et les seuils de déclenchement des notifications automatiques.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 rounded-lg border bg-muted/30">
                  <h4 className="font-semibold flex items-center gap-2 mb-2">
                    <Calendar size={16} className="text-orange-500" /> Formations
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Envoyé aux stagiaires dont la date de début de formation approche : 7 jours, 4 jours et 1 jour avant.
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-muted/30">
                  <h4 className="font-semibold flex items-center gap-2 mb-2">
                    <AlertTriangle size={16} className="text-yellow-500" /> Inactivité
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Cible les utilisateurs n'ayant pas joué de quiz depuis 7, 30 ou 90 jours (3 mois).
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-muted/30">
                  <h4 className="font-semibold flex items-center gap-2 mb-2">
                    <Users size={16} className="text-blue-500" /> Engagement
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Rappelle aux nouveaux inscrits de lancer leur premier quiz s'ils n'en ont toujours pas fait après 1, 3 ou 7 jours.
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <CheckCircle size={16} className="text-primary" /> Anti-Spam
                </h4>
                <p className="text-xs text-muted-foreground">
                  Le système possède une fenêtre de déduplication pour éviter d'envoyer trop de notifications au même utilisateur dans un intervalle court.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutoReminderMonitoring;
