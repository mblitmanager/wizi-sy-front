// components/ClassementSection.tsx
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ParrainageSection from "./ParrainageSection";

export default function ClassementSection() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <ParrainageSection />

      <Link to="/profile#parrainage" className="block">
        <Card className="h-full hover:bg-accent transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Voir mes filleuls</h3>
                <p className="text-sm text-muted-foreground">
                  Consultez votre programme de parrainage complet
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Classement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((rank) => (
              <div key={rank} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-bold">{rank}.</span>
                  <span>Stagiaire {rank}</span>
                </div>
                <span className="text-primary">{1000 - rank * 50} pts</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
