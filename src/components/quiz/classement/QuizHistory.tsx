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
import { Loader2, Trophy, Clock3 } from 'lucide-react';
// Color map for categories
const CATEGORY_COLORS: Record<string, string> = {
  Math: 'bg-blue-100 text-blue-800',
  Science: 'bg-green-100 text-green-800',
  History: 'bg-yellow-100 text-yellow-800',
  Bureautique: 'bg-[#3D9BE9] text-white',
  Langues: 'bg-[#A55E6E] text-white',
  Internet: 'bg-[#FFC533] text-black',
  Création: 'bg-[#9392BE] text-white',
  default: 'bg-gray-100 text-gray-800',
};

// Helper to get color class for category
function getCategoryColor(category: string) {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.default;
}

// Helper to get color class for score
function getScoreColor(score: number) {
  if (score >= 80) return 'text-green-600 font-bold';
  if (score >= 50) return 'text-orange-500 font-semibold';
  return 'text-red-600 font-semibold';
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
          <p className="text-center py-4 text-muted-foreground">Aucun quiz complété</p>
        </CardContent>
      </Card>
    );
  }

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
            <div key={quiz.id} className={`p-3 border rounded-lg ${getCategoryColor(quiz.quiz.category)}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{quiz.quiz.title}</h3>
                  <p className="text-sm text-gray-900">{quiz.quiz.category}</p>
                </div>
                <div className="text-primary font-medium">{quiz.score}%</div>
              </div>
              <div className="mt-2 flex justify-between text-sm text-gray-900">
                <div>
                  {format(new Date(quiz.completedAt), "dd/MM/yyyy HH:mm", {
                    locale: fr,
                  })}
                </div>
                <div className="text-primary-900">{Math.floor(quiz.timeSpent / 60)}:{(quiz.timeSpent % 60).toString().padStart(2, '0')}</div>
              </div>
            </div>
          ))}
          {/* Pagination Controls mobile */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                className="px-2 py-1 border rounded disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Précédent
              </button>
              <span>
                Page {page} / {totalPages}
              </span>
              <button
                className="px-2 py-1 border rounded disabled:opacity-50"
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
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quiz
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Temps
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedHistory.map((quiz) => (
                  <tr key={quiz.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap font-medium">
                      {quiz.quiz.title}
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap ${getCategoryColor(quiz.quiz.category)}`}>
                      {quiz.quiz.category}
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap ${getScoreColor(quiz.score)}`}>
                      {quiz.score}%
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                       {format(new Date(quiz.completedAt), "PPP - HH:mm", {
                    locale: fr,
                  })}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {Math.floor(quiz.timeSpent / 60)}:{(quiz.timeSpent % 60).toString().padStart(2, '0')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls desktop */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                className="px-2 py-1 border rounded disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Précédent
              </button>
              <span>
                Page {page} / {totalPages}
              </span>
              <button
                className="px-2 py-1 border rounded disabled:opacity-50"
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
