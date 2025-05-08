import React from "react";
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

interface QuizHistoryProps {
  history: QuizHistoryType[];
}

export const QuizHistory: React.FC<QuizHistoryProps> = ({ history }) => {
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
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Historique des Quiz</h2>
      </div>

      {/* Content */}
      <div className="p-2 sm:p-4">
        {/* Mobile View */}
        <div className="sm:hidden space-y-3">
          {history.map((quiz) => (
            <div key={quiz.id} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{quiz.quiz.title}</h3>
                  <p className="text-sm text-gray-500">{quiz.quiz.category}</p>
                </div>
                <div className="text-primary font-medium">{quiz.score}%</div>
              </div>

              <div className="mt-2 flex justify-between text-sm text-gray-500">
                <div>
                  {format(new Date(quiz.completedAt), "dd/MM/yy", {
                    locale: fr,
                  })}
                </div>
                <div>{Math.round(quiz.timeSpent / 60)} min</div>
              </div>
            </div>
          ))}
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
                {history.map((quiz) => (
                  <tr key={quiz.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap font-medium">
                      {quiz.quiz.title}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {quiz.quiz.category}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-primary">
                      {quiz.score}%
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {format(new Date(quiz.completedAt), "PPP", {
                        locale: fr,
                      })}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {Math.round(quiz.timeSpent / 60)} min
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
