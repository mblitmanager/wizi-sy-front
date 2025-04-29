
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
            {history.map((quiz) => (
              <TableRow key={quiz.id}>
                <TableCell className="font-medium">{quiz.quiz.title}</TableCell>
                <TableCell>{quiz.quiz.category}</TableCell>
                <TableCell>{quiz.score}%</TableCell>
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
      </CardContent>
    </Card>
  );
};
