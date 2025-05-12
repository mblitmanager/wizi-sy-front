import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { quizManagementService } from "@/services/quiz/QuizManagementService";
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
import quizimg from "../../assets/quiz_2.png";
import { stripHtmlTags } from "@/utils/UtilsFunction";
import quiziload from "../../assets/loading_img.png";

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
          <div className="container mx-auto py-8 px-4">
            <div className="flex items-center justify-center flex-col gap-4">
              <img src={quiziload} alt="Chargement" className="h-16 w-16" />
              <h1 className="text-2xl font-bold">
                Chargement des résultats...
              </h1>
            </div>
          </div>
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
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
          {/* Illustration */}
          <div className="w-full md:w-1/2 bg-white relative flex items-center justify-center p-2">
            <img
              src={quizimg}
              alt="Quiz Illustration"
              className="w-72 h-72 md:w-80 md:h-80 object-contain drop-shadow-2xl animate-bounce-slow"
            />
          </div>

          {/* Info Quiz */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {quiz.titre}
              </h2>
              <span className="text-md text-gray-500 mb-6 block">
                {stripHtmlTags(quiz.description)}
              </span>

              <div className="flex flex-wrap gap-3 mb-6">
                <Badge className="bg-blue-100 text-blue-600">
                  <BookOpen className="w-4 h-4 mr-1" />
                  {quiz.niveau}
                </Badge>
                <Badge className="bg-green-100 text-green-600">
                  <Award className="w-4 h-4 mr-1" />
                  {quiz.points} pts
                </Badge>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">
                  Nombre de questions
                </p>
                <p className="text-sm text-gray-500">
                  {quiz.questions?.length || 0} question
                  {(quiz.questions?.length || 0) > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Button */}
            <div className="mt-8 text-right">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                onClick={() => {
                  if (!quiz.id) {
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
                  Commencer le quiz <ArrowRight className="w-5 h-5" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
