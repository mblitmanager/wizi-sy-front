import React, { useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { QuizHistory as QuizHistoryType } from "@/types/quiz";

interface QuizHistoryProps {
  history: QuizHistoryType[];
}

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

export const QuizHistory: React.FC<QuizHistoryProps> = ({ history }) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil((history?.length || 0) / itemsPerPage);

  const paginatedHistory = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return history.slice(start, start + itemsPerPage);
  }, [history, page]);

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
    <Card>
      <CardHeader>
        <CardTitle>Historique des Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quiz</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Temps</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedHistory.map((quiz) => (
              <TableRow key={quiz.id}>
                <TableCell className="font-medium">{quiz.quiz.title}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(quiz.quiz.category)}`}>
                    {quiz.quiz.category}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={getScoreColor(quiz.score)}>{quiz.score}%</span>
                </TableCell>
                <TableCell>
                  {format(new Date(quiz.completedAt), "PPP", { locale: fr })}
                </TableCell>
                <TableCell>
                  {Math.round(quiz.timeSpent / 60)} min
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* Pagination Controls */}
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
      </CardContent>
    </Card>
  );
};
