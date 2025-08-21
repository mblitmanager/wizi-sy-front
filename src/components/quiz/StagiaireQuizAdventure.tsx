import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { stagiaireQuizService } from "@/services/quiz/StagiaireQuizService";
import { quizHistoryService } from "@/services/quiz/submission/QuizHistoryService";
import type { Quiz, QuizHistory } from "@/types/quiz";
import { Loader2, Lock } from "lucide-react";
import { useClassementPoints } from "@/hooks/useClassementPoints";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type Participation = { id?: string | number; quizId?: string | number };

export const StagiaireQuizAdventure: React.FC<{ selectedFormationId?: string | null }> = ({ selectedFormationId }) => {
  const { points: userPoints } = useClassementPoints();
  const [showAllForFormation, setShowAllForFormation] = useState(false);

  const { data: quizzes, isLoading } = useQuery<Quiz[]>({
    queryKey: ["stagiaire-quizzes-adventure"],
    queryFn: () => stagiaireQuizService.getStagiaireQuizzes(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: participations } = useQuery<Participation[]>({
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

  const playedIds = useMemo(() => {
    if (!participations) return new Set<string>();
    const s = new Set<string>();
    participations.forEach((p) => {
      const id = String(p.quizId || p.id || "");
      if (id) s.add(id);
    });
    return s;
  }, [participations]);

  const computed = useMemo(() => {
    if (!quizzes) return { list: [] as Quiz[], playableById: new Map<string, boolean>(), avatarId: undefined as undefined | string };

    const normalizeLevel = (lvl?: string) => {
      if (!lvl) return "débutant";
      const l = lvl.toLowerCase();
      if (l.includes("inter") || l.includes("moyen")) return "intermédiaire";
      if (l.includes("avancé") || l.includes("expert")) return "avancé";
      return "débutant";
    };

    const filterByPoints = (all: Quiz[]) => {
      const debutant = all.filter((q) => normalizeLevel(q.niveau) === "débutant");
      const inter = all.filter((q) => normalizeLevel(q.niveau) === "intermédiaire");
      const avance = all.filter((q) => normalizeLevel(q.niveau) === "avancé");
      if (userPoints < 10) return debutant.slice(0, 2);
      if (userPoints < 20) return debutant.slice(0, 4);
      if (userPoints < 40) return [...debutant, ...inter.slice(0, 2)];
      if (userPoints < 60) return [...debutant, ...inter];
      if (userPoints < 80) return [...debutant, ...inter, ...avance.slice(0, 2)];
      if (userPoints < 100) return [...debutant, ...inter, ...avance.slice(0, 4)];
      return [...debutant, ...inter, ...avance];
    };

    let filtered = filterByPoints(quizzes);
    if (selectedFormationId) {
      filtered = filtered.filter((q) => String((q as any).formationId) === String(selectedFormationId));
    }

    const byIdCompletedAt = new Map<string, number>();
    (quizHistory || []).forEach((h) => {
      const id = String((h as any).quizId ?? h.quiz?.id);
      const ts = h.completedAt ? Date.parse(h.completedAt as any) : 0;
      if (id) byIdCompletedAt.set(id, ts);
    });

    const playedList = filtered
      .filter((q) => playedIds.has(String(q.id)))
      .sort((a, b) => {
        const da = byIdCompletedAt.get(String(a.id)) || 0;
        const db = byIdCompletedAt.get(String(b.id)) || 0;
        return db - da;
      });
    const unplayedList = filtered.filter((q) => !playedIds.has(String(q.id)));
    const displayListFull = [...playedList, ...unplayedList];

    const playableById = new Map<string, boolean>();
    for (let i = 0; i < displayListFull.length; i++) {
      const q = displayListFull[i];
      const prevPlayed = i === 0 ? true : playedIds.has(String(displayListFull[i - 1].id));
      const hasQuestions = Array.isArray(q.questions) ? q.questions.length > 0 : true;
      playableById.set(String(q.id), (prevPlayed || playedIds.has(String(q.id))) && hasQuestions);
    }

    let avatarId: string | undefined = undefined;
    if (displayListFull.length) {
      let lastPlayedIdx = -1;
      for (let k = 0; k < displayListFull.length; k++) {
        if (playedIds.has(String(displayListFull[k].id))) lastPlayedIdx = k;
      }
      if (lastPlayedIdx >= 0) {
        avatarId = String(displayListFull[lastPlayedIdx].id);
        if (lastPlayedIdx < displayListFull.length - 1 && !playedIds.has(String(displayListFull[lastPlayedIdx + 1].id))) {
          avatarId = String(displayListFull[lastPlayedIdx + 1].id);
        }
      } else {
        avatarId = String(displayListFull[0].id);
      }
    }

    const displayList = !selectedFormationId || showAllForFormation || displayListFull.length <= 10
      ? displayListFull
      : displayListFull.slice(0, 10);

    return { list: displayList, playableById, avatarId, canShowMore: !!selectedFormationId && displayListFull.length > 10 } as any;
  }, [quizzes, userPoints, playedIds, selectedFormationId, quizHistory, showAllForFormation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[30vh]">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!computed.list.length) {
    return (
      <>
        {selectedFormationId && (
          <div className="mb-2 text-sm text-gray-600">Formation sélectionnée : {selectedFormationId}</div>
        )}
        <div className="text-center text-gray-500">Aucun quiz disponible</div>
      </>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl sm:text-2xl md:text-3xl text-brown-shade font-bold">Quiz</h2>

      {computed.list.map((quiz, index) => {
        const isLeft = index % 2 === 0;
        const played = playedIds.has(String(quiz.id));
        const playable = computed.playableById.get(String(quiz.id)) === true;
        const nodeColor = played ? "bg-amber-400" : playable ? "bg-blue-500" : "bg-gray-300";

        const h = quizHistory?.find(
          (x) => String(x.quizId ?? x.quiz?.id) === String(quiz.id)
        );

        return (
          <div key={quiz.id} className="flex items-start gap-3">
            {!isLeft ? (
              <div className="flex-1" />
            ) : (
              <div className="flex-1">
                <QuizStepCard quiz={quiz} playable={playable} played={played} history={h} quizHistory={quizHistory ?? []} />
              </div>
            )}

            {/* Timeline */}
            <div className="w-14 flex flex-col items-center">
              <div className="h-4 w-0.5 bg-gray-200" />
              <div className={`relative w-6 h-6 rounded-full border-2 border-white ${nodeColor}`}>
                {computed.avatarId && String(quiz.id) === computed.avatarId && (
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-8 h-8">
                    <img src="/assets/wizi-learn-logo.png" alt="avatar" className="w-8 h-8 object-contain" />
                  </div>
                )}
              </div>
              <div className="h-10 w-0.5 bg-gray-200" />
            </div>

            {isLeft ? (
              <div className="flex-1" />
            ) : (
              <div className="flex-1">
                <QuizStepCard quiz={quiz} playable={playable} played={played} history={h} quizHistory={quizHistory ?? []} />
              </div>
            )}
          </div>
        );
      })}

      {computed.canShowMore && !showAllForFormation && (
        <div className="flex justify-end">
          <button
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            onClick={() => setShowAllForFormation(true)}
          >
            Voir plus
          </button>
        </div>
      )}
    </div>
  );
};

function QuizStepCard({ quiz, playable, played, history, quizHistory }: { quiz: Quiz; playable: boolean; played: boolean; history?: QuizHistory; quizHistory: QuizHistory[] }) {
  const total = history?.totalQuestions || quiz.questions?.length || 0;
  const correct = history?.correctAnswers || 0;
  const percent = total ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="p-4 border rounded-md shadow-sm bg-white space-y-2">
      <h3 className="font-semibold">{quiz.title}</h3>
      <p className="text-sm text-gray-500">{quiz.niveau}</p>
      <div className="flex gap-2">
        <Button size="sm" disabled={!playable}>🔄 Rejouer</Button>
        <QuizHistoryModal quizId={quiz.id} quizHistory={quizHistory} />
      </div>
      {played && (
        <p className="text-sm text-gray-600">Dernier score : {correct}/{total} ({percent}%)</p>
      )}
    </div>
  );
}

function QuizHistoryModal({ quizId, quizHistory }: { quizId: number; quizHistory: QuizHistory[] }) {
  const [open, setOpen] = useState(false);

  const last3 = quizHistory
    ?.filter((h) => String(h.quizId ?? h.quiz?.id) === String(quizId))
    ?.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    ?.slice(0, 3);

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
            last3.map((h, idx) => (
              <div key={idx} className="p-2 border rounded-md shadow-sm flex justify-between">
                <div>
                  <p className="text-sm">Tentative {idx + 1}</p>
                  <p className="text-xs text-gray-500">{new Date(h.completedAt).toLocaleString()}</p>
                </div>
                <div className="text-sm font-medium">{h.correctAnswers}/{h.totalQuestions}</div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center">Aucun historique trouvé.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}


export default StagiaireQuizAdventure;
