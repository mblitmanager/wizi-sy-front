import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { quizHistoryService } from "@/services/quiz/quizHistoryService";

export function QuizHistoryModal({ quizId }: { quizId: number }) {
  const [open, setOpen] = useState(false);

  const { data: quizHistory } = useQuery({
    queryKey: ["quizHistory", quizId],
    queryFn: () => quizHistoryService.getQuizHistory(quizId), // 👈 assure-toi que ton service supporte le filtre par quizId
  });

  // Garder seulement les 3 derniers historiques (ordre décroissant par date)
  const last3 = quizHistory
    ?.sort((a: any, b: any) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 3);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">📜 Historique</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Derniers historiques</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {last3 && last3.length > 0 ? (
            last3.map((h: any, idx: number) => (
              <div key={idx} className="p-2 border rounded-md shadow-sm">
                <p><strong>Date :</strong> {new Date(h.completedAt).toLocaleString()}</p>
                <p><strong>Score :</strong> {h.correctAnswers}/{h.totalQuestions}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Aucun historique trouvé.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
