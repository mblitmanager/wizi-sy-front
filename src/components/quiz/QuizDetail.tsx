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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br  px-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row">
          {/* Illustration */}
          <div className="w-full md:w-1/2 bg-white relative flex flex-col items-center justify-center p-4">
            <img
              src={quizimg}
              alt="Quiz Illustration"
              className="w-96 h-96 md:w-80 md:h-80 object-contain drop-shadow-xl animate-bounce-slow mb-4"
            />
            <p className="text-center text-lg text-gray-600 px-4">
              🌟 Testez vos connaissances et débloquez des récompenses ! 🌟
            </p>
            <p className="text-center text-sm text-gray-500 mt-2">
              Chaque quiz est une aventure : prêt(e) à relever le défi ?
            </p>
          </div>

          {/* Info Quiz */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-between bg-gradient-to-tr from-white via-blue-50 to-indigo-100">
            <div>
              <h2 className="text-3xl font-extrabold text-indigo-700 mb-2 flex items-center gap-2">
                <BookOpen className="w-7 h-7 text-indigo-500" />
                {quiz.titre}
              </h2>
              <span className="text-md text-gray-600 mb-6 block">
                {stripHtmlTags(quiz.description)}
              </span>

              <div className="flex flex-wrap gap-3 mb-6">
                <Badge className="bg-blue-100 text-blue-600">
                  <BookOpen className="w-4 h-4 mr-1" />
                  Niveau : {quiz.niveau}
                </Badge>
                <Badge className="bg-green-100 text-green-600">
                  <Award className="w-4 h-4 mr-1" />
                  {quiz.points} pts à gagner
                </Badge>
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Nombre de questions :
                </p>
                <p className="text-sm text-gray-600">
                  {quiz.questions?.length || 0} question
                  {(quiz.questions?.length || 0) > 1 ? "s" : ""}
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <p className="text-sm text-gray-700 mb-1">
                  🎯 Objectif : Obtenez le meilleur score possible !
                </p>
                <p className="text-sm text-gray-500">
                  Astuce : Répondez vite et avec précision pour maximiser vos
                  points.
                </p>
              </div>
            </div>

            {/* Button */}
            <div className="mt-8 text-right">
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-6 py-3 rounded-xl shadow-md hover:scale-105 hover:shadow-xl transition-transform duration-300"
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
                }}
              >
                <span className="flex items-center gap-2 font-semibold">
                  Lancer le défi <ArrowRight className="w-5 h-5" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
