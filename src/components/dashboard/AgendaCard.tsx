
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgendaEvent } from "@/types";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";

interface AgendaCardProps {
  events: AgendaEvent[];
}

export function AgendaCard({ events }: AgendaCardProps) {
  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());

  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get only upcoming events
  const upcomingEvents = sortedEvents.filter(event => event.start >= today);

  // Format date and time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.getDate() === now.getDate() && 
        date.getMonth() === now.getMonth() && 
        date.getFullYear() === now.getFullYear()) {
      return 'Aujourd\'hui';
    } else if (date.getDate() === tomorrow.getDate() && 
               date.getMonth() === tomorrow.getMonth() && 
               date.getFullYear() === tomorrow.getFullYear()) {
      return 'Demain';
    } else {
      return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agenda</CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingEvents.length > 0 ? (
          <div className="space-y-4">
            {upcomingEvents.slice(0, 3).map((event) => (
              <div key={event.id} className="border-l-4 border-bureautique pl-4 py-1">
                <p className="text-sm text-muted-foreground">{formatDate(event.start)}</p>
                <h4 className="font-medium">{event.title}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{formatTime(event.start)} - {formatTime(event.end)}</span>
                  {event.location && <span>• {event.location}</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Aucun événement à venir</p>
          </div>
        )}
        <div className="mt-4">
          <Link
            to="/agenda"
            className="text-sm text-primary hover:underline block text-center"
          >
            Voir l'agenda complet
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
