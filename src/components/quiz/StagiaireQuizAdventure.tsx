import React, { useMemo, useState } from "react";
// Logique de configuration des catégories (copiée de QuizCard)
// Helpers pour la coloration des niveaux
function getLevelConfig(level: string | undefined) {
    switch (level?.toLowerCase()) {
        case "débutant":
            return {
                bgClass: "bg-green-100",
                textClass: "text-green-800",
            };
        case "intermédiaire":
            return {
                bgClass: "bg-blue-100",
                textClass: "text-blue-800",
            };
        case "avancé":
        case "super quiz":
            return {
                bgClass: "bg-yellow-100",
                textClass: "text-yellow-800",
            };
        default:
            return {
                bgClass: "bg-gray-100",
                textClass: "text-gray-800",
            };
    }
}
const CATEGORY_CONFIG = {
    bureautique: {
        color: "bg-blue-500",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-800",
        badgeColor: "bg-blue-100",
    },
    internet: {
        color: "bg-orange-500",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        textColor: "text-orange-800",
        badgeColor: "bg-orange-100",
    },
    création: {
        color: "bg-purple-500",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        textColor: "text-purple-800",
        badgeColor: "bg-purple-100",
    },
    langues: {
        color: "bg-pink-500",
        bgColor: "bg-pink-50",
        borderColor: "border-pink-200",
        textColor: "text-pink-800",
        badgeColor: "bg-pink-100",
    },
    anglais: {
        color: "bg-emerald-500",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        textColor: "text-emerald-800",
        badgeColor: "bg-emerald-100",
    },
    français: {
        color: "bg-red-500",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        textColor: "text-red-800",
        badgeColor: "bg-red-100",
    },
    default: {
        color: "bg-gray-400",
        bgColor: "bg-slate-50",
        borderColor: "border-slate-200",
        textColor: "text-slate-800",
        badgeColor: "bg-slate-100",
    },
};

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
import { useQuery } from "@tanstack/react-query";
import { stagiaireQuizService } from "@/services/quiz/StagiaireQuizService";
import { quizHistoryService } from "@/services/quiz/submission/QuizHistoryService";
import type { Quiz, QuizHistory } from "@/types/quiz";
import { Loader2, Lock, ChartSpline } from "lucide-react";
import { useClassementPoints } from "@/hooks/useClassementPoints";
import { buildAvailableQuizzes } from "./quizUtils";
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

        // Use shared selection logic
        const base = buildAvailableQuizzes(quizzes, userPoints, selectedFormationId);

        const byIdCompletedAt = new Map<string, number>();
        (quizHistory || []).forEach((h: QuizHistory) => {
            const id = String(h.quizId ?? h.quiz?.id ?? "");
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

        return { list: displayList, playableById, avatarId, canShowMore: !!selectedFormationId && displayListFull.length > 10 };
    }, [quizzes, userPoints, playedIds, selectedFormationId, quizHistory, showAllForFormation]);

    // Refs for each quiz card (always called)
    const quizRefs = useMemo(() => computed.list.map(() => React.createRef<HTMLDivElement>()), [computed.list]);

    React.useEffect(() => {
        // Find first unplayed quiz and scroll to it
        if (!computed.list.length) return;
        const firstUnplayedIdx = computed.list.findIndex(q => !playedIds.has(String(q.id)));
        if (firstUnplayedIdx !== -1 && quizRefs[firstUnplayedIdx]?.current) {
            quizRefs[firstUnplayedIdx].current.scrollIntoView({ behavior: "smooth", block: "center" });
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
            <>
                {selectedFormationId && (
                    <div className="mb-2 text-sm text-gray-600">Formation sélectionnée : {selectedFormationId}</div>
                )}
                <div className="text-center text-gray-500">Aucun quiz disponible</div>
            </>
        );
    }

    return (
        <div className="relative flex flex-col items-center space-y-8">
            {/* Timeline fil central pour chaque carte, tous écrans */}
            {computed.list.map((quiz, index) => {
                const played = playedIds.has(String(quiz.id));
                const playable = computed.playableById.get(String(quiz.id)) === true;
                const categoryConfig = getCategoryConfig(quiz.categorie);
                const h = quizHistory?.find((x) => String(x.quizId ?? x.quiz?.id) === String(quiz.id));
                const isLeft = index % 2 === 0;

                return (
                    <div ref={quizRefs[index]} key={quiz.id} className="flex flex-col items-center w-full">
                        {/* Timeline fil central au-dessus de la carte */}
                        <div className="flex flex-col items-center w-full mb-2">
                            {/* Fil montant si pas le premier */}
                            {index > 0 && <div className="w-0.5 h-6 bg-gray-300" />}
                            <div className={`relative w-8 h-8 rounded-full border-2 border-white ${categoryConfig.color} z-10 flex items-center justify-center`}>
                                {computed.avatarId && String(quiz.id) === computed.avatarId && (
                                    <img src="/assets/logo.png" alt="avatar" className="w-8 h-8 object-contain absolute -top-8 left-1/2 -translate-x-1/2" />
                                )}
                            </div>

                            {index < computed.list.length && <div className="w-0.5 h-6 bg-gray-300" />}
                        </div>
                        {/* Effet gauche/droite sur mobile: responsive width et alternance alignement */}
                        <div className={`w-full flex ${isLeft ? 'justify-start' : 'justify-end'}`}>
                            <div className="w-full max-w-xs sm:max-w-sm md:max-w-xl">
                                <QuizStepCard quiz={quiz} playable={playable} played={played} history={h} quizHistory={quizHistory ?? []} categoryConfig={categoryConfig} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

type QuizHistoryItemMinimal = {
    totalQuestions?: number;
    correctAnswers?: number;
    completedAt?: string;
};

type QuizStepCardProps = {
    quiz: Quiz;
    playable: boolean;
    played: boolean;
    history?: QuizHistoryItemMinimal;
    quizHistory: QuizHistory[];
    categoryConfig: Record<string, string>;
};

function QuizStepCard({ quiz, playable, played, history, quizHistory, categoryConfig }: QuizStepCardProps) {
    const total = history?.totalQuestions || quiz.questions?.length || 0;

    const levelConfig = getLevelConfig(quiz.niveau);
    return (
        <div className={`p-6 sm:p-4 md:p-6 border rounded-md shadow-md hover:shadow-lg transition-shadow duration-300 ${categoryConfig.bgColor} ${categoryConfig.borderColor} space-y-2`}>
            {/* Titre */}
            <h3 className={`font-semibold text-base sm:text-lg md:text-xl ${categoryConfig.textColor} break-words whitespace-pre-line`}>
                {quiz.titre}
            </h3>

            {/* Description */}
            <div
                className="text-sm text-gray-600 line-clamp-2"
                dangerouslySetInnerHTML={{ __html: quiz.description || "" }}
            />
            {/* Catégorie et niveau */}
            <div className={`text-xs sm:text-sm md:text-base ${categoryConfig.textColor} truncate flex items-center gap-2`}>
                {quiz.categorie}
                {quiz.niveau && (
                    <span className={`px-2 py-1 rounded ${levelConfig.bgClass} ${levelConfig.textClass} text-xs`}>
                        {quiz.niveau}
                    </span>
                )}
            </div>

            {/* Badges */}
            {/* Barre de progression */}
            {/* {played && (
                <div className="hidden sm:block w-full mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 dark:bg-gray-700">
                        <div
                            className={`h-3 sm:h-4 rounded-full text-xs text-white text-center ${categoryConfig.color}`}
                            style={{ width: `${percent}%` }}
                        >
                            {percent}%
                        </div>
                    </div>
                </div>
            )} */}

            {/* Quiz verrouillé */}
            {!playable && !played && (
                <div className={`text-xs sm:text-sm ${categoryConfig.textColor} flex flex-col sm:flex-row gap-1`}>
                    <div className="flex items-center gap-1">
                        <Lock size={14} />
                        Quiz verrouillé
                    </div>
                    <div className="text-gray-400 text-xs sm:text-sm">
                        Terminez les quiz précédents pour débloquer celui-ci.
                    </div>
                </div>
            )}

            {/* Boutons Commencer / Rejouer */}
            {(playable || played) && (
                <div className="mt-2 flex flex-row gap-2 items-center">
                    <a
                        href={`/quiz/${quiz.id}`}
                        className={`text-xs sm:text-sm md:text-base text-white px-3 py-2 rounded-md inline-block ${categoryConfig.color} hover:brightness-90 text-center w-auto`}
                    >
                        {played ? 'Rejouer' : 'Commencer'}
                    </a>
                    {played && (
                        <div className="w-auto">
                            <QuizHistoryModal quizId={quiz.id} quizHistory={quizHistory} noBorder />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function QuizHistoryModal({ quizId, quizHistory, noBorder }: { quizId: number; quizHistory: QuizHistory[]; noBorder?: boolean }) {
    const [open, setOpen] = useState(false);

    const last3 = quizHistory
        ?.filter((h) => String(h.quizId ?? h.quiz?.id) === String(quizId))
        ?.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
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
                    <DialogTitle>Derniers historiques</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                    {last3 && last3.length > 0 ? (
                        last3.map((h, idx) => (
                            <div key={idx} className={`p-2 rounded-md shadow-sm flex justify-between ${noBorder ? '' : 'border'}`}>
                                <div>
                                    <p className="text-sm">Temps passé : {h.timeSpent} sec - Score :{h.score * 10}%</p>
                                    <p className="text-xs text-gray-500">{new Date(h.completedAt).toLocaleString()}</p>
                                </div>
                                <div className="text-sm font-medium">{h.correctAnswers}/{Math.min(h.totalQuestions || 5, 5)} questions</div>

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
