import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { stagiaireQuizService } from "@/services/quiz/StagiaireQuizService";
import { quizHistoryService } from "@/services/quiz/submission/QuizHistoryService";
import type { Quiz, QuizHistory } from "@/types/quiz";
import { Loader2, Lock } from "lucide-react";
import { useClassementPoints } from "@/hooks/useClassementPoints";

// Affichage inspiré de l'aventure Flutter: timeline, nœuds et carte à gauche/droite

type Participation = { id?: string | number; quizId?: string | number };

export const StagiaireQuizAdventure: React.FC<{ selectedFormationId?: string | null }> = ({ selectedFormationId }) => {
    const { points: userPoints } = useClassementPoints();
    const [showAllForFormation, setShowAllForFormation] = useState(false);

    const { data: quizzes, isLoading } = useQuery<Quiz[]>({
        queryKey: ["stagiaire-quizzes-adventure"],
        queryFn: () => stagiaireQuizService.getStagiaireQuizzes(),
        staleTime: 5 * 60 * 1000,
    });
    // console.log("Quizzes loaded:", quizzes);
    const { data: participations } = useQuery<Participation[]>({
        queryKey: ["stagiaire-participations-adventure"],
        queryFn: () => stagiaireQuizService.getStagiaireQuizJoue(),
        staleTime: 5 * 60 * 1000,
    });
    // console.log("Quizzes participations:", quizzes);
    const { data: quizHistory } = useQuery<QuizHistory[]>({
        queryKey: ["quiz-history-adventure"],
        queryFn: () => quizHistoryService.getQuizHistory(),
        staleTime: 5 * 60 * 1000,
        enabled: !!localStorage.getItem("token"),
    });
    console.log("Quiz History:", quizHistory);

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

        // Avatar: dernier joué ou prochain débloqué
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
            <h2 className="text-3xl sm:text-2xl md:text-3xl text-brown-shade font-bold">
          Quiz
        </h2>
            {/* {selectedFormationId && (
                <div className="mb-2 text-sm text-gray-600">Formation sélectionnée : {selectedFormationId}</div>
            )} */}
            {/* Bandeau stats simple */}
            {/* <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <div className="text-sm font-semibold text-amber-800">Points: {userPoints}</div>
                {quizHistory && (
                    <div className="text-xs text-amber-800">• Quiz joués: {quizHistory.length}</div>
                )}
            </div> */}
            {computed.list.map((quiz, index) => {
                const isLeft = index % 2 === 0;
                const played = playedIds.has(String(quiz.id));
                const playable = computed.playableById.get(String(quiz.id)) === true;
                const nodeColor = played ? "bg-amber-400" : playable ? "bg-blue-500" : "bg-gray-300";
                const h = quizHistory?.find((x) => String(x.quizId) === String(quiz.id));

                return (
                    <div key={quiz.id} className="flex items-start gap-3">
                        {!isLeft ? (
                            <div className="flex-1" />
                        ) : (
                            <div className="flex-1">
                                <QuizStepCard quiz={quiz} playable={playable} played={played} history={h} />
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
                                <QuizStepCard quiz={quiz} playable={playable} played={played} history={h} />
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

function QuizStepCard({ quiz, playable, played, history }: { quiz: Quiz; playable: boolean; played: boolean; history?: QuizHistory }) {
    const total = history?.totalQuestions || quiz.questions?.length || 0;
    const correct = history?.correctAnswers || 0;
    const percent = total ? Math.round((correct / total) * 100) : 0;
    const dateLabel = history?.completedAt
        ? new Date(history.completedAt).toLocaleDateString("fr-FR")
        : null;
    return (
        <div className={`relative rounded-xl border shadow-sm p-4 ${playable ? "opacity-100" : "opacity-80"}`}>
            {!playable && !played && (
                <div className="absolute top-2 right-2 text-gray-400">
                    <Lock className="w-4 h-4" />
                </div>
            )}
            
            <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white">
                    <span className="text-sm">QZ</span>
                </div>
                <div className="flex-1">
                    <div className="font-semibold text-gray-800 line-clamp-2">{quiz.titre}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{quiz.categorie}</div>
                    <div className="text-xs text-gray-500">{quiz.niveau}</div>
                    {history && (
                        <div className="mt-2 text-xs text-gray-700 flex items-center gap-3">
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                                {percent}%
                            </span>
                            <span>
                                {correct}/{total} bonnes réponses{dateLabel ? ` • ${dateLabel}` : ""}
                            </span>
                        </div>
                    )}
                    {(playable || played) && (
                        <div className="mt-2">
                            <a href={`/quiz/${quiz.id}`} className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md inline-block">
                                {played ? 'Rejouer' : 'Commencer'}
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StagiaireQuizAdventure;


