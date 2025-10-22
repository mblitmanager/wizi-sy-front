import { useLocation, useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { quizSubmissionService } from "@/services/quiz/QuizSubmissionService";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationBanner } from "./NotificationBanner";
import { isRearrangementCorrect } from "@/utils/UtilsFunction";
import { Clock, CheckCircle, Calendar, TrendingUp } from "lucide-react";
import QuizSummaryHeader from "../Summary/QuizSummaryHeader";
import QuizSummaryCard from "../Summary/QuizSummaryCard";
import QuizAnswerCard from "../Summary/QuizAnswerCard";
import QuizSummaryFooter from "../Summary/QuizSummaryFooter";
import { Question } from "@/types/quiz";
import quizimg from "../../assets/loading_img.png";
import React from "react";
import { useNextQuiz } from "@/hooks/quiz/useNextQuiz";
import { CountdownAnimation } from "./CountdownAnimation";
import { stagiaireQuizService } from "@/services/quiz";
import { ProgressBar } from "../ui/ProgressBar";

interface QuizSummaryProps {
  quiz?: {
    id: string;
    titre: string;
    description: string;
    categorie: string;
    categorieId: string;
    niveau: string;
    points: number;
  };
  questions: Question[];
  userAnswers: Record<
    string,
    | string
    | number
    | Record<string, string | number>
    | Array<string | number>
    | null
    | undefined
  >;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  completedAt: string;
  correctAnswers: number;
}

