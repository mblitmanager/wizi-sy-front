import { Button } from "@/components/ui/button";
import { Play, X } from "lucide-react";
import { memo } from "react";

interface ResumeQuizButtonProps {
    quizTitle: string;
    questionCount: number;
    currentProgress: number;
    onResume: () => void;
    onDismiss: () => void;
}

/**
 * Composant bouton pour reprendre un quiz, affiché en bas de page
 * Mémorisé pour optimiser les performances
 */
export const ResumeQuizButton = memo(({
    quizTitle,
    questionCount,
    currentProgress,
    onResume,
    onDismiss,
}: ResumeQuizButtonProps) => {
    const progressPercentage = questionCount > 0
        ? Math.round((currentProgress / questionCount) * 100)
        : 0;

    return (
        <div className="fixed bottom-20 sm:bottom-4 left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md px-4">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl shadow-2xl p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Play className="w-5 h-5 text-white" />
                            <h4 className="text-white font-semibold text-sm">
                                Quiz en cours
                            </h4>
                        </div>
                        <p className="text-white/90 text-xs font-medium mb-1 line-clamp-1">
                            {quizTitle}
                        </p>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-white/20 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className={`bg-white h-full rounded-full transition-all duration-300 w-[${progressPercentage}%]`}
                                />
                            </div>
                            <span className="text-white/90 text-xs font-medium">
                                {progressPercentage}%
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            onClick={onResume}
                            size="sm"
                            className="bg-white text-orange-600 hover:bg-gray-100 font-semibold"
                        >
                            <Play className="w-4 h-4 mr-1" />
                            Reprendre
                        </Button>
                        <button
                            onClick={onDismiss}
                            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                            aria-label="Fermer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

ResumeQuizButton.displayName = "ResumeQuizButton";
