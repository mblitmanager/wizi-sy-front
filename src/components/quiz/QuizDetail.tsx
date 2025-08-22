import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { quizManagementService } from "@/services/quiz/QuizManagementService";
import { Button } from "../ui/button";
import { Loader2, Award, BookOpen, AlertCircle, ArrowRight } from "lucide-react";
import { Layout } from "../layout/Layout";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useToast } from "@/hooks/use-toast";
import quiziload from "../../assets/loading_img.png";
import { stripHtmlTags } from "@/utils/UtilsFunction";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

// Import Swiper CSS
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
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de charger ce quiz. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });

  const [currentTypeIdx, setCurrentTypeIdx] = React.useState(0);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-4">
            <img
              src={quiziload}
              alt="Chargement du quiz"
              className="h-64 w-64 animate-bounce-slow"
            />
            <span className="text-gray-600">Chargement du quiz...</span>
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
        <div className="container mx-auto py-8 text-center">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Quiz non trouvé</AlertTitle>
            <AlertDescription>
              Le quiz que vous recherchez n'existe pas ou n'est pas accessible.
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button onClick={() => navigate("/quizzes")} variant="outline">
              Retourner à la liste des quiz
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Types de questions selon le niveau
  const types = [
    ...(["débutant", "intermédiaire", "avancé"].includes(quiz.niveau)
      ? [
        {
          icon: <BookOpen className="w-6 h-6 text-blue-500 mb-1" />,
          title: "QCM",
          desc: "Choisissez la ou les bonnes réponses.",
          bg: "bg-blue-50",
        },
        {
          icon: <Award className="w-6 h-6 text-green-500 mb-1" />,
          title: "Vrai / Faux",
          desc: "Indiquez si l'affirmation est vraie ou fausse.",
          bg: "bg-green-50",
        },
        {
          icon: <span className="text-yellow-500 text-xl">🔊</span>,
          title: "Audio",
          desc: "Écoutez l'extrait audio et répondez.",
          bg: "bg-yellow-50",
        },
      ]
      : []),
    ...(["intermédiaire", "avancé"].includes(quiz.niveau)
      ? [
        {
          icon: <span className="text-purple-500 text-xl">🔀</span>,
          title: "Réarrangement",
          desc: "Remettez les éléments dans le bon ordre.",
          bg: "bg-purple-50",
        },
        {
          icon: <span className="text-pink-500 text-xl">🔗</span>,
          title: "Matching",
          desc: "Associez chaque élément à sa correspondance.",
          bg: "bg-pink-50",
        },
      ]
      : []),
    ...(quiz.niveau === "avancé"
      ? [
        {
          icon: <span className="text-indigo-500 text-xl">✍️</span>,
          title: "Champ vide",
          desc: "Complétez la phrase.",
          bg: "bg-indigo-50",
        },
        {
          icon: <span className="text-gray-500 text-xl">✨</span>,
          title: "Autres",
          desc: "Questions spéciales.",
          bg: "bg-gray-50",
        },
      ]
      : []),
  ];

  const handleNextType = () =>
    setCurrentTypeIdx((prev) => (prev + 1) % types.length);

  return (
    <Layout>
      {/* <div className="flex items-center px-2 sm:px-4 py-6"> */}
      <div className="w-[100%] rounded-2xl shadow-lg max-w-6xl w-full flex flex-col md:flex-row bg-white">
        {/* Section gauche */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between bg-gradient-to-tr from-white via-blue-50 to-indigo-100">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-2 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-500" />
              {quiz.titre}
            </h2>
            <p className="text-gray-600 mb-3 text-sm sm:text-base">
              {stripHtmlTags(quiz.description)}
            </p>

            <div className="flex gap-2 flex-wrap mb-4">
              <Badge className="bg-blue-100 text-blue-600 text-xs sm:text-sm">
                Niveau : {quiz.niveau}
              </Badge>
              <Badge className="bg-green-100 text-green-600 text-xs sm:text-sm">
                10 pts à gagner
              </Badge>
            </div>

            <p className="text-sm font-semibold text-gray-700">
              Nombre de questions : 5
            </p>
            <p className="text-xs text-gray-500 mt-1">
              ⏱ Temps imparti :{" "}
              {quiz.niveau === "débutant" ? "3 min (180 sec)" : "5 min (300 sec)"}
            </p>

            {/* Tutoriels */}
            {quiz.tutos && quiz.tutos.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Tutoriels :
                </p>
                <div className="flex md:grid md:grid-cols-2 gap-2 overflow-x-auto hide-scrollbar">
                  {quiz.tutos.map((tuto: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-gray-50 rounded-lg p-2 flex flex-col"
                    >
                      <span className="font-semibold text-xs text-indigo-700 truncate">
                        {tuto.titre || `Tuto ${idx + 1}`}
                      </span>
                      <span className="text-xs text-gray-600 truncate">
                        {tuto.description || ""}
                      </span>
                      {tuto.lien && (
                        <a
                          href={tuto.lien}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 underline mt-1 truncate"
                        >
                          Voir le tutoriel
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 text-right">
            <Button
              className="bg-[#1a237e] text-white px-6 py-3 rounded-lg hover:bg-[#283593] transition"
              onClick={() => navigate(`/quiz/${quiz.id}/start`)}
            >
              <span className="flex items-center gap-2">
                Lancer le défi <ArrowRight className="w-4 h-4" />
              </span>
            </Button>
          </div>
        </div>

        {/* Section droite */}
        <div className="w-[80%] md:w-1/2 flex flex-col items-center justify-center p-4">
          {/* Mobile */}
          <div className="block md:hidden w-full mb-4">
            {types.length > 0 && (
              <button
                type="button"
                className={`w-[130%] max-w-sm mx-auto ${types[currentTypeIdx].bg} rounded-xl p-5 flex flex-col items-center active:scale-95 transition`}
                onClick={handleNextType}
              >
                {types[currentTypeIdx].icon}
                <span className="font-semibold text-base">{types[currentTypeIdx].title}</span>
                <span className="text-xs text-gray-600 text-center">
                  {types[currentTypeIdx].desc}
                </span>
                {types.length > 1 && (
                  <span className="mt-2 text-xs text-gray-400">
                    {currentTypeIdx + 1} / {types.length} • Tapotez pour voir le suivant
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Desktop */}
          <div className="hidden md:block w-full">
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              spaceBetween={12}
              slidesPerView={"auto"}
              centeredSlides
              loop
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              className="pb-6"
            >
              {types.map((type, idx) => (
                <SwiperSlide key={idx} className="!w-[200px]">
                  <div
                    className={`p-4 rounded-lg flex flex-col items-center justify-center h-[120px] ${type.bg}`}
                  >
                    {type.icon}
                    <span className="font-semibold text-sm">{type.title}</span>
                    <span className="text-xs text-gray-600 text-center">
                      {type.desc}
                    </span>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
      {/* </div> */}
    </Layout>
  );
}
