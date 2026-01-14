import React from "react";
import { QuizResult } from "@/types/quiz";
import { CirclePlus, Trophy } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

interface RecentResultsProps {
  results: QuizResult[];
  isLoading: boolean;
  showAll?: boolean;
}

export const RecentResults: React.FC<RecentResultsProps> = ({
  results,
  isLoading,
  showAll = false,
}) => {
  // Limiter les résultats si on ne veut pas tout afficher
  const displayResults = showAll ? results : results.slice(0, 5);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-full h-16 bg-gray-100 rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 mb-4 font-roboto">
          Aucun résultat de quiz disponible.
        </p>
        <Link
          to="/quiz"
          className="text-blue-500 hover:text-blue-700 font-nunito inline-flex items-center">
          <CirclePlus className="h-4 w-4 mr-1" />
          Commencer un quiz
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayResults.map((result) => {
        // Use appropriate property name depending on what's available
        const resultId = result.id || `quiz-result-${Math.random()}`;

        // Gestion robuste du nom du quiz avec plusieurs fallbacks
        let quizName = "Quiz";
        if (result.quizTitle) {
          quizName = result.quizTitle;
        } else if (result.quiz_name) {
          quizName = result.quiz_name;
        } else if (result.title) {
          quizName = result.title;
        } else if (result.titre) {
          quizName = result.titre;
        } else if (result.quiz?.title) {
          quizName = result.quiz.title;
        } else if (result.quiz?.titre) {
          quizName = result.quiz.titre;
        }

        const correctAnswers =
          result.correct_answers || result.correctAnswers || 0;
        const totalQuestions =
          result.total_questions || result.totalQuestions || 0;

        // Calcul du pourcentage de réussite
        const successRate =
          totalQuestions > 0
            ? Math.round((correctAnswers / totalQuestions) * 100)
            : 0;

        // Date de complétion avec fallback
        let completedAt = "Date inconnue";
        try {
          const dateStr = result.completedAt || result.completed_at;
          if (dateStr) {
            completedAt = format(new Date(dateStr), "dd/MM/yyyy HH:mm", {
              locale: fr,
            });
          }
        } catch (error) {
          console.warn(
            "Invalid date format:",
            result.completedAt || result.completed_at
          );
        }

        // Score avec fallback - si le score n'est pas disponible, calculer à partir des bonnes réponses
        const score =
          result.score !== undefined
            ? result.score
            : totalQuestions > 0
            ? Math.round((correctAnswers / 5) * 100)
            : 0;

        return (
          <Card
            key={resultId}
            className="w-full p-2.5 md:p-3 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start md:items-center">
              <div className="flex-1 min-w-0 mr-2">
                <h4 className="font-medium text-xs md:text-sm font-nunito truncate">
                  {quizName}
                </h4>
                <div className="text-[10px] md:text-xs text-gray-500 font-roboto mt-0.5">
                  {completedAt}
                </div>
                {/* Barre de progression visuelle */}
                <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${
                      successRate >= 80
                        ? "bg-green-500"
                        : successRate >= 60
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${successRate}%` }}
                  />
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs md:text-sm font-medium font-nunito flex items-center justify-end">
                  <Trophy className="h-3.5 w-3.5 md:h-4 md:w-4 text-yellow-500 mr-1" />
                  {score}{" "}
                  {typeof score === "number" && score <= 100 ? "%" : "pts"}
                </div>
                <div className="text-[10px] md:text-xs text-gray-500 font-roboto">
                  {correctAnswers}/{totalQuestions} correctes
                </div>
                <div
                  className={`text-[10px] font-medium ${
                    successRate >= 80
                      ? "text-green-600"
                      : successRate >= 60
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}>
                  {successRate}%
                </div>
              </div>
            </div>
          </Card>
        );
      })}

      {!showAll && results.length > 5 && (
        <Link
          to="/classement?tab=history"
          className="text-blue-500 hover:text-blue-700 font-nunito text-xs md:text-sm flex justify-center mt-2 md:mt-3">
          Voir tous les résultats ({results.length})
        </Link>
      )}
    </div>
  );
};
