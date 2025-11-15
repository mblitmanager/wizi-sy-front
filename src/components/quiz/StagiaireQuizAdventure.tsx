import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { QuizCard } from "./QuizCard";

// Configuration des catégories
const CATEGORY_CONFIG = {
  bureautique: {
    color: "bg-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-800",
  },
  internet: {
    color: "bg-orange-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    textColor: "text-orange-800",
  },
  création: {
    color: "bg-purple-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-800",
  },
  IA: {
    color: "bg-green-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-800",
  },
  langues: {
    color: "bg-pink-500",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    textColor: "text-pink-800",
  },
  anglais: {
    color: "bg-emerald-500",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-800",
  },
  français: {
    color: "bg-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-800",
  },
  default: {
    color: "bg-gray-400",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    textColor: "text-slate-800",
  },
};

// Helpers
function getCategoryConfig(categoryName: string | undefined) {
  if (!categoryName) return CATEGORY_CONFIG.default;
  const lowerName = categoryName.toLowerCase();
  for (const [key, config] of Object.entries(CATEGORY_CONFIG)) {
    if (lowerName.includes(key)) {
      return config;
    }
  }
  return CATEGORY_CONFIG.default;
}

function getLevelConfig(level: string | undefined) {
  switch (level?.toLowerCase()) {
    case "débutant":
      return { bgClass: "bg-green-100", textClass: "text-green-800" };
    case "intermédiaire":
      return { bgClass: "bg-blue-100", textClass: "text-blue-800" };
    case "avancé":
    case "super quiz":
      return { bgClass: "bg-yellow-100", textClass: "text-yellow-800" };
    default:
      return { bgClass: "bg-gray-100", textClass: "text-gray-800" };
  }
}

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
    <div className="mb-6 w-full">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded shadow-sm">
        <p className="font-semibold text-yellow-800 mb-1">
          {steps[step].title}
        </p>
        <p className="text-yellow-700 text-sm">{steps[step].content}</p>
        <div className="flex justify-center gap-1 mt-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === step ? "bg-yellow-600" : "bg-yellow-300"
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
  const { points: userPoints } = useClassementPoints();

  // Récupération des données - CORRECTION: Retour à l'ancienne structure de queryKey
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

  // IDs des quiz déjà joués
  const playedIds = useMemo(() => {
    if (!participations) return new Set<string>();
    const played = new Set<string>();
    participations.forEach((p) => {
      const id = String(p.quizId || p.id || "");
      if (id) played.add(id);
    });
    return played;
  }, [participations]);

  // CORRECTION: Retour à la logique originale qui fonctionnait
  const computed = useMemo(() => {
    if (!quizzes)
      return {
        list: [] as Quiz[],
        playableById: new Map<string, boolean>(),
        avatarId: undefined as undefined | string,
      };

    // Use shared selection logic - IMPORTANT: utiliser quizzes directement
    const base = buildAvailableQuizzes(
      quizzes, // Utiliser quizzes directement, pas filteredQuizzes
      userPoints,
      selectedFormationId
    );

    const byIdCompletedAt = new Map<string, number>();
    (quizHistory || []).forEach((h: QuizHistory) => {
      const id = String(h.quizId ?? h.quiz?.id ?? "");
      const ts = h.completedAt ? Date.parse(String(h.completedAt)) : 0;
      if (id) byIdCompletedAt.set(id, ts);
    });

    // CORRECTION: Logique d'organisation des quiz joués/non joués
    const playedList = base
      .filter((q) => playedIds.has(String(q.id)))
      .sort((a, b) => {
        const da = byIdCompletedAt.get(String(a.id)) || 0;
        const db = byIdCompletedAt.get(String(b.id)) || 0;
        return db - da; // Tri antéchronologique
      });

    const unplayedList = base.filter((q) => !playedIds.has(String(q.id)));

    // Combiner: d'abord les joués (triés), puis les non joués
    const displayListFull = [...playedList, ...unplayedList];

    // Déterminer quels quiz sont jouables
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

    // Déterminer l'avatar (quiz actuel)
    let avatarId: string | undefined = undefined;
    if (displayListFull.length) {
      let lastPlayedIdx = -1;
      for (let k = 0; k < displayListFull.length; k++) {
        if (playedIds.has(String(displayListFull[k].id))) lastPlayedIdx = k;
      }

      if (lastPlayedIdx >= 0) {
        avatarId = String(displayListFull[lastPlayedIdx].id);
        if (
          lastPlayedIdx < displayListFull.length - 1 &&
          !playedIds.has(String(displayListFull[lastPlayedIdx + 1].id))
        ) {
          avatarId = String(displayListFull[lastPlayedIdx + 1].id);
        }
      } else {
        avatarId = String(displayListFull[0].id);
      }
    }

    return {
      list: displayListFull,
      playableById,
      avatarId,
    };
  }, [quizzes, userPoints, playedIds, selectedFormationId, quizHistory]);

  // Références pour le scroll
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
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!computed.list.length) {
    return (
      <div className="text-center py-8">
        {selectedFormationId ? (
          <div className="space-y-2">
            <div className="text-gray-500">
              Aucun quiz disponible pour cette formation
            </div>
            <div className="text-sm text-gray-400">
              Formation ID: {selectedFormationId}
            </div>
          </div>
        ) : (
          <div className="text-gray-500">Aucun quiz disponible</div>
        )}
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center space-y-8">
      <QuizAdventureTutorial />

      {computed.list.map((quiz, index) => {
        const quizId = String(quiz.id);
        const played = playedIds.has(quizId);
        const playable = computed.playableById.get(quizId) === true;
        const categoryConfig = getCategoryConfig(quiz.categorie);
        const history = quizHistory?.find(
          (x) => String(x.quizId ?? x.quiz?.id) === quizId
        );
        const isLeft = index % 2 === 0;

        return (
          <div
            ref={quizRefs[index]}
            key={quizId}
            className="flex flex-col items-center w-full">
            {/* Timeline */}
            <div className="flex flex-col items-center w-full mb-2">
              {index > 0 && <div className="w-0.5 h-6 bg-gray-300" />}
              <div
                className={`relative w-8 h-8 rounded-full border-2 border-white ${categoryConfig.color} z-10 flex items-center justify-center`}>
                {computed.avatarId && String(quiz.id) === computed.avatarId && (
                  <img
                    src="/logons.png"
                    alt="avatar"
                    className="w-8 h-8 object-contain absolute -top-8 left-1/2 -translate-x-1/2"
                  />
                )}
              </div>
              {index < computed.list.length - 1 && (
                <div className="w-0.5 h-6 bg-gray-300" />
              )}
            </div>

            {/* Carte du quiz */}
            <div
              className={`w-full flex ${
                isLeft ? "justify-start" : "justify-end"
              }`}>
              <div className="w-full max-w-xs sm:max-w-sm md:max-w-xl">
                <div className="relative">
                  {/* Indicateur de verrouillage */}
                  {!playable && !played && (
                    <div className="absolute inset-0 bg-gray-100 bg-opacity-80 rounded-lg z-10 flex items-center justify-center">
                      <div className="text-center p-4">
                        <Lock className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                        <p className="text-gray-600 font-medium">
                          Quiz verrouillé
                        </p>
                        <p className="text-gray-500 text-sm">
                          Terminez les quiz précédents pour débloquer
                        </p>
                      </div>
                    </div>
                  )}

                  {/* CORRECTION: Utilisation correcte de QuizCard */}
                  <QuizCard
                    quiz={quiz}
                    categories={[]}
                    history={history ? [history] : []}
                    // Pas besoin de onStartQuiz car QuizCard gère déjà la navigation via Link
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Modal d'historique (optionnel)
function QuizHistoryModal({
  quizId,
  quizHistory,
}: {
  quizId: number;
  quizHistory: QuizHistory[];
}) {
  const [open, setOpen] = useState(false);

  const recentAttempts = quizHistory
    ?.filter((h) => String(h.quizId ?? h.quiz?.id) === String(quizId))
    ?.sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    )
    ?.slice(0, 3);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <ChartSpline size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Historique des tentatives</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {recentAttempts && recentAttempts.length > 0 ? (
            recentAttempts.map((attempt, idx) => (
              <div key={idx} className="p-3 border rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      Score: {Math.round((attempt.score || 0) * 100)}%
                    </p>
                    <p className="text-sm text-gray-500">
                      {attempt.correctAnswers}/{attempt.totalQuestions}{" "}
                      questions
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(attempt.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-sm text-gray-600">
                    {attempt.timeSpent}s
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">Aucun historique</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default StagiaireQuizAdventure;
