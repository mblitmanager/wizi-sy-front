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
import HeaderSection from "../features/HeaderSection";
import { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

// Importez le CSS de Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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

  // Ajout de l'état pour le carrousel interactif (mobile et desktop)
  const [currentTypeIdx, setCurrentTypeIdx] = React.useState(0);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="container mx-auto py-8 px-4">
            <div className="flex items-center justify-center flex-col gap-4">
              <span className="text-gray-600">Chargement des quizes...</span>
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

  // Définir les types selon le niveau (carrousel interactif)
  const types = [
    ...(quiz.niveau === "débutant" || quiz.niveau === "intermédiaire" || quiz.niveau === "avancé"
      ? [
          {
            icon: <BookOpen className="w-8 h-8 text-blue-500 mb-2" />,
            title: "QCM",
            desc: "Choisissez la ou les bonnes réponses parmi plusieurs propositions.",
            bg: "bg-blue-50 border-blue-200",
          },
          {
            icon: <Award className="w-8 h-8 text-green-500 mb-2" />,
            title: "Vrai / Faux",
            desc: "Indiquez si l'affirmation est vraie ou fausse.",
            bg: "bg-green-50 border-green-200",
          },
          {
            icon: <span className="w-8 h-8 mb-2 text-yellow-500">🔊</span>,
            title: "Audio",
            desc: "Écoutez l'extrait audio et sélectionnez la bonne réponse.",
            bg: "bg-yellow-50 border-yellow-200",
          },
        ]
      : []),
    ...(quiz.niveau === "intermédiaire" || quiz.niveau === "avancé"
      ? [
          {
            icon: <span className="w-8 h-8 mb-2 text-purple-500">🔀</span>,
            title: "Réarrangement",
            desc: "Remettez dans l'ordre.",
            bg: "bg-purple-50 border-purple-200",
          },
          {
            icon: <span className="w-8 h-8 mb-2 text-pink-500">🔗</span>,
            title: "Matching",
            desc: "Associez les éléments.",
            bg: "bg-pink-50 border-pink-200",
          },
        ]
      : []),
    ...(quiz.niveau === "avancé"
      ? [
          {
            icon: <span className="w-8 h-8 mb-2 text-indigo-500">✍️</span>,
            title: "Champ vide",
            desc: "Complétez la phrase.",
            bg: "bg-indigo-50 border-indigo-200",
          },
          {
            icon: <span className="w-8 h-8 mb-2 text-gray-500">✨</span>,
            title: "Autres",
            desc: "Questions spéciales.",
            bg: "bg-gray-50 border-gray-200",
          },
        ]
      : []),
  ];

  // Animation automatique du carrousel toutes les 3 secondes (hook toujours appelé)
  React.useEffect(() => {
    if (types.length < 2) return;
    const interval = setInterval(() => {
      setCurrentTypeIdx((prev) => (prev + 1) % types.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [types.length]);

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen px-2 sm:px-4 py-4 sm:py-0 mt-0 md:mt-[-5%]">
  <div className="max-w-5xl w-full flex flex-col md:flex-row" style={{ marginTop: '-15%' }}>
          {/* Carrousel interactif des types de questions (responsive web) */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-2 sm:p-4 mb-6">
            {types.length > 0 && (
              <div
                className={`w-full max-w-xs md:max-w-md lg:max-w-lg mx-auto flex flex-col items-center transition-all duration-200 mb-4`}
                style={{ minHeight: 0, background: 'none', boxShadow: 'none', border: 'none', borderRadius: 0 }}>
                {types[currentTypeIdx].icon}
                <span className="font-semibold text-lg md:text-xl mb-2 text-center">
                  {types[currentTypeIdx].title}
                </span>
                <span className="text-sm md:text-base text-gray-600 text-center mb-2">
                  {types[currentTypeIdx].desc}
                </span>
                {types.length > 1 && (
                  <span className="mt-2 text-xs text-gray-400 text-center">
                    {currentTypeIdx + 1} / {types.length} &nbsp;•&nbsp; Changement automatique
                  </span>
                )}
              </div>
            )}
            <p className="text-center text-base md:text-lg text-gray-600 px-2 sm:px-4">
              🌟 Testez vos connaissances et débloquez des récompenses ! 🌟
            </p>
            <p className="text-center text-xs md:text-sm text-gray-500 mt-1 sm:mt-2">
              Chaque quiz est une aventure
            </p>
          </div>

          {/* Info Quiz */}
          <div className="w-full md:w-1/2 p-2 sm:p-4 md:p-8 flex flex-col justify-between bg-gradient-to-tr from-white via-blue-50 to-indigo-100 min-h-[400px]">
            <div>
              <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-indigo-700 mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-indigo-500" />
                {quiz.titre}
              </h2>
              <span className="text-xs sm:text-md text-gray-600 mb-2 sm:mb-4 block">
                {stripHtmlTags(quiz.description)}
              </span>

              <div className="flex flex-wrap gap-2 sm:gap-3 mb-2 sm:mb-4">
                <Badge className="bg-blue-100 text-blue-600 text-xs sm:text-sm py-1 px-2">
                  <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Niveau : {quiz.niveau}
                </Badge>
                <Badge className="bg-green-100 text-green-600 text-xs sm:text-sm py-1 px-2">
                  <Award className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  {quiz.niveau !== "débutant"
                    ? (quiz.questions?.length || 0) > 10
                      ? "20 pts à gagner"
                      : `${(quiz.questions?.length || 0) * 2} pts à gagner`
                    : (quiz.questions?.length || 0) > 5
                    ? "10 pts à gagner"
                    : `${(quiz.questions?.length || 0) * 2} pts à gagner`}
                </Badge>
              </div>

              {/* Bouton mobile */}
              <div className="block md:hidden mb-2 sm:mb-4 text-right">
                <Button
                  size="sm"
                  className="sm:size-lg bg-[#1a237e] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md hover:bg-[#283593] hover:scale-105 hover:shadow-xl transition-transform duration-300"
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
                  <span className="flex items-center gap-1 sm:gap-2 font-semibold text-xs sm:text-base">
                    Lancer le défi{" "}
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
                </Button>
              </div>

              <div className="mb-2 sm:mb-4">
                <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                  Nombre de questions :
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  {quiz.niveau === "débutant" &&
                  (quiz.questions?.length || 0) > 5
                    ? "5 questions"
                    : `${quiz.questions?.length || 0} question${
                        (quiz.questions?.length || 0) > 1 ? "s" : ""
                      }`}
                  {quiz.niveau !== "débutant" &&
                  (quiz.questions?.length || 0) > 10
                    ? "10 questions"
                    : ""}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  ⏱️ Temps imparti :{" "}
                  {quiz.niveau === "débutant" ? "2 min 30 s" : "5 min"} (
                  {quiz.niveau === "débutant" ? "150" : "300"} sec)
                </p>
              </div>

              {/* ...carrousel remplacé par le composant interactif ci-dessus... */}

              {/* Section Tutoriels */}
              {quiz.tutos && quiz.tutos.length > 0 && (
                <div className="mb-2 sm:mb-4">
                  <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    Tutoriels :{" "}
                  </p>
                  {/* Mobile: scrollable, 1 ligne à la fois. Desktop: grid */}
                  <div className="flex md:grid md:grid-cols-2 gap-2 overflow-x-auto hide-scrollbar snap-x snap-mandatory">
                    {quiz.tutos.map((tuto: any, idx: number) => (
                      <div
                        key={idx}
                        className="min-w-[220px] md:min-w-0 bg-white border border-gray-200 rounded-lg p-3 flex flex-col justify-center shadow-sm snap-center md:snap-none md:col-span-1">
                        <span className="font-semibold text-xs text-indigo-700 mb-1 block truncate">
                          {tuto.titre || tuto.title || `Tuto ${idx + 1}`}
                        </span>
                        <span className="text-xs text-gray-600 block truncate">
                          {tuto.description || tuto.desc || ""}
                        </span>
                        {tuto.lien && (
                          <a
                            href={tuto.lien}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 underline mt-1 block truncate">
                            Voir le tutoriel
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white p-2 sm:p-4 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 mt-2">
                <p className="text-xs sm:text-sm text-gray-700 mb-1">
                  💡 Comment jouer&nbsp;:
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Répondez à chaque question dans le temps imparti. Plus vous
                  répondez vite et juste, plus vous marquez de points. Bonne
                  chance&nbsp;!
                </p>
              </div>
            </div>

            {/* Bouton desktop */}
            <div className="mt-4 sm:mt-6 md:mt-8 text-right hidden md:block">
              <Button
                size="sm"
                className="sm:size-lg bg-[#1a237e] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md hover:bg-[#283593] hover:scale-105 hover:shadow-xl transition-transform duration-300"
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
                <span className="flex items-center gap-1 sm:gap-2 font-semibold text-xs sm:text-base">
                  Lancer le défi{" "}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
