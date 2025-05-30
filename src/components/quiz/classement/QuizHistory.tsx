import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { QuizHistory as QuizHistoryType } from "@/types/quiz";
import { Loader2, Trophy, Clock3 } from "lucide-react";
// Color map for categories
const CATEGORY_COLORS: Record<string, string> = {
  Math: "bg-blue-100 text-blue-800",
  Science: "bg-green-100 text-green-800",
  History: "bg-yellow-100 text-yellow-800",
  Bureautique: " border-b-4 border-[#3D9BE9] ",
  Langues: " border-b-4 border-[#A55E6E] ",
  Internet: " border-b-4 border-[#FFC533] ",
  Création: " border-b-4 border-[#9392BE] ",
  default: "bg-gray-100 text-gray-800",
};

// Helper to get color class for category
function getCategoryColor(category: string) {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.default;
}

// Helper to get color class for score
function getScoreColor(correctAnswers: number, totalQuestions: number) {
  // if (score >= 8) return "text-green-600 font-bold";
  // if (score >= 5) return "text-orange-500 font-semibold";
  // return "text-red-600 font-semibold";
  const level = Math.round((correctAnswers / totalQuestions) * 100);
  // if (level === "Débutant" ||level === "débutant" || level === "Débutante") {
  //   return score >= 8 ? "text-green-600 font-bold" : (score >= 5 ? "text-orange-500 font-semibold" : "text-red-600 font-semibold");
  // } else if (level === "intermédiaire" || level === "Intermédiaire") {
  //   return score >= 15 ? "text-green-600 font-bold" : (score >= 10 ? "text-orange-500 font-semibold" : "text-red-600 font-semibold");
  // } else if (level === "avancé" || level === "Avancé" || level === "Avancée") {
  return level >= 75
    ? "text-green-600 font-bold"
    : level >= 50
    ? "text-orange-500 font-semibold"
    : "text-red-600 font-semibold";
  // }
}

interface QuizHistoryProps {
  history: QuizHistoryType[];
}

export const QuizHistory: React.FC<QuizHistoryProps> = ({ history }) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  console.log("history", history);
  const paginatedHistory = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return history.slice(startIndex, startIndex + itemsPerPage);
  }, [page, history]);

  const totalPages = Math.ceil(history.length / itemsPerPage);

  if (!history || history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historique des Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-4 text-muted-foreground">
            Aucun quiz complété
          </p>
        </CardContent>
      </Card>
    );
  }

  console.log("paginatedHistory", paginatedHistory);

  return (
    <div className="border rounded-lg bg-white shadow-sm">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Historique des Quiz</h2>
      </div>

      {/* Content */}
      <div className="p-2 sm:p-4">
        {/* Mobile View */}
        <div className="sm:hidden space-y-3">
          {paginatedHistory.map((quiz) => (
            <div
              key={quiz.id}
              className={`p-2 rounded-lg  ${getCategoryColor(
                quiz.quiz.category
              )} shadow-md`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-sm truncate">
                    {quiz.quiz.title}
                  </h3>
                  <p className="text-xs truncate">
                    {quiz.quiz.category} - Niveau : {quiz.quiz.level}
                  </p>
                </div>
                <div className="text-primary font-semibold text-sm">
                  {quiz.correctAnswers} / {quiz.totalQuestions}
                  {/* ({Math.round((quiz.correctAnswers / quiz.totalQuestions) * 100)}%) */}
                </div>
              </div>
              <div className="mt-2 flex justify-between font-semibold text-sm text-gray-900">
                <div>
                  {format(new Date(quiz.completedAt), "dd/MM/yyyy HH:mm", {
                    locale: fr,
                  })}
                </div>
                <div>
                  {Math.floor(quiz.timeSpent / 60)}:
                  {(quiz.timeSpent % 60).toString().padStart(2, "0")}
                </div>
              </div>
            </div>
          ))}

          {/* Pagination Controls mobile */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-3">
              <button
                className="px-2 py-1 border rounded text-xs disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Précédent
              </button>
              <span className="text-xs">
                Page {page} / {totalPages}
              </span>
              <button
                className="px-2 py-1 border rounded text-xs disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Suivant
              </button>
            </div>
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden sm:block">
          <div className="overflow-hidden rounded-lg border shadow-sm">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-xs text-left text-gray-500">
                    Quiz
                  </th>
                  <th className="px-3 py-2 text-xs text-left text-gray-500">
                    Catégorie
                  </th>
                  <th className="px-3 py-2 text-xs text-left text-gray-500">
                    Niveau
                  </th>
                  <th className="px-3 py-2 text-xs text-left text-gray-500">
                    Score
                  </th>
                  <th className="px-3 py-2 text-xs text-left text-gray-500">
                    Bonnes réponses
                  </th>
                  <th className="px-3 py-2 text-xs text-left text-gray-500">
                    Date
                  </th>
                  <th className="px-3 py-2 text-xs text-left text-gray-500">
                    Temps
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {paginatedHistory.map((quiz) => (
                  <tr key={quiz.id} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-2 truncate">{quiz.quiz.title}</td>
                    <td
                      className={`px-3 py-2 truncate ${getCategoryColor(
                        quiz.quiz.category
                      )}`}
                    >
                      {quiz.quiz.category}
                    </td>
                    <td className="px-3 py-2 truncate">{quiz.quiz.level}</td>
                    <td
                      className={`px-3 py-2 ${getScoreColor(
                        quiz.correctAnswers,
                        quiz.totalQuestions
                      )}`}
                    >
                      {quiz.score}
                    </td>
                    <td className="px-3 py-2">
                      {quiz.correctAnswers} / {quiz.totalQuestions} (
                      {Math.round(
                        (quiz.correctAnswers / quiz.totalQuestions) * 100
                      )}
                      %)
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {format(new Date(quiz.completedAt), "PPP - HH:mm", {
                        locale: fr,
                      })}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {Math.floor(quiz.timeSpent / 60)}:
                      {(quiz.timeSpent % 60).toString().padStart(2, "0")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls desktop */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-3">
              <button
                className="px-2 py-1 border rounded text-xs disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Précédent
              </button>
              <span className="text-xs">
                Page {page} / {totalPages}
              </span>
              <button
                className="px-2 py-1 border rounded text-xs disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Suivant
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
