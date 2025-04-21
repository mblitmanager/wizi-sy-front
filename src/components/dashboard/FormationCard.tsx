
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Formation } from "@/types";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface FormationCardProps {
  formation: Formation;
}

export function FormationCard({ formation }: FormationCardProps) {
  const progress = formation.totalQuizzes 
    ? Math.round((formation.completedQuizzes / formation.totalQuizzes) * 100) 
    : 0;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-40 overflow-hidden">
        <img 
          src={formation.image || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"} 
          alt={formation.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <CardTitle className="text-white text-xl">{formation.name}</CardTitle>
        </div>
      </div>
      <CardContent className="p-4">
        <p className="text-sm text-gray-600 mb-4">{formation.description}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progression</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link to={`/formations/${formation.slug}`} className="w-full">
          <Button className="w-full">
            {progress > 0 ? "Continuer" : "Commencer"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
