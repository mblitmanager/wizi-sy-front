import { Layout } from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/hooks/useAuth";
import { Calendar, RefreshCw, ExternalLink, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { googleCalendarService } from "@/services/googleCalendarService";
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
}

const API_URL = import.meta.env.VITE_API_URL;

export default function AgendaPage() {
  const { user } = useUser();
  const { toast } = useToast();

  const { data: agendaEventsData, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["agenda", "events", "full"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/agendas`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = (await response.json()) as { member?: AgendaBackendEvent[] };
      return data.member || [];
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

  const handleSync = async () => {
    try {
      const isAdmin = user?.role === 'admin' || user?.role === 'administrateur';
      
      toast({
        title: "Synchronisation en cours",
        description: isAdmin ? "Lancement de la synchronisation globale..." : "Connexion à Google Calendar...",
      });

      if (isAdmin) {
        // Option 1: Global sync (no auth code needed if refresh tokens exist)
        // Option 2: Connect account (if they pass an auth code)
        // For simplicity, if they click "Sync", we try global sync first.
        // If they want to CONNECT, we might need requestAuthCode.
        
        // Let's try global sync first
        const token = localStorage.getItem("token");
        await axios.post(`${API_URL}/agendas/sync`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Non-admins shouldn't really see the button based on user request "seul l'admin fait la synchronisation"
        // But if they do, we can't let them sync everything.
        throw new Error("Seul l'administrateur peut lancer la synchronisation.");
      }

      await refetch();
      toast({
        title: "Succès",
        description: "L'agenda a été synchronisé.",
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "La synchronisation a échoué.";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
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
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Agenda Google</h1>
            </div>
            <p className="text-muted-foreground font-medium">
              Gérez vos séances et événements synchronisés avec votre compte Google.
            </p>
          </div>
          
          {(user?.role === 'admin' || user?.role === 'administrateur') && (
            <Button 
              onClick={handleSync} 
              disabled={isFetching}
              className="bg-brand-primary hover:bg-brand-primary/90 text-white font-bold shadow-lg shadow-brand-primary/20 transition-all active:scale-95"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              {isFetching ? "Synchronisation..." : "Synchroniser maintenant"}
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
                <Card className="overflow-hidden hover:shadow-md transition-all border-l-4 border-l-blue-500 group">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Date Block */}
                      <div className="md:w-48 bg-slate-50 p-6 flex flex-col items-center justify-center border-r">
                        <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">
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
                                <Clock className="h-4 w-4 text-blue-500" />
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
                            <Button variant="ghost" size="icon" asChild className="hover:bg-blue-50 text-blue-600">
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
