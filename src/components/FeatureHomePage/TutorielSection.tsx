// components/TutorielSection.tsx
import { Link } from "react-router-dom";
import { ChevronRight, Play } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Tutoriel {
  id: number;
  title: string;
  thumbnail: string;
  duration: string;
}

export default function TutorielSection({
  tutoriels,
}: {
  tutoriels: Tutoriel[];
}) {
  return (
    <div className="mb-8 p-4 bg-card rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-yellow-400">
          Tutoriels et astuces
        </h2>
        <Link to="/tutoriels">
          <Button className="text-blue-400" variant="ghost" size="sm">
            Voir tous <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {tutoriels.map((tutoriel) => (
          <Card key={tutoriel.id} className="overflow-hidden">
            <div className="h-32 bg-muted relative">
              <img
                src={tutoriel.thumbnail}
                alt={tutoriel.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center">
                  <Play className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="absolute bottom-0 right-0 bg-black/50 text-white p-1 text-xs">
                {tutoriel.duration}
              </div>
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">{tutoriel.title}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
