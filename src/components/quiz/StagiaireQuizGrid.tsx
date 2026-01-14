import { StagiaireQuizCard } from "./StagiaireQuizCard";
import type { Quiz, Category } from "@/types/quiz";
import React from "react";
import { QuizCard } from "./QuizCard";
import { QuizHistoryModal } from "./QuizHistoryModal";
import { useQuery } from "@tanstack/react-query";
import { quizHistoryService } from "@/services/quiz/submission/QuizHistoryService";
import bureatique from "../../assets/icons/bureautique.png";
import internet from "../../assets/icons/internet.png";
import creation from "../../assets/icons/creation.png";
import langues from "../../assets/icons/langues.png";
import IA from "../../assets/icons/ia.png";
interface StagiaireQuizGridProps {
  quizzes: Quiz[];
  categories: Category[] | undefined;
}

export function StagiaireQuizGrid({
  quizzes,
  categories,
}: StagiaireQuizGridProps) {
  const [historyQuizId, setHistoryQuizId] = React.useState<number | null>(null);
  const [historyQuizTitle, setHistoryQuizTitle] = React.useState<string>("");

  const { data: history } = useQuery({
    queryKey: ["quiz-history"],
    queryFn: () => quizHistoryService.getQuizHistory(),
    enabled: !!localStorage.getItem("token"),
    staleTime: 5 * 60 * 1000,
  });

  if (!quizzes || !quizzes.length) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600 italic">
          QUIZ À DÉCOUVRIR
        </h2>
        <p className="text-gray-500 font-medium italic">Aucun quiz ne correspond à vos filtres</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="block h-full">
            <QuizCard 
              quiz={quiz} 
              categories={categories} 
              history={history} 
              onHistoryClick={(e, q) => {
                setHistoryQuizId(Number(q.id));
                setHistoryQuizTitle(q.titre);
              }}
            />
          </div>
        ))}
      </div>

      <QuizHistoryModal 
        quizId={historyQuizId}
        quizTitle={historyQuizTitle}
        quizHistory={history || []}
        onClose={() => setHistoryQuizId(null)}
      />
    </div>
  );
}
