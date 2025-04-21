
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { User } from "@/types";

interface ProgressCardProps {
  user: User;
}

export function ProgressCard({ user }: ProgressCardProps) {
  if (!user.progress) return null;

  const { level, streak, totalPoints, completedQuizzes } = user.progress;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mon Niveau</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Niveau {level}</span>
              <span className="text-sm font-medium">{totalPoints} points</span>
            </div>
            <Progress value={25} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-muted p-3">
              <div className="font-semibold">{completedQuizzes}</div>
              <div className="text-xs text-muted-foreground">Quiz Complétés</div>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <div className="font-semibold">{streak} jours</div>
              <div className="text-xs text-muted-foreground">Série Actuelle</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
