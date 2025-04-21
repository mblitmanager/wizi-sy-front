import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { quizService } from "@/services/QuizService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, BookOpen, Clock, Award } from "lucide-react";

export function QuizList() {
  const { data: formations, isLoading, error } = useQuery({
    queryKey: ["formations"],
    queryFn: () => quizService.getStagiaireFormations()
  });

  // Extraire tous les quiz de toutes les formations
  const quizzes = formations?.flatMap(formation => 
    formation.quizzes.map(quiz => ({
      ...quiz,
      formation: {
        titre: formation.titre,
        categorie: formation.categorie
      }
    }))
  ) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-red-500">Erreur lors du chargement des quiz</p>
      </div>
    );
  }

  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p>Aucun quiz disponible pour le moment</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quizzes.map((quiz) => (
        <Link key={quiz.id} to={`/quiz/${quiz.id}`}>
          <Card className="h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{quiz.titre}</CardTitle>
              <CardDescription>{quiz.description}</CardDescription>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="secondary">{quiz.formation.categorie}</Badge>
                <Badge variant="outline">{quiz.formation.titre}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="text-sm">
                  <BookOpen className="w-4 h-4 mr-2" />
                  {quiz.niveau}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  <Clock className="w-4 h-4 mr-2" />
                  {quiz.duree} min
                </Badge>
                <Badge variant="outline" className="text-sm">
                  <Award className="w-4 h-4 mr-2" />
                  {quiz.nb_points_total} pts
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  {quiz.questions.length} question{quiz.questions.length > 1 ? 's' : ''}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
} 