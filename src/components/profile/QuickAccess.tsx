import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Brain, PlayCircle, Trophy } from "lucide-react";

interface Quiz {
  id: string;
  title: string;
  category: string;
  isDemo?: boolean;
}

interface QuickAccessProps {
  recentQuizzes: Quiz[];
  demoQuizzes: Quiz[];
  totalScore: number;
  rank: number;
}

const QuickAccess = ({ recentQuizzes, demoQuizzes, totalScore, rank }: QuickAccessProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Quiz récents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div>
                  <h3 className="font-medium">{quiz.title}</h3>
                  <p className="text-sm text-muted-foreground">{quiz.category}</p>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link to={`/quiz/${quiz.id}`}>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Reprendre
                  </Link>
                </Button>
              </div>
            ))}
            <Button asChild className="w-full">
              <Link to="/quiz">Voir tous les quiz</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Classement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <p className="text-2xl font-bold text-primary">{totalScore}</p>
              <p className="text-sm text-muted-foreground">Points totaux</p>
            </div>
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <p className="text-2xl font-bold text-primary">#{rank}</p>
              <p className="text-sm text-muted-foreground">Rang</p>
            </div>
            <Button asChild className="w-full">
              <Link to="/classement">Voir le classement complet</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="h-5 w-5" />
            Quiz démos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {demoQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
              >
                <h3 className="font-medium mb-2">{quiz.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{quiz.category}</p>
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/quiz/${quiz.id}`}>Essayer</Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickAccess; 