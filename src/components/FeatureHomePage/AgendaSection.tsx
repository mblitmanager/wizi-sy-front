// components/AgendaSection.tsx
import { Link } from "react-router-dom";
import { Calendar, ChevronRight, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AgendaSection() {
  return (
    <div className="mb-8 p-4 bg-card rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-yellow-400">Agenda</h2>
        <Link to="/agenda">
          <Button variant="ghost" size="sm">
            Voir l'agenda complet <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Prochains cours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((event) => (
              <div
                key={event}
                className="flex items-start p-2 rounded bg-muted/50">
                <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center mr-3">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Cours de Word</p>
                  <p className="text-xs text-muted-foreground">
                    Aujourd'hui, 14h00 - 16h00
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Formateur: John Doe
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
