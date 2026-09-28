import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/hooks/useAuth";
import { Calendar, RefreshCw, ExternalLink, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api, unwrapList } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";

interface AgendaBackendEvent {
  id: string | number;
  titre?: string;
  summary?: string;
  date_debut?: string;
  start?: string;
  date_fin?: string;
  end?: string;
  location?: string;
  description?: string;
  htmlLink?: string;
  html_link?: string;
}

export default function AgendaPage() {
  const { role } = useUser();
  const { toast } = useToast();

  const { data: agendaEventsData, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["agenda", "events", "full"],
    queryFn: async () => {
      const res = await api.get("/agendas");
      return unwrapList<AgendaBackendEvent>(res.data);
    },
  });

  const agendaEvents = (agendaEventsData || []).map((e: AgendaBackendEvent) => ({
    id: e.id.toString(),
    title: e.titre || e.summary || "Sans titre",
    start: new Date(e.date_debut || e.start || new Date().toISOString()),
    end: new Date(e.date_fin || e.end || new Date().toISOString()),
    location: e.location,
    description: e.description,
    htmlLink: e.htmlLink || e.html_link,
  }));

  // Seul l'administrateur voit le bouton : la synchronisation est globale
  const [isSyncing, setIsSyncing] = useState(false);
  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await api.post("/agendas/sync");
      await refetch();
      toast({ title: "Succès", description: "L'agenda a été synchronisé." });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || error.message || "La synchronisation a échoué.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const formatDate = (date: Date) => format(date, "EEEE d MMMM yyyy", { locale: fr });
  const formatTime = (date: Date) => format(date, "HH:mm");

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent rounded-lg">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Agenda Google</h1>
            </div>
            <p className="text-muted-foreground font-medium">
              Gérez vos séances et événements synchronisés avec votre compte Google.
            </p>
          </div>
          
          {(role === "admin") && (
            <Button 
              onClick={handleSync} 
              disabled={isSyncing || isFetching}
              className="bg-brand-primary hover:bg-brand-primary/90 text-white font-bold shadow-lg shadow-brand-primary/20 transition-all active:scale-95"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing || isFetching ? "animate-spin" : ""}`} />
              {isSyncing ? "Synchronisation..." : "Synchroniser maintenant"}
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
            <p className="text-slate-500 font-medium">Chargement de votre agenda...</p>
          </div>
        ) : agendaEvents.length === 0 ? (
          <Card className="border-dashed h-64 flex flex-col items-center justify-center text-center p-8">
            <div className="p-4 bg-slate-50 rounded-full mb-4">
              <Calendar className="h-10 w-10 text-slate-300" />
            </div>
            <CardTitle className="text-xl text-slate-400">Aucun événement trouvé</CardTitle>
            <p className="text-slate-400 mt-2 max-w-sm">
              Synchronisez votre compte pour voir vos événements Google Calendar apparaître ici.
            </p>
          </Card>
        ) : (
          <div className="grid gap-6">
            {agendaEvents.sort((a, b) => a.start.getTime() - b.start.getTime()).map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden hover:shadow-md transition-all border-l-4 border-l-primary group">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Date Block */}
                      <div className="md:w-48 bg-slate-50 p-6 flex flex-col items-center justify-center border-r">
                        <span className="text-sm font-bold text-primary uppercase tracking-wider">
                          {format(event.start, "MMM", { locale: fr })}
                        </span>
                        <span className="text-4xl font-black text-slate-800">
                          {format(event.start, "d")}
                        </span>
                        <span className="text-sm font-medium text-slate-500">
                          {format(event.start, "yyyy")}
                        </span>
                      </div>

                      {/* Content Block */}
                      <div className="flex-1 p-6 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-primary transition-colors">
                              {event.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                              <div className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4 text-gold-deep" />
                                <span>{formatTime(event.start)} - {formatTime(event.end)}</span>
                              </div>
                              {event.location && (
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="h-4 w-4 text-red-500" />
                                  <span>{event.location}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {event.htmlLink && (
                            <Button variant="ghost" size="icon" asChild className="hover:bg-accent text-primary">
                              <a href={event.htmlLink} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-5 w-5" />
                              </a>
                            </Button>
                          )}
                        </div>

                        {event.description && (
                          <p className="text-slate-600 text-sm leading-relaxed border-t pt-4">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
