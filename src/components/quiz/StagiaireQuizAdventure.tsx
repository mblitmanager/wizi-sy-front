import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { stagiaireQuizService } from "@/services/quiz/StagiaireQuizService";
import { quizHistoryService } from "@/services/quiz/submission/QuizHistoryService";
import type { Quiz, QuizHistory } from "@/types/quiz";
import { Loader2, Lock, ChartSpline, Trophy } from "lucide-react";
import { useClassementPoints } from "@/hooks/useClassementPoints";
import { buildAvailableQuizzes } from "./quizUtils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getCategoryConfig } from "@/utils/quizColors";
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

import { ArrowUp } from "lucide-react";
import { QuizHistoryModal } from "./QuizHistoryModal";

// Composant principal
export const StagiaireQuizAdventure: React.FC<{
  selectedFormationId?: string | null;
}> = ({ selectedFormationId }) => {
  const navigate = useNavigate();
  const { points: userPoints } = useClassementPoints();
  const [historyQuizId, setHistoryQuizId] = useState<number | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Scroll to top visibility
  React.useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

    // Remove potential duplicates preserving order (defensive)
    const seen = new Set<string>();
    const dedupedDisplayList: Quiz[] = [];
    for (const q of displayListFull) {
      const id = String(q.id);
      if (!seen.has(id)) {
        seen.add(id);
        dedupedDisplayList.push(q);
      }
    }

    if (dedupedDisplayList.length !== displayListFull.length) {
      console.warn("StagiaireQuizAdventure: duplicated quizzes detected and removed", {
        originalCount: displayListFull.length,
        dedupedCount: dedupedDisplayList.length,
      });
    }

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
      list: dedupedDisplayList,
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
    <div className="relative flex flex-col items-center w-full min-h-screen bg-gray-50/10">
      {/* Sticky Top Header - Flutter Style */}
      {/* <div className="sticky top-0 z-50 w-full bg-[#FFB800] text-white shadow-md">
        <div className="flex items-center justify-between px-4 h-16 max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
              <ArrowUp className="w-6 h-6 -rotate-90" />
            </button>
            <h1 className="text-xl font-bold italic tracking-tight uppercase">Quiz</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full whitespace-nowrap">
              <span className="text-sm font-black italic">{userPoints} points</span>
            </div>
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6" />
              <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-xs font-bold font-mono">?</span>
              </div>
              <div className="w-10 h-6 rounded-full bg-black relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white" />
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Adventure Content */}
      <div className="relative flex flex-col items-center w-full px-4 sm:px-6 max-w-4xl mx-auto py-12 flex-grow">
        <div className="relative w-full">
          {/* Timeline Path Line - Centered */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[3px] bg-gray-200/50 z-0" />

          {/* Quiz List with Alternating Cards */}
          <div className="flex flex-col gap-16 sm:gap-24 relative z-10 w-full">
            {computed.list.map((quiz, index) => {
              const quizId = String(quiz.id);
              const played = playedIds.has(quizId);
              const playable = computed.playableById.get(quizId) === true;
              const isRight = index % 2 === 0;

              const categoryName = (quiz as any).formations?.[0]?.categorie || (quiz as any).formation?.categorie || quiz.categorie || "Formation";
              const categoryConfig = getCategoryConfig(categoryName);

              return (
                <div
                  ref={quizRefs[index]}
                  key={quizId}
                  className={cn(
                    "relative flex w-full items-center justify-center",
                    isRight ? "flex-row" : "flex-row-reverse"
                  )}
                >
                  {/* Timeline Node - Centered relative to the container */}
                  <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-20">
                    <div 
                      className={cn(
                        "w-10 h-10 rounded-full border-4 bg-white flex items-center justify-center shadow-md transition-all duration-300",
                        !played && !playable ? "opacity-50 border-gray-100" : ""
                      )}
                      style={{
                        borderColor: played ? categoryConfig.color : (playable ? '#FFB800' : undefined)
                      }}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded-full transition-all duration-300",
                        played || playable ? "" : "bg-transparent"
                      )} 
                      style={{
                        backgroundColor: played ? categoryConfig.color : (playable ? '#FFB800' : undefined)
                      }} />
                    </div>
                  </div>

                  {/* Card Side */}
                  <div className={cn(
                    "w-[48%] flex",
                    isRight ? "justify-start pl-6 sm:pl-10" : "justify-end pr-6 sm:pr-10"
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

                  {/* Empty Side (Spacer) */}
                  <div className="w-[45%] hidden sm:block" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modals & Overlays */}
      <QuizHistoryModal 
        quizId={historyQuizId} 
        quizTitle={computed.list.find(q => Number(q.id) === historyQuizId)?.titre}
        quizHistory={safeQuizHistory} 
        onClose={() => setHistoryQuizId(null)} 
      />

      {/* Floating Action Button - Back to Top */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-6 z-50 p-4 bg-[#FFB800] text-white rounded-full shadow-lg hover:bg-[#B8860B] transition-all duration-300 animate-bounce"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default StagiaireQuizAdventure;
