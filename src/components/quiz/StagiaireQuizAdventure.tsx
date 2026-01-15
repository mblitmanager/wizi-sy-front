import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { stagiaireQuizService } from "@/services/quiz/StagiaireQuizService";
import { quizHistoryService } from "@/services/quiz/submission/QuizHistoryService";
import type { Quiz, QuizHistory } from "@/types/quiz";
import { Loader2, Lock, ChartSpline, Trophy, ArrowUp } from "lucide-react";
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
import { QuizHistoryModal } from "./QuizHistoryModal";
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

// Composant Indicateur de Niveaux Débloqués
import { Sparkles, Zap, Star as StarIcon, TrendingUp } from "lucide-react";

function LevelUnlockIndicator({ userPoints }: { userPoints: number }) {
  const levels = [
    { name: "Débutant", threshold: 0, icon: Sparkles, color: "#10B981" },
    { name: "Intermédiaire", threshold: 50, icon: Zap, color: "#F59E0B" },
    { name: "Avancé", threshold: 100, icon: StarIcon, color: "#EF4444" },
  ];

  const getUnlockedLevel = () => {
    if (userPoints >= 100) return 3;
    if (userPoints >= 50) return 2;
    return 1;
  };

  const unlockedCount = getUnlockedLevel();
  const nextThreshold = unlockedCount === 1 ? 50 : unlockedCount === 2 ? 100 : null;
  const progressToNext = nextThreshold 
    ? Math.min(100, ((userPoints - (nextThreshold === 50 ? 0 : 50)) / (nextThreshold - (nextThreshold === 50 ? 0 : 50))) * 100) 
    : 100;

  return (
    <div className="bg-white/60 backdrop-blur-sm border border-gray-100 rounded-2xl p-3 sm:p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#FFB800]" />
          <span className="text-xs font-bold uppercase text-gray-600">Niveaux Débloqués</span>
        </div>
        <div className="text-[10px] font-bold text-gray-400 uppercase">
          {unlockedCount} / 3
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {levels.map((level, index) => {
          const isUnlocked = userPoints >= level.threshold;
          const Icon = level.icon;
          
          return (
            <div 
              key={level.name} 
              className={cn(
                "flex-1 flex flex-col items-center p-2 sm:p-3 rounded-xl transition-all duration-300",
                isUnlocked 
                  ? "bg-white shadow-md border border-gray-50" 
                  : "bg-gray-50 opacity-50 grayscale"
              )}
            >
              <div 
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1.5",
                  isUnlocked ? "shadow-lg" : "bg-gray-200"
                )}
                style={{ backgroundColor: isUnlocked ? level.color : undefined }}
              >
                <Icon className={cn("w-4 h-4 sm:w-5 sm:h-5", isUnlocked ? "text-white" : "text-gray-400")} />
              </div>
              <span className={cn(
                "text-[9px] sm:text-[10px] font-bold uppercase tracking-tight",
                isUnlocked ? "text-gray-700" : "text-gray-400"
              )}>
                {level.name}
              </span>
              <span className={cn(
                "text-[8px] font-medium mt-0.5",
                isUnlocked ? "text-green-500" : "text-gray-300"
              )}>
                {isUnlocked ? "Débloqué ✓" : `${level.threshold} pts`}
              </span>
            </div>
          );
        })}
      </div>

      {nextThreshold && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] text-gray-500 font-medium">Prochain niveau</span>
            <span className="text-[9px] text-gray-400 font-bold">{userPoints} / {nextThreshold} pts</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#FFB800] to-[#FFD700] rounded-full transition-all duration-500"
              style={{ width: `${progressToNext}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

import { motion, AnimatePresence } from "framer-motion";

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
  const { data: quizzes, isLoading: isQuizzesLoading } = useQuery<Quiz[]>({
    queryKey: ["stagiaire-quizzes-adventure"],
    queryFn: () => stagiaireQuizService.getStagiaireQuizzes(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: participations, isLoading: isParticipationsLoading } = useQuery({
    queryKey: ["stagiaire-participations-adventure"],
    queryFn: () => stagiaireQuizService.getStagiaireQuizJoue(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: quizHistory, isLoading: isHistoryLoading } = useQuery<QuizHistory[]>({
    queryKey: ["quiz-history-adventure"],
    queryFn: () => quizHistoryService.getQuizHistory(),
    staleTime: 5 * 60 * 1000,
    enabled: !!localStorage.getItem("token"),
  });

  const isLoading = isQuizzesLoading || isParticipationsLoading || isHistoryLoading;

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

    const playableById = new Map<string, boolean>();
    for (let i = 0; i < dedupedDisplayList.length; i++) {
      const q = dedupedDisplayList[i];
      const prevPlayed =
        i === 0 ? true : playedIds.has(String(dedupedDisplayList[i - 1].id));
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
        setTimeout(() => {
          quizRefs[firstUnplayedIndex].current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 500);
      }
    }
  }, [computed.list.length, playedIds.size]); // Rely on lengths/sizes for stable dependency

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#FFB800]" />
        <p className="text-gray-500 font-medium animate-pulse">Préparation du parcours de quiz...</p>
      </div>
    );
  }

  const progressPercentage = computed.list.length > 0 
    ? (playedIds.size / computed.list.length) * 100 
    : 0;

  return (
    <div className="relative flex flex-col items-center w-full min-h-screen bg-[#fafafa]">
      {/* Premium Header - Adventure Styled */}
      <div className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="flex flex-col max-w-4xl mx-auto w-full px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between h-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FFB800] rounded-xl flex items-center justify-center shadow-lg shadow-yellow-200 rotation-12">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-900 tracking-tight italic uppercase leading-none">Aventure</h1>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Quiz Express</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1.5 bg-gray-900 text-white px-3 py-1.5 rounded-full shadow-inner">
                  <ChartSpline className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span className="text-xs font-black italic">{userPoints} pts</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress Bar in Header */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-grow h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#FFB800] to-[#FFD700]"
              />
            </div>
            <span className="text-[10px] font-bold text-gray-500 whitespace-nowrap uppercase">
              {playedIds.size} / {computed.list.length} Complétés
            </span>
          </div>
        </div>
      </div>

      {/* Main Adventure Content */}
      <div className="relative flex flex-col items-center w-full px-4 sm:px-6 max-w-4xl mx-auto py-8 sm:py-16 flex-grow overflow-x-hidden">
        {/* Level Unlock Indicator */}
        <div className="w-full mb-8">
          <LevelUnlockIndicator userPoints={userPoints} />
        </div>
        
        {computed.list.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-sm mx-auto">
              <Lock className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun quiz disponible</h3>
              <p className="text-gray-500 text-sm">Inscrivez-vous à des formations pour débloquer votre aventure !</p>
              <Button 
                onClick={() => navigate('/catalogue')}
                className="mt-6 bg-[#FFB800] hover:bg-[#B8860B] text-white rounded-xl font-bold"
              >
                Voir le catalogue
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative w-full">
            {/* Timeline Path Line - Centered */}
            <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-[4px] bg-gray-100 z-0">
               {/* Animated Progress Path */}
               <motion.div 
                 initial={{ height: 0 }}
                 animate={{ height: `${progressPercentage}%` }}
                 transition={{ duration: 1.5, ease: "easeInOut" }}
                 className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#FFB800] to-[#FFD700] rounded-full shadow-[0_0_10px_rgba(255,184,0,0.3)]"
               />
               <div className="absolute top-0 bottom-0 left-0 w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-gray-200/20 to-transparent" />
            </div>

            {/* Quiz List with Alternating Cards */}
            <div className="flex flex-col gap-24 sm:gap-32 relative z-10 w-full">
              {computed.list.map((quiz, index) => {
                const quizId = String(quiz.id);
                const played = playedIds.has(quizId);
                const playable = computed.playableById.get(quizId) === true;
                const isRight = index % 2 === 0;

                const categoryName = (quiz as any).formations?.[0]?.categorie || (quiz as any).formation?.categorie || quiz.categorie || "Formation";
                const categoryConfig = getCategoryConfig(categoryName);

                return (
                  <motion.div
                    ref={quizRefs[index]}
                    key={quizId}
                    initial={{ opacity: 0, x: isRight ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className={cn(
                      "relative flex w-full items-center justify-center",
                      isRight ? "flex-row" : "flex-row-reverse"
                    )}
                  >
                    {/* Timeline Node - Centered relative to the container */}
                    <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-20">
                      <motion.div 
                        whileHover={{ scale: 1.2 }}
                        className={cn(
                          "w-12 h-12 rounded-full border-4 bg-white flex items-center justify-center shadow-lg transition-all duration-300",
                          !played && !playable ? "opacity-30 border-gray-100 scale-90" : "scale-100"
                        )}
                        style={{
                          borderColor: played ? categoryConfig.color : (playable ? '#FFB800' : '#E5E7EB'),
                          boxShadow: played ? `0 0 20px ${categoryConfig.color}40` : (playable ? '0 0 20px rgba(255,184,0,0.3)' : 'none')
                        }}
                      >
                        <div className={cn(
                          "w-5 h-5 rounded-full transition-all duration-300",
                          played || playable ? "animate-pulse" : "bg-transparent scale-0"
                        )} 
                        style={{
                          backgroundColor: played ? categoryConfig.color : (playable ? '#FFB800' : undefined)
                        }} />
                        
                        {/* Number Indicator */}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded-full border border-gray-100 shadow-sm">
                          <span className="text-[10px] font-black italic text-gray-400">#{(index + 1).toString().padStart(2, '0')}</span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Card Side */}
                    <div className={cn(
                      "w-[48%] flex",
                      isRight ? "justify-start pl-8 sm:pl-16" : "justify-end pr-8 sm:pr-16"
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
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modals & Overlays */}
      <AnimatePresence>
        {historyQuizId && (
          <QuizHistoryModal 
            quizId={historyQuizId} 
            quizTitle={computed.list.find(q => Number(q.id) === historyQuizId)?.titre}
            quizHistory={safeQuizHistory} 
            onClose={() => setHistoryQuizId(null)} 
          />
        )}
      </AnimatePresence>

      {/* Floating Action Button - Back to Top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-10 right-10 z-50 w-14 h-14 bg-gray-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-[#FFB800] transition-colors group"
          >
            <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StagiaireQuizAdventure;
