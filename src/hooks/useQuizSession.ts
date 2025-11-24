import { useState, useEffect, useCallback } from 'react';
import { quizSessionService, QuizSession, QuizSessionDTO } from '@/services/quiz/QuizSessionService';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for managing quiz sessions
 * Provides methods to save, load, and manage quiz progress
 */
export function useQuizSession() {
    const [activeSessions, setActiveSessions] = useState<QuizSession[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const { toast } = useToast();

    /**
     * Load all active sessions
     */
    const loadActiveSessions = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const sessions = await quizSessionService.getActiveSessions();
            setActiveSessions(sessions);
            return sessions;
        } catch (err) {
            const error = err as Error;
            setError(error);
            console.error('Failed to load active sessions:', error);
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Save or update a quiz session
     */
    const saveSession = useCallback(async (sessionData: QuizSessionDTO) => {
        setIsLoading(true);
        setError(null);
        try {
            const session = await quizSessionService.saveSession(sessionData);

            // Update local state
            setActiveSessions(prev => {
                const index = prev.findIndex(s => s.id === session.id);
                if (index >= 0) {
                    // Update existing
                    const updated = [...prev];
                    updated[index] = session;
                    return updated;
                }
                // Add new
                return [...prev, session];
            });

            return session;
        } catch (err) {
            const error = err as Error;
            setError(error);
            toast({
                title: 'Erreur',
                description: 'Impossible de sauvegarder la progression',
                variant: 'destructive',
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    /**
     * Delete a quiz session
     */
    const deleteSession = useCallback(async (sessionId: number) => {
        setIsLoading(true);
        setError(null);
        try {
            await quizSessionService.deleteSession(sessionId);

            // Remove from local state
            setActiveSessions(prev => prev.filter(s => s.id !== sessionId));

            toast({
                title: 'Session supprimée',
                description: 'Votre progression a été effacée',
            });
        } catch (err) {
            const error = err as Error;
            setError(error);
            toast({
                title: 'Erreur',
                description: 'Impossible de supprimer la session',
                variant: 'destructive',
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    /**
     * Complete a quiz session
     */
    const completeSession = useCallback(async (
        sessionId: number,
        finalData?: { final_score?: number; time_spent?: number }
    ) => {
        setIsLoading(true);
        setError(null);
        try {
            const session = await quizSessionService.completeSession(sessionId, finalData);

            // Remove from active sessions
            setActiveSessions(prev => prev.filter(s => s.id !== sessionId));

            return session;
        } catch (err) {
            const error = err as Error;
            setError(error);
            console.error('Failed to complete session:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Check if there's an active session for a quiz
     */
    const getActiveSessionForQuiz = useCallback((quizId: number): QuizSession | null => {
        return activeSessions.find(s => s.quiz_id === quizId) || null;
    }, [activeSessions]);

    /**
     * Get the most recent session (for resume functionality)
     */
    const getMostRecentSession = useCallback((): QuizSession | null => {
        if (activeSessions.length === 0) return null;

        return [...activeSessions].sort(
            (a, b) =>
                new Date(b.last_activity_at).getTime() -
                new Date(a.last_activity_at).getTime()
        )[0];
    }, [activeSessions]);

    // Load active sessions on mount
    useEffect(() => {
        loadActiveSessions();
    }, [loadActiveSessions]);

    return {
        activeSessions,
        isLoading,
        error,
        saveSession,
        deleteSession,
        completeSession,
        loadActiveSessions,
        getActiveSessionForQuiz,
        getMostRecentSession,
    };
}

/**
 * Hook for a specific quiz session
 */
export function useQuizSessionById(sessionId: number | null) {
    const [session, setSession] = useState<QuizSession | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const loadSession = useCallback(async () => {
        if (!sessionId) return;

        setIsLoading(true);
        setError(null);
        try {
            const data = await quizSessionService.getSession(sessionId);
            setSession(data);
            return data;
        } catch (err) {
            const error = err as Error;
            setError(error);
            console.error(`Failed to load session ${sessionId}:`, error);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [sessionId]);

    useEffect(() => {
        if (sessionId) {
            loadSession();
        }
    }, [sessionId, loadSession]);

    return {
        session,
        isLoading,
        error,
        reload: loadSession,
    };
}
