import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";

interface UnfinishedQuizSession {
    quizId: string;
    quizTitle: string;
    questionIds: string[];
    answers: Record<string, string[]>;
    currentIndex: number;
    timeSpent: number;
}

export const useResumeQuiz = () => {
    const [unfinishedQuiz, setUnfinishedQuiz] = useState<UnfinishedQuizSession | null>(null);

    // Fetch quiz details when we have a session
    const { data: quizDetails } = useQuery({
        queryKey: ["quiz", unfinishedQuiz?.quizId],
        queryFn: async () => {
            if (!unfinishedQuiz?.quizId) return null;
            const response = await apiClient.get(`/quizzes/${unfinishedQuiz.quizId}`);
            return response.data;
        },
        enabled: !!unfinishedQuiz?.quizId,
    });

    useEffect(() => {
        // Scan localStorage for quiz_session_* keys
        const keys = Object.keys(localStorage);
        const sessionKeys = keys.filter((k) => k.startsWith("quiz_session_"));

        if (sessionKeys.length === 0) {
            setUnfinishedQuiz(null);
            return;
        }

        // Get the most recent session (last in array)
        const lastSessionKey = sessionKeys[sessionKeys.length - 1];

        try {
            const sessionData = localStorage.getItem(lastSessionKey);
            if (!sessionData) {
                setUnfinishedQuiz(null);
                return;
            }

            const session = JSON.parse(sessionData);
            const quizId = lastSessionKey.replace("quiz_session_", "");

            setUnfinishedQuiz({
                quizId,
                quizTitle: session.quizTitle || "Quiz",
                questionIds: session.questionIds || [],
                answers: session.answers || {},
                currentIndex: session.currentIndex || 0,
                timeSpent: session.timeSpent || 0,
            });
        } catch (error) {
            console.error("Failed to parse quiz session:", error);
            localStorage.removeItem(lastSessionKey);
            setUnfinishedQuiz(null);
        }
    }, []);

    const dismissQuiz = (quizId: string) => {
        localStorage.removeItem(`quiz_session_${quizId}`);
        setUnfinishedQuiz(null);
    };

    return {
        unfinishedQuiz: unfinishedQuiz
            ? { ...unfinishedQuiz, quizTitle: quizDetails?.titre || unfinishedQuiz.quizTitle }
            : null,
        dismissQuiz,
    };
};
