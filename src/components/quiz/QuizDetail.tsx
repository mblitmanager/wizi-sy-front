import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { quizManagementService } from "@/services/quiz/QuizManagementService";
import type { Quiz } from "@/types/quiz";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  Loader2,
  Award,
  BookOpen,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Layout } from "../layout/Layout";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useToast } from "@/hooks/use-toast";

export function QuizDetail() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    data: quiz,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => quizManagementService.getQuizById(quizId!),
    enabled: !!quizId && !!localStorage.getItem("token"),
    retry: 1,
    meta: {
      onError: () => {
        toast({
          title: "Erreur",
          description: "Impossible de charger ce quiz. Veuillez réessayer.",
          variant: "destructive",
        });
      },
    },
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
              Une erreur est survenue lors du chargement du quiz. Veuillez
              réessayer plus tard.
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
            <Button onClick={() => navigate("/quizzes")} variant="outline">
              Retourner à la liste des quiz
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Card className="overflow-hidden shadow-lg border-0 w-full max-w-3xl mx-auto">
          <div className="relative bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 p-2 rounded-t-xl">
            <CardHeader className="text-white">
              <CardTitle className="text-2xl font-bold">{quiz.titre}</CardTitle>
              <CardDescription className="text-lg opacity-90">
                {quiz.description}
              </CardDescription>
            </CardHeader>
          </div>
          <CardContent className="p-6 bg-white rounded-b-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Badge
                    variant="outline"
                    className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    {quiz.niveau}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-sm bg-green-100 text-green-600 px-3 py-1 rounded-full flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    {quiz.points} pts
                  </Badge>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-700 mb-2">
                    Nombre de Questions
                  </h3>
                  <p className="text-sm text-gray-500">
                    {quiz.questions?.length || 0} question
                    {(quiz.questions?.length || 0) > 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300"
                  onClick={() => {
                    if (!quiz.id) {
                      console.error("Quiz ID is undefined:", quiz);
                      toast({
                        title: "Erreur",
                        description:
                          "Impossible de démarrer le quiz. ID manquant.",
                        variant: "destructive",
                      });
                      return;
                    }
                    navigate(`/quiz/${quiz.id}/start`);
                  }}>
                  <span className="flex items-center gap-2">
                    <span>Commencer le quiz</span>
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
