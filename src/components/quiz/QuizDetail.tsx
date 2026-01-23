import React, { useState, useEffect, useRef, useCallback } from "react";
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
  ArrowLeft,
  Clock,
  HelpCircle,
} from "lucide-react";
import { Layout } from "../layout/Layout";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useToast } from "@/hooks/use-toast";
import quiziload from "../../assets/loading_img.png";
import { stripHtmlTags } from "@/utils/UtilsFunction";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import PlayedQuestions from "./PlayedQuestions";
import type { Quiz, PlayedQuestion } from "@/types/quiz";
import { motion, AnimatePresence } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export function QuizDetail() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentTypeIdx, setCurrentTypeIdx] = useState(0);

  const {
    data: quiz,
    isLoading,
    isError,
  } = useQuery<Quiz>({
    queryKey: ["quiz", quizId],
    queryFn: () => quizManagementService.getQuizById(quizId!),
    enabled: !!quizId && !!localStorage.getItem("token"),
    retry: 1,
  });

  useEffect(() => {
    if (isError) {
      toast({
        title: "Erreur",
        description: "Impossible de charger ce quiz. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  }, [isError, toast]);

  const types = React.useMemo(() => {
    if (!quiz) return [];
    interface QuizType {
      icon: React.ReactNode;
      title: string;
      desc: string;
      bg: string;
      border: string;
    }
    const t: QuizType[] = [];

    const baseTypes = [
      {
        icon: <BookOpen className="w-8 h-8 text-blue-500" />,
        title: "QCM",
        desc: "Choisissez la ou les bonnes réponses.",
        bg: "bg-blue-50/50",
        border: "border-blue-100",
      },
      {
        icon: <Award className="w-8 h-8 text-emerald-500" />,
        title: "Vrai / Faux",
        desc: "Indiquez si l'affirmation est vraie ou fausse.",
        bg: "bg-emerald-50/50",
        border: "border-emerald-100",
      },
      {
        icon: <span className="text-3xl text-amber-500">🔊</span>,
        title: "Audio",
        desc: "Écoutez l'extrait audio et répondez.",
        bg: "bg-amber-50/50",
        border: "border-amber-100",
      }
    ];

    if (["débutant", "intermédiaire", "avancé"].includes(quiz.niveau)) {
      t.push(...baseTypes);
    }

    if (["intermédiaire", "avancé"].includes(quiz.niveau)) {
      t.push(
        {
          icon: <span className="text-3xl text-purple-500">🔀</span>,
          title: "Réarrangement",
          desc: "Remettez les éléments dans le bon ordre.",
          bg: "bg-purple-50/50",
          border: "border-purple-100",
        },
        {
          icon: <span className="text-3xl text-pink-500">🔗</span>,
          title: "Matching",
          desc: "Associez chaque élément à sa correspondance.",
          bg: "bg-pink-50/50",
          border: "border-pink-100",
        }
      );
    }

    if (quiz.niveau === "avancé") {
      t.push(
        {
          icon: <span className="text-3xl text-indigo-500">✍️</span>,
          title: "Champ vide",
          desc: "Complétez la phrase.",
          bg: "bg-indigo-50/50",
          border: "border-indigo-100",
        },
        {
          icon: <span className="text-3xl text-slate-500">✨</span>,
          title: "Autres",
          desc: "Questions spéciales.",
          bg: "bg-slate-50/50",
          border: "border-slate-100",
        }
      );
    }

    return t;
  }, [quiz]);

  const totalQuestions = quiz?.questions?.length || 5;
  const possiblePoints = 10;
  
  const swiperRef = useRef<any>(null); // Type any is acceptable here as Swiper instance is complex

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!types || types.length <= 1) return;
      if (e.key === "ArrowRight")
        setCurrentTypeIdx((s) => (s + 1) % types.length);
      if (e.key === "ArrowLeft")
        setCurrentTypeIdx((s) => (s - 1 + types.length) % types.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [types]);

  if (isLoading)
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[70vh]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <img
              src={quiziload}
              alt="Chargement du quiz"
              className="h-72 w-72 animate-pulse"
            />
            <div className="flex flex-col items-center gap-2 text-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                <span className="text-indigo-600 font-medium text-lg px-4">Préparation de votre aventure...</span>
            </div>
          </motion.div>
        </div>
      </Layout>
    );

  if (isError || !quiz)
    return (
      <Layout>
        <div className="container mx-auto py-12 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert variant="destructive" className="border-2">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle className="text-lg font-bold">Oups !</AlertTitle>
                <AlertDescription className="text-base mt-2">
                {isError 
                    ? "Une erreur est survenue lors du chargement du quiz. Veuillez réessayer plus tard."
                    : "Le quiz que vous recherchez n'existe pas ou n'est pas accessible."}
                </AlertDescription>
            </Alert>
            <div className="mt-8 text-center">
                <Button 
                    onClick={() => navigate("/quizzes")} 
                    variant="outline"
                    className="hover:bg-gray-100 transition-all px-8 py-6 rounded-xl border-2"
                >
                Retourner à la liste des quiz
                </Button>
            </div>
          </motion.div>
        </div>
      </Layout>
    );

  const handleNextType = () =>
    setCurrentTypeIdx((prev) => (prev + 1) % types.length);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <Layout>
      <div className="min-h-screen pb-12 bg-[#fafbff]">
        {/* Background blobs for aesthetics */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[100px]" />
        </div>

        <motion.div 
          className="relative w-full max-w-6xl mx-auto mt-8 px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Left Section - Content */}
              <div className="flex-1 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-gray-100">
                <motion.div variants={itemVariants}>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 border-indigo-100 font-bold px-3 py-1">
                      QUIZ AVENTURE
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigate("/quizzes")}
                      className="text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Liste des quiz
                    </Button>
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
                    {quiz.titre}
                  </h1>
                  <div 
                    className="text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl quill-content"
                    dangerouslySetInnerHTML={{ __html: quiz.description }}
                  />

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <HelpCircle className="w-5 h-5 text-indigo-500 mb-2" />
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Questions</p>
                      <p className="text-xl font-bold text-slate-900">{totalQuestions}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <Clock className="w-5 h-5 text-amber-500 mb-2" />
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Durée</p>
                      <p className="text-xl font-bold text-slate-900">
                        {quiz.niveau === "débutant" ? "3 min" : "5 min"}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <Award className="w-5 h-5 text-emerald-500 mb-2" />
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Points</p>
                      <p className="text-xl font-bold text-slate-900">{possiblePoints} pts</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-5 h-5 flex items-center justify-center text-xs font-bold text-blue-500 bg-blue-50 rounded-full mb-2">⭐</div>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Niveau</p>
                      <p className="text-xl font-bold text-slate-900 capitalize">{quiz.niveau}</p>
                    </div>
                  </div>

                  {quiz.tutos?.length > 0 && (
                    <div className="mb-10">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                        Ressources d'apprentissage
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {quiz.tutos.map((tuto: Required<Quiz>["tutos"][number], idx: number) => (
                          <motion.a
                            key={idx}
                            href={tuto.lien}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.02, x: 5 }}
                            className="flex items-center p-3 bg-slate-50/50 rounded-xl border border-slate-100 group transition-all"
                          >
                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center mr-3 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              <BookOpen className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="font-bold text-slate-900 text-sm truncate">
                                    {tuto.titre || `Tuto ${idx + 1}`}
                                </p>
                                <p className="text-xs text-indigo-600 font-medium">Voir le tutoriel →</p>
                            </div>
                          </motion.a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <Button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-7 rounded-2xl text-lg font-bold shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                      onClick={() => navigate(`/quiz/${quiz.id}/start`)}
                    >
                      C'est parti !
                      <ArrowRight className="ml-3 w-5 h-5" />
                    </Button>
                  </div>
                </motion.div>
              </div>

              {/* Right Section - Visual/Interactive */}
              <div className="lg:w-[400px] bg-slate-50/30 p-8 lg:p-12 flex flex-col items-center justify-center">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="w-full h-full flex flex-col"
                >
                    <div className="text-center mb-8">
                        <h3 className="text-lg font-bold text-slate-900">Types de questions</h3>
                        <p className="text-sm text-slate-500">Ce qui vous attend dans ce quiz</p>
                    </div>

                    {/* Mobile - Stack */}
                    <div className="lg:hidden w-full">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentTypeIdx}
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                className={`w-full ${types[currentTypeIdx].bg} border-2 ${types[currentTypeIdx].border} rounded-[2rem] p-8 flex flex-col items-center text-center shadow-xl shadow-indigo-100/20`}
                                onClick={handleNextType}
                            >
                                <div className="p-4 bg-white rounded-2xl shadow-sm mb-4">
                                    {types[currentTypeIdx].icon}
                                </div>
                                <h4 className="text-xl font-bold text-slate-900 mb-2">
                                    {types[currentTypeIdx].title}
                                </h4>
                                <p className="text-slate-600 mb-4">
                                    {types[currentTypeIdx].desc}
                                </p>
                                <div className="mt-auto pt-4 flex items-center gap-2">
                                    {types.map((_, i) => (
                                        <div 
                                            key={i} 
                                            className={`w-2 h-2 rounded-full transition-all ${i === currentTypeIdx ? 'bg-indigo-600 w-4' : 'bg-slate-300'}`} 
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                        <p className="text-center text-xs text-slate-400 mt-4">
                            Appuyez sur la carte pour voir les autres types
                        </p>
                    </div>

                    {/* Desktop - Swiper */}
                    <div className="hidden lg:block w-full flex-1 min-h-[400px]">
                        <Swiper
                            modules={[Autoplay, Pagination]}
                            spaceBetween={20}
                            slidesPerView={1}
                            loop
                            autoplay={{ delay: 4000, disableOnInteraction: false }}
                            pagination={{ 
                                clickable: true,
                                bulletActiveClass: 'swiper-pagination-bullet-active !bg-indigo-600 !w-6 !rounded-full transition-all'
                            }}
                            className="h-full w-full !pb-12"
                            onSwiper={(swiper) => (swiperRef.current = swiper)}
                        >
                            {types.map((type, idx) => (
                                <SwiperSlide key={idx} className="h-full">
                                    <div
                                        className={`h-full ${type.bg} border-2 ${type.border} border-dashed rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center shadow-inner`}
                                    >
                                        <motion.div 
                                            className="p-6 bg-white rounded-3xl shadow-lg mb-6"
                                            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                                        >
                                            {type.icon}
                                        </motion.div>
                                        <h4 className="text-2xl font-bold text-slate-900 mb-3">
                                            {type.title}
                                        </h4>
                                        <p className="text-slate-600 leading-relaxed">
                                            {type.desc}
                                        </p>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Played Questions Section */}
          {quiz?.playedQuestions && quiz.playedQuestions.length > 0 && (
            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12 bg-white/60 backdrop-blur-md rounded-[2rem] p-8 border border-white/40 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <Clock className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900">Historique des tentatives</h3>
                    <p className="text-sm text-slate-500">Revoyez vos performances précédentes</p>
                </div>
              </div>
              
              <div className="overflow-hidden pt-2">
                <PlayedQuestions
                  playedQuestions={quiz.playedQuestions}
                  questions={quiz.questions}
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}
