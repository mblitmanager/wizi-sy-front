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
import { CATEGORIES } from "@/utils/constants";

// Configuration des couleurs
const CATEGORY_COLORS = {
  [CATEGORIES.BUREAUTIQUE]: "border-b-4 border-[#3D9BE9]",
  [CATEGORIES.LANGUES]: "border-b-4 border-[#A55E6E]",
  [CATEGORIES.INTERNET]: "border-b-4 border-[#FFC533]",
  [CATEGORIES.CREATION]: "border-b-4 border-[#9392BE]",
  Math: "bg-blue-100 text-blue-800",
  Science: "bg-green-100 text-green-800",
  History: "bg-yellow-100 text-yellow-800",
  default: "bg-gray-100 text-gray-800",
};

const SCORE_COLORS = {
  high: "text-green-600 font-bold",
  medium: "text-orange-500 font-semibold",
  low: "text-red-600 font-semibold",
};

interface QuizHistoryProps {
  history: QuizHistoryType[];
}

export const QuizHistory: React.FC<QuizHistoryProps> = ({ history }) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // Mémoïsation des données paginées
  const { paginatedHistory, totalPages } = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return {
      paginatedHistory: history.slice(startIndex, startIndex + itemsPerPage),
      totalPages: Math.ceil(history.length / itemsPerPage),
    };
  }, [page, history]);

  // Fonction helper pour la couleur de catégorie
  const getCategoryColor = (category: string) => {
    return CATEGORY_COLORS[category] || CATEGORY_COLORS.default;
  };

  // Fonction helper pour la couleur de score
  const getScoreColor = (correctAnswers: number, totalQuestions: number) => {
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    return percentage >= 75
      ? SCORE_COLORS.high
      : percentage >= 50
      ? SCORE_COLORS.medium
      : SCORE_COLORS.low;
  };

  // Formatage du temps
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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

  return (
    <div className="border rounded-lg bg-white shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg text-orange-400 font-semibold">
          Historique des Quiz
        </h2>
      </div>

      <div className="p-2 sm:p-4">
        {/* Mobile View */}
        <div className="sm:hidden space-y-3">
          {paginatedHistory.map((quiz) => (
            <QuizHistoryCard
              key={quiz.id}
              quiz={quiz}
              getCategoryColor={getCategoryColor}
              formatTime={formatTime}
            />
          ))}
          <PaginationControls
            page={page}
            totalPages={totalPages}
            setPage={setPage}
          />
        </div>

        {/* Desktop View */}
        <div className="hidden sm:block">
          <QuizHistoryTable
            history={paginatedHistory}
            getCategoryColor={getCategoryColor}
            getScoreColor={getScoreColor}
            formatTime={formatTime}
          />
          <PaginationControls
            page={page}
            totalPages={totalPages}
            setPage={setPage}
          />
        </div>
      </div>
    </div>
  );
};

// Sous-composant pour la carte mobile
const QuizHistoryCard = ({ quiz, getCategoryColor, formatTime }) => (
  <div
    className={`p-2 rounded-lg ${getCategoryColor(
      quiz.quiz.category
    )} shadow-md`}>
    <div className="flex justify-between items-center">
      <div>
        <h3 className="font-medium text-sm truncate">{quiz.quiz.title}</h3>
        <p className="text-xs truncate">
          {quiz.quiz.category} - Niveau : {quiz.quiz.level}
        </p>
      </div>
      <div className="text-primary font-semibold text-sm">
        {quiz.correctAnswers} / {quiz.totalQuestions}
      </div>
    </div>
    <div className="mt-2 flex justify-between font-semibold text-sm text-gray-900">
      <div>
        {format(new Date(quiz.completedAt), "dd/MM/yyyy HH:mm", {
          locale: fr,
        })}
      </div>
      <div>{formatTime(quiz.timeSpent)}</div>
    </div>
  </div>
);

// Sous-composant pour le tableau desktop
const QuizHistoryTable = ({
  history,
  getCategoryColor,
  getScoreColor,
  formatTime,
}) => (
  <div className="overflow-hidden rounded-lg border shadow-sm">
    <table className="min-w-full bg-white">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-3 py-2 text-xs text-left text-gray-500">Quiz</th>
          <th className="px-3 py-2 text-xs text-left text-gray-500">
            Catégorie
          </th>
          <th className="px-3 py-2 text-xs text-left text-gray-500">Niveau</th>
          <th className="px-3 py-2 text-xs text-left text-gray-500">Score</th>
          <th className="px-3 py-2 text-xs text-left text-gray-500">
            Bonnes réponses
          </th>
          <th className="px-3 py-2 text-xs text-left text-gray-500">Date</th>
          <th className="px-3 py-2 text-xs text-left text-gray-500">Temps</th>
        </tr>
      </thead>
      <TableBody>
        {history.map((quiz) => (
          <TableRow key={quiz.id}>
            <TableCell>{quiz.quiz.title}</TableCell>
            <TableCell className={getCategoryColor(quiz.quiz.category)}>
              {quiz.quiz.category}
            </TableCell>
            <TableCell>{quiz.quiz.level}</TableCell>
            <TableCell
              className={getScoreColor(
                quiz.correctAnswers,
                quiz.totalQuestions
              )}>
              {quiz.score}
            </TableCell>
            <TableCell>
              {quiz.correctAnswers} / {quiz.totalQuestions} (
              {Math.round((quiz.correctAnswers / quiz.totalQuestions) * 100)}%)
            </TableCell>
            <TableCell>
              {format(new Date(quiz.completedAt), "PPP - HH:mm", {
                locale: fr,
              })}
            </TableCell>
            <TableCell>{formatTime(quiz.timeSpent)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </table>
  </div>
);

// Sous-composant pour la pagination
const PaginationControls = ({ page, totalPages, setPage }) =>
  totalPages > 1 && (
    <div className="flex justify-center items-center gap-2 mt-3">
      <button
        className="px-2 py-1 border rounded text-xs disabled:opacity-50"
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={page === 1}>
        Précédent
      </button>
      <span className="text-xs">
        Page {page} / {totalPages}
      </span>
      <button
        className="px-2 py-1 border rounded text-xs disabled:opacity-50"
        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        disabled={page === totalPages}>
        Suivant
      </button>
    </div>
  );