export function QuizSummary() {
  const { quizId } = useParams<{ quizId: string }>();
  const location = useLocation();
  const { toast } = useToast();
  const { notifyQuizCompleted, permission } = useNotifications();
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Store result state locally to avoid triggering re-renders
  const [result, setResult] = useState<QuizSummaryProps | null>(null);
  const [notificationSent, setNotificationSent] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);

  // Récupérer le quiz suivant
  const { nextQuiz, loading: nextQuizLoading } = useNextQuiz(quizId);

  // Check if the result was passed through navigation state
  const resultFromState = location.state?.result;

  // If we don't have the result from state, fetch it from the API
  const {
    data: resultFromApi,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["quiz-result", quizId],
    queryFn: () => quizSubmissionService.getQuizResult(quizId as string),
    enabled: !!quizId && !resultFromState && !!localStorage.getItem("token"),
  });

  useEffect(() => {
    if (!result) return;
    setTimeElapsed(0);

    const totalTime = 20;
    let currentTime = 0;

    const interval = setInterval(() => {
      currentTime++;
      setTimeElapsed(currentTime);

      if (currentTime >= totalTime) {
        setShowCountdown(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [!!result]); // dépend de l'état (booléen) et non de l'objet complet

  // Use useEffect to set the result once to avoid infinite loops
  useEffect(() => {
    if (resultFromState) {
      setResult(resultFromState);
    } else if (resultFromApi) {
      setResult(resultFromApi);
    }
  }, [resultFromState, resultFromApi]);

  // Handle notifications for quiz results
  useEffect(() => {
    if (result && permission === "granted" && !notificationSent) {
      notifyQuizCompleted(result.correctAnswers, result.totalQuestions);
      setNotificationSent(true);
    }
  }, [result, permission, notificationSent, notifyQuizCompleted]);

  // Handle API errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les résultats du quiz.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Notification toast pour niveau débloqué (mêmes règles que StagiaireQuizList)
  useEffect(() => {
    if (!isLoading && result) {
      const userPoints = result.score;
      if (userPoints >= 50) {
        toast({
          title: "Niveau avancé débloqué !",
          description: "Vous pouvez maintenant participer aux quiz avancés.",
          variant: "default",
          className:
            "bg-gradient-to-r from-orange-700 to-yellow-700 text-white border-0",
        });
      } else if (userPoints >= 20) {
        toast({
          title: "Niveau intermédiaire débloqué !",
          description:
            "Vous pouvez maintenant participer aux quiz intermédiaires.",
          variant: "default",
          className:
            "bg-gradient-to-r from-orange-700 to-yellow-700 text-white border-0",
        });
      } else if (userPoints >= 10) {
        toast({
          title: "Nouveaux quiz disponibles !",
          description: "Vous avez débloqué de nouveaux quiz débutant.",
          variant: "default",
          className:
            "bg-gradient-to-r from-orange-700 to-yellow-700 text-white border-0",
        });
      }
    }
  }, [isLoading, result, toast]);

  if (isLoading || (!result && !error)) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center flex-col gap-4">
            <img src={quizimg} alt="Chargement" className="h-72 w-72" />
            <span className="text-gray-600">Chargement...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (!result) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-2xl font-bold mb-4">Résultats non disponibles</h1>
          <p className="mb-4">
            Les résultats de ce quiz ne sont pas disponibles.
          </p>
          <Button asChild>
            <Link to="/quizzes">Retour aux quiz</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // Format data for QuizSummary component
  const formattedUserAnswers: Record<string, any> = {};
  // Ajout du flag isPlayed à chaque question (jouée = réponse non vide)
  const questionsWithFlag = result.questions.map((q: any) => {
    let isPlayed = false;
    if (q.selectedAnswers !== null && q.selectedAnswers !== undefined) {
      if (Array.isArray(q.selectedAnswers)) {
        isPlayed = q.selectedAnswers.length > 0;
      } else if (typeof q.selectedAnswers === "object") {
        isPlayed = Object.keys(q.selectedAnswers).length > 0;
      } else if (typeof q.selectedAnswers === "string") {
        isPlayed = q.selectedAnswers.trim() !== "";
      } else {
        isPlayed = true;
      }
    }
    if (q.selectedAnswers) {
      if (Array.isArray(q.selectedAnswers)) {
        formattedUserAnswers[q.id] = q.selectedAnswers;
      } else if (typeof q.selectedAnswers === "object") {
        if (q.type === "correspondance") {
          const answersById: Record<string, string> = {};
          q.answers.forEach((a: { id: string; text: string }) => {
            answersById[a.id] = a.text;
          });
          const mapped: Record<string, string> = {};
          Object.entries(q.selectedAnswers).forEach(([leftId, rightVal]) => {
            const leftText = answersById[leftId] || leftId;
            const rightText =
              answersById[rightVal as string] || (rightVal as string);
            mapped[leftText] = rightText;
          });
          formattedUserAnswers[q.id] = mapped;
        } else {
          formattedUserAnswers[q.id] = q.selectedAnswers;
        }
      } else {
        formattedUserAnswers[q.id] = q.selectedAnswers;
      }
    } else {
      formattedUserAnswers[q.id] = null;
    }
    return { ...q, isPlayed };
  });

  // Filtrer les questions jouées (celles où isPlayed est true)
  const playedQuestions = questionsWithFlag.filter((q: any) => q.isPlayed);

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="container mx-auto py-4 px-2 sm:py-6 sm:px-4 lg:py-2 space-y-6 sm:space-y-8">
      {result && !showCountdown && (
        <div className="fixed bottom-4 right-4 z-40 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 p-3">
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {20 - timeElapsed}
              </div>
              <div className="text-xs text-gray-500">secondes</div>
            </div>

            <div className="w-12 h-12 relative">
              {/* Cercle de progression */}
              <svg
                className="w-12 h-12 transform -rotate-90"
                viewBox="0 0 48 48">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                  fill="none"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="#10b981"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="125.6"
                  strokeDashoffset={125.6 - (timeElapsed / 20) * 125.6}
                  className="transition-all duration-1000"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
      {/* Section des statistiques principales */}
      <div className="">
        {/* Titre de section */}
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-md bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300">
            <TrendingUp size={16} />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Résultats du quiz
          </h2>
        </div>

        {/* Conteneur flex pour aligner les deux composants */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Carte de résumé (QuizSummaryCard) */}
          <div className="flex-1 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
            <QuizSummaryCard
              score={result.correctAnswers * 2}
              totalQuestions={result.totalQuestions * 2}
            />
          </div>

          {/* Statistiques compactes */}
          <div className="flex-1 grid grid-cols-2 gap-3">
            {/* Bonnes réponses */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300">
                  <CheckCircle size={16} />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Bonnes réponses
                  </p>
                  <div className="flex items-end gap-1">
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      {result.correctAnswers}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      / {playedQuestions.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Temps passé */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Temps passé
                  </p>
                  <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                    {Math.floor(result.timeSpent / 60)}:
                    {(result.timeSpent % 60).toString().padStart(2, "0")}
                  </p>
                </div>
              </div>
            </div>

            {/* Score */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300">
                  <TrendingUp size={16} />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Score
                  </p>
                  <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    {result.score} pts
                  </p>
                </div>
              </div>
            </div>

            {/* Date */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Fait le
                  </p>
                  <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                    {new Date(result.completedAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section détaillée des résultats */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-100 dark:border-gray-700 mb-3 p-4">
        {/* En-tête du résumé */}
        <div className="p-3 bg-gradient-to-r bg-slate-300 via-slate-700 to-slate-800 text-black flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 justify-between mb-3">
          <h3 className="font-bold flex items-center gap-2 text-sm sm:text-base">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Détail des réponses
          </h3>
          <span className="text-xs sm:text-sm opacity-90">
            Revoyez chaque question et vos réponses
          </span>
        </div>

        {/* Liste des questions/réponses */}
        {playedQuestions.map(
          (question: Question & { isPlayed: boolean }, index: number) => {
            console.log(
              `Question ${index + 1}: index = ${index}, background = ${
                index % 2 === 0 ? "gray" : "white"
              }`
            );
            return (
              <QuizAnswerCard
                key={question.id}
                question={question}
                userAnswer={formattedUserAnswers[question.id]}
                isPlayed={question.isPlayed}
                index={index}
                questionNumber={index + 1}
              />
            );
          }
        )}

        {/* Pied de page avec actions */}
        <div className="p-3 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700">
          <QuizSummaryFooter quizId={result.quiz?.id || quizId || ""} />
        </div>
        {showCountdown && (
          <CountdownAnimation
            currentQuizId={quizId || ""}
            nextQuiz={nextQuiz}
            delay={5}
            onCountdownEnd={() => setShowCountdown(false)}
          />
        )}
      </div>
    </div>
  );
}
