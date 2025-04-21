import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle2, Clock } from "lucide-react";

interface Formation {
  id: string;
  title: string;
  progress: number;
  startDate: string;
  endDate?: string;
  status: 'current' | 'completed';
}

interface CurrentFormationProps {
  currentFormation?: Formation;
  completedFormations: Formation[];
}

const CurrentFormation = ({ currentFormation, completedFormations }: CurrentFormationProps) => {
  return (
    <div className="space-y-6">
      {currentFormation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Formation en cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">{currentFormation.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Du {new Date(currentFormation.startDate).toLocaleDateString()} au{" "}
                  {currentFormation.endDate
                    ? new Date(currentFormation.endDate).toLocaleDateString()
                    : "en cours"}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progression</span>
                  <span>{currentFormation.progress}%</span>
                </div>
                <Progress value={currentFormation.progress} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {completedFormations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Formations terminées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedFormations.map((formation) => (
                <div
                  key={formation.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                >
                  <div>
                    <h3 className="font-medium">{formation.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(formation.startDate).toLocaleDateString()} -{" "}
                      {new Date(formation.endDate!).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Terminée</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!currentFormation && completedFormations.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Aucune formation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Vous n'avez pas encore commencé de formation. Découvrez notre catalogue pour
              trouver la formation qui vous correspond !
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CurrentFormation; 