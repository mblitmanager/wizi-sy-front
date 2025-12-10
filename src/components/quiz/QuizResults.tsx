import { useLocation, useParams, Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { quizSubmissionService } from "@/services/quiz/QuizSubmissionService";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { isRearrangementCorrect } from "@/utils/UtilsFunction";
import { QuizSummary } from "./QuizSummary";
import quizimg from "../../assets/loading_img.png";
import { BadgeUnlockModal } from "@/components/profile/BadgeUnlockModal";
import { useNewBadges } from "@/hooks/useNewBadges";

export function QuizResults() {
  const { quizId } = useParams<{ quizId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const notificationsContext = useNotifications();

  // Badge unlock modal
  const { currentBadge, showModal, setShowModal, checkForNewBadges } = useNewBadges();

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

  // Handle notifications for quiz results and check for new badges
  useEffect(() => {
    if (result && !notificationSent) {
      // Check for newly unlocked badges after quiz completion
      checkForNewBadges();
      setNotificationSent(true);
    }
  }, [result, notificationSent, checkForNewBadges]);

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
            <img src={quizimg} alt="Chargement" className="h-72 w-72" />
            <span className="text-gray-600">Chargement des résultats...</span>
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
    <div className="mb-[5%]">
      <Layout>
        <QuizSummary
          questions={result.questions}
          quiz={quizData}
          userAnswers={formattedUserAnswers}
          score={result.score}
          totalQuestions={result.totalQuestions}
        />

        {/* Badge unlock modal */}
        {currentBadge && (
          <BadgeUnlockModal
            badge={currentBadge}
            isOpen={showModal}
            onClose={setShowModal}
            onViewAll={() => {
              setShowModal();
              navigate("/profile/badges");
            }}
          />
        )}
      </Layout>
    </div>
  );
}
