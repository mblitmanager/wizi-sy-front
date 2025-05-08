import { useLocation, useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { QuizSummary } from "./QuizSummary";
import { useToast } from "@/hooks/use-toast";
import { quizSubmissionService } from "@/services/quiz/QuizSubmissionService";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationBanner } from "./NotificationBanner";
import { isRearrangementCorrect } from "@/utils/UtilsFunction";
import { Clock, CheckCircle, Calendar, TrendingUp } from "lucide-react";

export function QuizResults() {
  const { quizId } = useParams<{ quizId: string }>();
  const location = useLocation();
  const { toast } = useToast();
  const { notifyQuizCompleted, permission } = useNotifications();

  // Store result state locally to avoid triggering re-renders
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null);
  const [notificationSent, setNotificationSent] = useState(false);

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

  if (isLoading || (!result && !error)) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center flex-col gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <h1 className="text-2xl font-bold">Chargement des résultats...</h1>
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formattedUserAnswers: Record<string, any> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result.questions.forEach((q: any) => {
    if (q.type === "rearrangement") {
      const isCorrect = isRearrangementCorrect(
        q.selectedAnswers,
        q.correctAnswers
      );
    }

    if (q.selectedAnswers) {
      // Si la réponse est un tableau (choix multiples, etc.)
      if (Array.isArray(q.selectedAnswers)) {
        formattedUserAnswers[q.id] = q.selectedAnswers;
      }

      // Pour les questions de type "correspondance"
      else if (typeof q.selectedAnswers === "object") {
        if (q.type === "correspondance") {
          const answersById: Record<string, string> = {};
          q.answers.forEach((a: { id: string; text: string }) => {
            answersById[a.id] = a.text;
          });

          // Remplace les ID par leur texte correspondant
          const mapped: Record<string, string> = {};
          Object.entries(q.selectedAnswers).forEach(([leftId, rightVal]) => {
            const leftText = answersById[leftId] || leftId;
            const rightText =
              answersById[rightVal as string] || (rightVal as string);
            mapped[leftText] = rightText;
          });

          formattedUserAnswers[q.id] = mapped;
        } else {
          // Pour les autres types utilisant des objets (ex: remplir les champs)
          formattedUserAnswers[q.id] = q.selectedAnswers;
        }
      }

      // Réponse simple (ex: QCM, vrai/faux)
      else {
        formattedUserAnswers[q.id] = q.selectedAnswers;
      }
    } else {
      formattedUserAnswers[q.id] = null;
    }
  });

  const quizData = {
    id: result.quizId || result.quiz?.id,
    titre: result.quiz?.titre || "Quiz",
    description: result.quiz?.description || "",
    categorie: result.quiz?.categorie || "",
    categorieId: result.quiz?.categorieId || "",
    niveau: result.quiz?.niveau || "",
    points: result.quiz?.points || 0,
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4 lg:py-8">
        <NotificationBanner />

        <div className="mb-10 p-4 sm:p-6 border rounded-2xl bg-white shadow-xl dark:bg-gray-900 dark:border-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {/* Score */}
            <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br bg-gold text-white shadow-lg hover:scale-105 transition-transform duration-300">
              <div className="flex flex-col items-center">
                <TrendingUp size={24} className="mb-1 sm:mb-2" />
                <p className="uppercase text-xs sm:text-sm opacity-80">Score</p>
                <p className="text-2xl sm:text-3xl font-extrabold mt-1">
                  {result.score}%
                </p>
              </div>
            </div>

            {/* Bonnes réponses */}
            <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br bg-gold text-white shadow-lg hover:scale-105 transition-transform duration-300">
              <div className="flex flex-col items-center">
                <CheckCircle size={24} className="mb-1 sm:mb-2" />
                <p className="uppercase text-xs sm:text-sm opacity-80">
                  Bonnes réponses
                </p>
                <p className="text-2xl sm:text-3xl font-semibold mt-1">
                  {result.correctAnswers} / {result.totalQuestions}
                </p>
              </div>
            </div>

            {/* Temps passé */}
            <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br bg-gold text-white shadow-lg hover:scale-105 transition-transform duration-300">
              <div className="flex flex-col items-center">
                <Clock size={24} className="mb-1 sm:mb-2" />
                <p className="uppercase text-xs sm:text-sm opacity-80">
                  Temps passé
                </p>
                <p className="text-2xl sm:text-3xl font-semibold mt-1">
                  {Math.floor(result.timeSpent / 60)}:
                  {(result.timeSpent % 60).toString().padStart(2, "0")}
                </p>
              </div>
            </div>

            {/* Date de complétion */}
            <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br bg-gold text-white shadow-lg hover:scale-105 transition-transform duration-300">
              <div className="flex flex-col items-center">
                <Calendar size={24} className="mb-1 sm:mb-2" />
                <p className="uppercase text-xs sm:text-sm opacity-80">
                  Complété le
                </p>
                <p className="text-2xl sm:text-3xl font-semibold mt-1">
                  {new Date(result.completedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <QuizSummary
          questions={result.questions}
          quiz={quizData}
          userAnswers={formattedUserAnswers}
          score={result.score}
          totalQuestions={result.totalQuestions}
        />
      </div>
    </Layout>
  );
}
