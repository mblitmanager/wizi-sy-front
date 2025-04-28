
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Brain, PlayCircle, Trophy } from "lucide-react";
import { motion } from "framer-motion";

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
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Quiz récents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentQuizzes.map((quiz, index) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
              >
                <div>
                  <h3 className="font-medium">{quiz.title}</h3>
                  <p className="text-sm text-muted-foreground">{quiz.category}</p>
                </div>
                <Button asChild variant="ghost" size="sm" className="hover:scale-105 transition-transform">
                  <Link to={`/quiz/${quiz.id}`}>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Reprendre
                  </Link>
                </Button>
              </motion.div>
            ))}
            <Button asChild className="w-full hover:scale-105 transition-transform">
              <Link to="/quiz">Voir tous les quiz</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Classement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center p-4 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <p className="text-2xl font-bold text-primary">{totalScore}</p>
              <p className="text-sm text-muted-foreground">Points totaux</p>
            </motion.div>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="text-center p-4 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <p className="text-2xl font-bold text-primary">#{rank}</p>
              <p className="text-sm text-muted-foreground">Rang</p>
            </motion.div>
            <Button asChild className="w-full hover:scale-105 transition-transform">
              <Link to="/classement">Voir le classement complet</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="h-5 w-5" />
            Quiz démos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {demoQuizzes.map((quiz, index) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
              >
                <h3 className="font-medium mb-2">{quiz.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{quiz.category}</p>
                <Button asChild variant="outline" className="w-full hover:scale-105 transition-transform">
                  <Link to={`/quiz/${quiz.id}`}>Essayer</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickAccess;
