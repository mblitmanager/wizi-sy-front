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
  formationId?: string | number;
}

export const useResumeQuiz = () => {
  const [unfinishedQuiz, setUnfinishedQuiz] =
    useState<UnfinishedQuizSession | null>(null);

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
    (async () => {
      try {
        const token = localStorage.getItem("token");

        // Collect keys from both storages (local/session)
        const collectKeys = (storage: Storage) =>
          Object.keys(storage).filter((k) => k.startsWith("quiz_session_"));

        const localKeys = collectKeys(localStorage);
        const sessionKeys = collectKeys(sessionStorage);
        const allKeys = [...new Set([...localKeys, ...sessionKeys])];

        if (allKeys.length === 0) {
          setUnfinishedQuiz(null);
          return;
        }

        // If authenticated, try to sync local/session sessions to server
        if (token) {
          for (const key of allKeys) {
            try {
              const raw =
                localStorage.getItem(key) || sessionStorage.getItem(key);
              if (!raw) continue;
              const session = JSON.parse(raw);
              const quizId = key.replace("quiz_session_", "");

              // Send progress to API (server will create/update participation)
              await apiClient.post(`/quiz/${quizId}/participation/progress`, {
                questionIds: session.questionIds || [],
                answers: session.answers || {},
                currentIndex: session.currentIndex || 0,
                timeSpent: session.timeSpent || 0,
              });

              // Remove local copy after successful sync
              try {
                localStorage.removeItem(key);
                sessionStorage.removeItem(key);
              } catch {}
            } catch (e) {
              console.warn("Failed to sync quiz session to server", key, e);
            }
          }

          // After syncing, ask server for resume data for the most recent quiz
          // We pick the last key from the original combined list as most recent
          const lastKey = allKeys[allKeys.length - 1];
          const quizId = lastKey.replace("quiz_session_", "");

          try {
            const resp = await apiClient.get(
              `/quiz/${quizId}/participation/resume`
            );
            const data = resp?.data || resp;
            if (data) {
              setUnfinishedQuiz({
                quizId: String(quizId),
                quizTitle: data.quizTitle || data.titre || "Quiz",
                questionIds: data.questionIds || data.question_ids || [],
                answers: data.answers || {},
                currentIndex: data.currentIndex || data.current_index || 0,
                timeSpent: data.timeSpent || data.time_spent || 0,
                formationId: data.formationId || data.formation_id,
              });
              return;
            }
          } catch (e) {
            // No server resume or error — fallthrough to local fallback
          }
        }

        // Fallback: read from localStorage (unauthenticated or server unavailable)
        const fallbackKeys = Object.keys(localStorage).filter((k) =>
          k.startsWith("quiz_session_")
        );
        if (fallbackKeys.length === 0) {
          setUnfinishedQuiz(null);
          return;
        }

        const lastSessionKey = fallbackKeys[fallbackKeys.length - 1];
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
            formationId: session.formationId,
          });
        } catch (error) {
          console.error("Failed to parse quiz session:", error);
          localStorage.removeItem(lastSessionKey);
          setUnfinishedQuiz(null);
        }
      } catch (err) {
        console.error("useResumeQuiz error:", err);
      }
    })();
  }, []);

  const dismissQuiz = (quizId: string) => {
    localStorage.removeItem(`quiz_session_${quizId}`);
    setUnfinishedQuiz(null);
    setIsModalHidden(false); // Reset modal visibility when quiz is dismissed
  };

  const [isModalHidden, setIsModalHidden] = useState(false);

  const hideModal = () => {
    setIsModalHidden(true);
  };

  const formationId =
    quizDetails?.formationId ||
    quizDetails?.formation_id ||
    quizDetails?.formation?.id ||
    unfinishedQuiz?.formationId;

  return {
    unfinishedQuiz: unfinishedQuiz
      ? {
          ...unfinishedQuiz,
          quizTitle: quizDetails?.titre || unfinishedQuiz.quizTitle,
          formationId,
        }
      : null,
    dismissQuiz,
    isModalHidden,
    hideModal,
  };
};
