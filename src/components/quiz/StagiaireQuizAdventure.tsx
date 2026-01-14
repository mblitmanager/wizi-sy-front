import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { stagiaireQuizService } from "@/services/quiz/StagiaireQuizService";
import { quizHistoryService } from "@/services/quiz/submission/QuizHistoryService";
import type { Quiz, QuizHistory } from "@/types/quiz";
import { Loader2, Lock, ChartSpline } from "lucide-react";
import { useClassementPoints } from "@/hooks/useClassementPoints";
import { buildAvailableQuizzes } from "./quizUtils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdventureQuizCard } from "./AdventureQuizCard";
import { cn } from "@/lib/utils";

// Composant Carrousel de conseils
function QuizAdventureTutorial() {
  const steps = [
    {
      title: "🎯 Suivez le chemin de la connaissance !",
      content:
        "Les quiz sont organisés en parcours progressif. Terminez un quiz pour débloquer le suivant.",
    },
    {
      title: "🏆 Accumulez les succès !",
      content:
        "Chaque quiz réussi vous rapporte des points et débloque de nouveaux défis.",
    },
    {
      title: "💡 Conseil stratégique !",
      content: "Prenez votre temps pour lire chaque question attentivement.",
    },
  ];

  const [step, setStep] = useState(0);

  React.useEffect(() => {
    const timer = setTimeout(
      () => setStep((s) => (s + 1) % steps.length),
      5000
    );
    return () => clearTimeout(timer);
  }, [step, steps.length]);

  return (
    <div className="mb-8 w-full">
      <div className="bg-yellow-50 border-l-4 border-[#FFD700] p-4 rounded-xl shadow-sm">
        <p className="font-bold text-yellow-800 mb-1">
          {steps[step].title}
        </p>
        <p className="text-yellow-700 text-sm">{steps[step].content}</p>
        <div className="flex justify-center gap-1.5 mt-3">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === step ? "bg-[#FFD700] w-4" : "bg-yellow-200"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Composant principal
export const StagiaireQuizAdventure: React.FC<{
  selectedFormationId?: string | null;
}> = ({ selectedFormationId }) => {
  const navigate = useNavigate();
  const { points: userPoints } = useClassementPoints();
  const [historyQuizId, setHistoryQuizId] = useState<number | null>(null);

  // Récupération des données
  const { data: quizzes, isLoading } = useQuery<Quiz[]>({
    queryKey: ["stagiaire-quizzes-adventure"],
    queryFn: () => stagiaireQuizService.getStagiaireQuizzes(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: participations } = useQuery({
    queryKey: ["stagiaire-participations-adventure"],
    queryFn: () => stagiaireQuizService.getStagiaireQuizJoue(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: quizHistory } = useQuery<QuizHistory[]>({
    queryKey: ["quiz-history-adventure"],
    queryFn: () => quizHistoryService.getQuizHistory(),
    staleTime: 5 * 60 * 1000,
    enabled: !!localStorage.getItem("token"),
  });

  const safeQuizHistory = useMemo(() => {
    return Array.isArray(quizHistory) ? quizHistory : [];
  }, [quizHistory]);

  const playedIds = useMemo(() => {
    if (!participations) return new Set<string>();
    const played = new Set<string>();
    participations.forEach((p) => {
      const id = String(p.quizId || p.id || "");
      if (id) played.add(id);
    });
    return played;
  }, [participations]);

  const computed = useMemo(() => {
    if (!quizzes)
      return {
        list: [] as Quiz[],
        playableById: new Map<string, boolean>(),
      };

    const base = buildAvailableQuizzes(
      quizzes,
      userPoints,
      selectedFormationId
    );

    const byIdCompletedAt = new Map<string, number>();
    safeQuizHistory.forEach((h: QuizHistory) => {
      const id = String(h.quizId || "");
      const ts = h.completedAt ? Date.parse(String(h.completedAt)) : 0;
      if (id) byIdCompletedAt.set(id, ts);
    });

    const playedList = base
      .filter((q) => playedIds.has(String(q.id)))
      .sort((a, b) => {
        const da = byIdCompletedAt.get(String(a.id)) || 0;
        const db = byIdCompletedAt.get(String(b.id)) || 0;
        return db - da;
      });

    const unplayedList = base.filter((q) => !playedIds.has(String(q.id)));
    const displayListFull = [...playedList, ...unplayedList];

    const playableById = new Map<string, boolean>();
    for (let i = 0; i < displayListFull.length; i++) {
      const q = displayListFull[i];
      const prevPlayed =
        i === 0 ? true : playedIds.has(String(displayListFull[i - 1].id));
      const hasQuestions = Array.isArray(q.questions)
        ? q.questions.length > 0
        : true;

      playableById.set(
        String(q.id),
        (prevPlayed || playedIds.has(String(q.id))) && hasQuestions
      );
    }

    return {
      list: displayListFull,
      playableById,
    };
  }, [quizzes, userPoints, playedIds, selectedFormationId, safeQuizHistory]);

  const quizRefs = useMemo(
    () => computed.list.map(() => React.createRef<HTMLDivElement>()),
    [computed.list]
  );

  React.useEffect(() => {
    if (computed.list.length > 0) {
      const firstUnplayedIndex = computed.list.findIndex(
        (q) => !playedIds.has(String(q.id))
      );
      if (firstUnplayedIndex !== -1 && quizRefs[firstUnplayedIndex]?.current) {
        quizRefs[firstUnplayedIndex].current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [computed.list, playedIds, quizRefs]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[30vh]">
        <Loader2 className="h-6 w-6 animate-spin text-[#FFB800]" />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center w-full px-2 sm:px-4 max-w-2xl mx-auto">
      <QuizAdventureTutorial />

      <div className="relative w-full space-y-12">
        {/* Timeline Path Line */}
        <div className="absolute left-[15px] sm:left-1/2 sm:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-gray-100 z-0" />

        {computed.list.map((quiz, index) => {
          const quizId = String(quiz.id);
          const played = playedIds.has(quizId);
          const playable = computed.playableById.get(quizId) === true;
          const isLeft = index % 2 !== 0; // Flip every other row on larger screens

          return (
            <div
              ref={quizRefs[index]}
              key={quizId}
              className={cn(
                "relative z-10 flex w-full items-center",
                isLeft ? "sm:flex-row-reverse" : "sm:flex-row"
              )}
            >
              {/* Timeline Node */}
              <div className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 flex items-center justify-center">
                <div className={cn(
                  "w-8 h-8 rounded-full border-2 bg-white flex items-center justify-center shadow-sm transition-colors duration-300",
                  played ? "border-[#FFD700]" : playable ? "border-yellow-200" : "border-gray-200"
                )}>
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    played ? "bg-[#FFD700]" : "bg-transparent"
                  )} />
                </div>
              </div>

              {/* Card Spacer (for desktop zig-zag) */}
              <div className="hidden sm:block sm:w-1/2" />

              {/* Quiz Card Container */}
              <div className={cn(
                "w-full pl-12 sm:pl-0 sm:w-1/2 flex",
                isLeft ? "sm:justify-end sm:pr-10" : "sm:justify-start sm:pl-10"
              )}>
                <AdventureQuizCard
                  quiz={quiz}
                  isPlayable={playable}
                  isPlayed={played}
                  onClick={() => navigate(`/quiz/${quiz.id}`)}
                  onHistoryClick={(e) => {
                    e.stopPropagation();
                    setHistoryQuizId(Number(quiz.id));
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Historique */}
      <QuizHistoryModal 
        quizId={historyQuizId} 
        quizHistory={safeQuizHistory} 
        onClose={() => setHistoryQuizId(null)} 
      />
    </div>
  );
};

// Modal d'historique
function QuizHistoryModal({
  quizId,
  quizHistory,
  onClose
}: {
  quizId: number | null;
  quizHistory: QuizHistory[];
  onClose: () => void;
}) {
  const recentAttempts = quizHistory
    ?.filter((h) => String(h.quizId || "") === String(quizId))
    ?.sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    )
    ?.slice(0, 5);

  return (
    <Dialog open={!!quizId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-[20px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
            <ChartSpline className="text-[#FFB800]" />
            Historique des tentatives
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {recentAttempts && recentAttempts.length > 0 ? (
            recentAttempts.map((attempt, idx) => (
              <div key={idx} className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50 flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg text-gray-800">
                    {Math.round((attempt.score || 0) * 100)}%
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(attempt.completedAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#FFB800]">
                    {attempt.correctAnswers}/{attempt.totalQuestions} pts
                  </p>
                  <p className="text-xs text-gray-500">
                    {Math.floor((attempt.timeSpent || 0) / 60)}m {(attempt.timeSpent || 0) % 60}s
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-gray-400">
              <Lock className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>Aucune tentative enregistrée</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default StagiaireQuizAdventure;
