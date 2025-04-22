
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { quizService } from '@/services/QuizService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Loader2, Award, BookOpen, AlertCircle } from 'lucide-react';
import { Layout } from '../layout/Layout';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useToast } from "@/hooks/use-toast";

export function QuizDetail() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: quiz, isLoading, error } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => quizService.getQuizById(quizId!),
    enabled: !!quizId && !!localStorage.getItem('token'),
    retry: 1,
    onSettled: (_, error) => {
      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger ce quiz. Veuillez réessayer.",
          variant: "destructive"
        });
      }
    }
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>
              Une erreur est survenue lors du chargement du quiz. Veuillez réessayer plus tard.
            </AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  if (!quiz) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Quiz non trouvé</AlertTitle>
            <AlertDescription>
              Le quiz que vous recherchez n'existe pas ou n'est pas accessible.
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex justify-center">
            <Button 
              onClick={() => navigate('/quizzes')}
              variant="outline"
            >
              Retourner à la liste des quiz
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{quiz.titre}</CardTitle>
            <CardDescription>{quiz.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Badge variant="outline" className="text-sm">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {quiz.niveau}
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    <Award className="w-4 h-4 mr-2" />
                    {quiz.points} pts
                  </Badge>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Questions</h3>
                  <p className="text-sm text-gray-500">
                    {quiz.questions?.length || 0} question{(quiz.questions?.length || 0) > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <Button 
                  size="lg"
                  onClick={() => navigate(`/quiz/${quiz.id}/start`)}
                >
                  Commencer le quiz
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
