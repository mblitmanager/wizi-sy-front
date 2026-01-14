import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { QuizHistory as QuizHistoryType } from "@/types/quiz";
import { Trophy, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CATEGORIES } from "@/utils/constants";

// Configuration des couleurs et styles
const CATEGORY_STYLES = {
  [CATEGORIES.BUREAUTIQUE]: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200",
  },
  [CATEGORIES.LANGUES]: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-200",
  },
  [CATEGORIES.INTERNET]: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-200",
  },
  [CATEGORIES.CREATION]: {
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    border: "border-indigo-200",
  },
  [CATEGORIES.IA]: {
    bg: "bg-green-50",
    text: "text-green-600",
    border: "border-green-200",
  },
  default: {
    bg: "bg-gray-50",
    text: "text-gray-600",
    border: "border-gray-200",
  },
};

const SCORE_COLORS = {
  high: "text-green-600",
  medium: "text-wizi-accent",
  low: "text-red-600",
};

interface QuizHistoryProps {
  history: QuizHistoryType[];
  loading?: boolean;
}

type HistoryWithIds = {
  quiz?: { id?: string | number };
  quizId?: string | number;
};

export const QuizHistory: React.FC<QuizHistoryProps> = ({
  history,
  loading,
}) => {
  const [page, setPage] = useState(1);
  const [showAllItems, setShowAllItems] = useState(false);
  const itemsPerPage = 5;

  const distinctCount = useMemo(() => {
    const set = new Set<string | number>();
    (history as Array<HistoryWithIds>).forEach((h) => {
      const id = h.quiz?.id ?? h.quizId;
      if (id !== undefined) set.add(id);
    });
    return set.size;
  }, [history]);

  const { paginatedHistory, totalPages } = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return {
      paginatedHistory: history.slice(startIndex, startIndex + itemsPerPage),
      totalPages: Math.ceil(history.length / itemsPerPage),
    };
  }, [page, history]);

  const displayedItems = showAllItems ? history : paginatedHistory;

  const getCategoryStyle = (category: string) => {
    return CATEGORY_STYLES[category] || CATEGORY_STYLES.default;
  };

  const getScoreColor = (correctAnswers: number, totalQuestions: number) => {
    const percentage = (correctAnswers / totalQuestions) * 100;
    return percentage >= 75
      ? SCORE_COLORS.high
      : percentage >= 50
      ? SCORE_COLORS.medium
      : SCORE_COLORS.low;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs.toString().padStart(2, "0")}s`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg ring-1 ring-gray-50 p-6 text-center text-gray-500">
        Chargement de l'historique...
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="mb-4 bg-white rounded-lg ring-1 ring-gray-50 p-6 text-center">
        <div className="mx-auto max-w-md">
          <Trophy className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            Aucun quiz complété
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Commencez par passer un quiz pour voir votre historique ici.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-lg ring-1 ring-gray-50 overflow-hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      <div className="p-4 sm:p-6 border-b">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-gray-900">
              Historique des Quiz
            </h2>
            <span className="text-xs text-gray-500">
              {distinctCount} quiz uniques complétés
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!showAllItems && (
              <div className="px-3 py-1 rounded-lg bg-gray-100 text-gray-800 text-sm font-semibold">
                Page {page}/{totalPages}
              </div>
            )}
            <button
              onClick={() => {
                setShowAllItems((v) => !v);
                if (!showAllItems) setPage(1);
              }}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm ${
                showAllItems
                  ? "border-blue-200 bg-blue-50 text-blue-600"
                  : "border-gray-200 bg-gray-100 text-gray-700"
              }`}>
              {/* <span className="material-icons text-base">
                {showAllItems ? "view_list" : "view_module"}
              </span> */}
              {showAllItems ? "Vue paginée" : "Voir tout"}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`p-2 sm:p-4 ${
          showAllItems
            ? "max-h-[60vh] sm:max-h-[70vh] overflow-y-auto pr-1"
            : ""
        }`}>
        {/* Mobile View */}
        <div className="sm:hidden space-y-3">
          {displayedItems.map((quiz: QuizHistoryType) => (
            <QuizHistoryCard
              key={quiz.id}
              quiz={quiz}
              getCategoryStyle={getCategoryStyle}
              getScoreColor={getScoreColor}
              formatTime={formatTime}
            />
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden sm:block overflow-x-auto">
          <div className="min-w-[720px]">
            <QuizHistoryTable
              history={displayedItems}
              getCategoryStyle={getCategoryStyle}
              getScoreColor={getScoreColor}
              formatTime={formatTime}
            />
          </div>
        </div>

        {/* Pagination */}
        {!showAllItems && totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Affichage de{" "}
              {Math.min((page - 1) * itemsPerPage + 1, history.length)} à{" "}
              {Math.min(page * itemsPerPage, history.length)} sur{" "}
              {history.length} résultats
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Précédent
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50">
                Suivant
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const QuizHistoryCard = ({
  quiz,
  getCategoryStyle,
  getScoreColor,
  formatTime,
}) => {
  const categoryStyle = getCategoryStyle(
    quiz.quiz.formation?.category || quiz.quiz.formation?.categorie
  );
  const percentage = Math.round(
    (quiz.correctAnswers / quiz.totalQuestions) * 100
  );
  const scoreColor = getScoreColor(quiz.correctAnswers, quiz.totalQuestions);

  return (
    <div
      className={`p-4 rounded-lg border ${categoryStyle.border} ${categoryStyle.bg} shadow-xs`}>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="font-medium text-gray-900 line-clamp-2">
            {quiz.quiz.titre}
          </h3>
          <div className="flex items-center space-x-2">
            <Badge
              variant="outline"
              className={`${categoryStyle.text} ${categoryStyle.border}`}>
              {quiz.quiz.formation?.category ||
                quiz.quiz.formation?.categorie ||
                "Général"}
            </Badge>
            <Badge variant="outline" className="text-gray-600 border-gray-300">
              {quiz.quiz.niveau}
            </Badge>
          </div>
        </div>
        <div className={`text-lg font-semibold ${scoreColor}`}>
          {percentage}%
        </div>
      </div>

      <div className="mt-3">
        <Progress value={percentage} className="h-2" />
        <div className="mt-1 text-xs text-gray-500">
          {quiz.correctAnswers} bonnes réponses sur 5
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>{formatTime(quiz.timeSpent)}</span>
        </div>
        <div>
          {format(new Date(quiz.completedAt), "dd MMMM yyyy - HH:mm", {
            locale: fr,
          })}
        </div>
      </div>
    </div>
  );
};

const QuizHistoryTable = ({
  history,
  getCategoryStyle,
  getScoreColor,
  formatTime,
}) => {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table className="min-w-full divide-y divide-gray-200">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quiz
            </TableHead>
            <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Catégorie
            </TableHead>
            <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Niveau
            </TableHead>
            <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Score
            </TableHead>
            <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Progression
            </TableHead>
            <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </TableHead>
            <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Temps
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white divide-y divide-gray-200">
          {history.map((quiz) => {
            const categoryStyle = getCategoryStyle(
              quiz.quiz.formation?.category || quiz.quiz.formation?.categorie
            );
            const percentage = Math.round(
              (quiz.correctAnswers / quiz.totalQuestions) * 100
            );
            const scoreColor = getScoreColor(
              quiz.correctAnswers,
              quiz.totalQuestions
            );

            return (
              <TableRow key={quiz.id} className="hover:bg-gray-50">
                <TableCell className="px-4 py-3 text-sm font-medium text-gray-900">
                  <div className="line-clamp-2">{quiz.quiz.titre}</div>
                </TableCell>
                <TableCell className="px-4 py-3 whitespace-nowrap">
                  <Badge
                    variant="outline"
                    className={`${categoryStyle.text} ${categoryStyle.border}`}>
                    {quiz.quiz.formation?.category ||
                      quiz.quiz.formation?.categorie ||
                      "Général"}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {quiz.quiz.niveau}
                </TableCell>
                <TableCell
                  className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${scoreColor}`}>
                  {percentage}%
                </TableCell>
                <TableCell className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <Progress value={percentage} className="h-2 w-24 mr-2" />
                    <span className="text-xs text-gray-500">
                      {quiz.correctAnswers}/{quiz.totalQuestions}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(quiz.completedAt), "dd MMMM yyyy", {
                    locale: fr,
                  })}
                </TableCell>
                <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatTime(quiz.timeSpent)}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
