import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { stagiaireQuizService } from "@/services/quiz/StagiaireQuizService";
import { quizHistoryService } from "@/services/quiz/submission/QuizHistoryService";
import type { Quiz, QuizHistory } from "@/types/quiz";
import { Loader2, Lock } from "lucide-react";
import { useClassementPoints } from "@/hooks/useClassementPoints";

// Affichage inspiré de l'aventure Flutter: timeline, nœuds et carte à gauche/droite

type Participation = { id?: string | number; quizId?: string | number };

export const StagiaireQuizAdventure: React.FC = () => {
    const { points: userPoints } = useClassementPoints();

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

        const isAllowedByPoints = (level?: string) => {
            const lvl = normalizeLevel(level);
            if (userPoints < 10) return lvl === "débutant";
            if (userPoints < 20) return lvl === "débutant";
            if (userPoints < 40) return lvl === "débutant" || lvl === "intermédiaire"; // partiel géré par séquence
            if (userPoints < 60) return lvl === "débutant" || lvl === "intermédiaire";
            if (userPoints < 80) return true; // accès avancé partiel géré par séquence
            if (userPoints < 100) return true;
            return true;
        };

        // Déterminer jouabilité séquentielle parmi les QUIZ autorisés par points
        const allowed: Quiz[] = quizzes.filter((q) => isAllowedByPoints(q.niveau));

        // Jouabilité séquentielle calculée sur l'ordre d'origine
        const playableById = new Map<string, boolean>();
        for (let k = 0; k < allowed.length; k++) {
            const prevId = k === 0 ? undefined : String(allowed[k - 1].id);
            const prevPlayed = k === 0 ? true : playedIds.has(prevId!);
            const q = allowed[k];
            const hasQuestions = Array.isArray(q.questions) ? q.questions.length > 0 : true;
            playableById.set(String(q.id), prevPlayed && hasQuestions);
        }

        // Avatar: dernier joué ou prochain autorisé
        let lastPlayedIdx = 0;
        for (let k = 0; k < allowed.length; k++) {
            if (playedIds.has(String(allowed[k].id))) lastPlayedIdx = k;
        }
        let avatarId: string | undefined = allowed.length ? String(allowed[lastPlayedIdx].id) : undefined;
        if (lastPlayedIdx < allowed.length - 1 && !playedIds.has(String(allowed[lastPlayedIdx + 1].id))) {
            avatarId = String(allowed[lastPlayedIdx + 1].id);
        }

        // Réordonner l'affichage: joués en premier, triés par date desc si historique disponible
        // Ici, on ne dispose pas des dates directement; le parent fournit l'historique ailleurs.
        // On garde l'ordre d'origine pour les non joués.
        const playedList = quizzes.filter((q) => playedIds.has(String(q.id)));
        const unplayedList = quizzes.filter((q) => !playedIds.has(String(q.id)));
        const displayList = [...playedList, ...unplayedList];

        return { list: displayList, playableById, avatarId };
    }, [quizzes, userPoints, playedIds]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[30vh]">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        );
    }

    if (!computed.list.length) {
        return <div className="text-center text-gray-500">Aucun quiz disponible</div>;
    }

    return (
        <div className="space-y-6">
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


