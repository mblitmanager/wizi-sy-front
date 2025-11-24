import api from './api';

/**
 * Quiz Session Data Transfer Object
 */
export interface QuizSessionDTO {
    quiz_id: number;
    question_ids: number[];
    current_index: number;
    answers: Record<string, string[]>;
    time_spent: number;
}

/**
 * Quiz Session Response from API
 */
export interface QuizSession {
    id: number;
    stagiaire_id: number;
    quiz_id: number;
    question_ids: number[];
    current_index: number;
    answers: Record<string, string[]>;
    time_spent: number;
    progress_percentage: number;
    total_questions: number;
    is_expired: boolean;
    started_at: string;
    last_activity_at: string;
    expires_at: string;
    status: 'active' | 'completed' | 'expired';
    quiz?: {
        id: number;
        titre: string;
        description: string;
        niveau: string;
        formation?: {
            id: number;
            titre: string;
        };
    };
}

/**
 * Service for managing quiz sessions via API
 * Replaces client-side localStorage persistence
 */
class QuizSessionService {
    private readonly baseUrl = '/quiz-sessions';

    /**
     * Get all active quiz sessions for the authenticated user
     */
    async getActiveSessions(): Promise<QuizSession[]> {
        try {
            const response = await api.get<{ success: boolean; data: QuizSession[] }>(
                `${this.baseUrl}/active`
            );
            return response.data.data;
        } catch (error) {
            console.error('Error fetching active quiz sessions:', error);
            throw error;
        }
    }

    /**
     * Create or update a quiz session
     * If an active session exists for this quiz, it will be updated
     */
    async saveSession(sessionData: QuizSessionDTO): Promise<QuizSession> {
        try {
            const response = await api.post<{
                success: boolean;
                message: string;
                data: QuizSession;
            }>(this.baseUrl, sessionData);
            return response.data.data;
        } catch (error) {
            console.error('Error saving quiz session:', error);
            throw error;
        }
    }

    /**
     * Get a specific quiz session by ID
     */
    async getSession(sessionId: number): Promise<QuizSession> {
        try {
            const response = await api.get<{ success: boolean; data: QuizSession }>(
                `${this.baseUrl}/${sessionId}`
            );
            return response.data.data;
        } catch (error) {
            console.error(`Error fetching quiz session ${sessionId}:`, error);
            throw error;
        }
    }

    /**
     * Update an existing quiz session
     */
    async updateSession(
        sessionId: number,
        updates: Partial<Pick<QuizSessionDTO, 'current_index' | 'answers' | 'time_spent'>>
    ): Promise<QuizSession> {
        try {
            const response = await api.put<{
                success: boolean;
                message: string;
                data: QuizSession;
            }>(`${this.baseUrl}/${sessionId}`, updates);
            return response.data.data;
        } catch (error) {
            console.error(`Error updating quiz session ${sessionId}:`, error);
            throw error;
        }
    }

    /**
     * Delete/abandon a quiz session
     */
    async deleteSession(sessionId: number): Promise<void> {
        try {
            await api.delete<{ success: boolean; message: string }>(
                `${this.baseUrl}/${sessionId}`
            );
        } catch (error) {
            console.error(`Error deleting quiz session ${sessionId}:`, error);
            throw error;
        }
    }

    /**
     * Mark a quiz session as completed
     */
    async completeSession(
        sessionId: number,
        finalData?: { final_score?: number; time_spent?: number }
    ): Promise<QuizSession> {
        try {
            const response = await api.post<{
                success: boolean;
                message: string;
                data: QuizSession;
            }>(`${this.baseUrl}/${sessionId}/complete`, finalData);
            return response.data.data;
        } catch (error) {
            console.error(`Error completing quiz session ${sessionId}:`, error);
            throw error;
        }
    }

    /**
     * Check if there's an active session for a specific quiz
     */
    async hasActiveSession(quizId: number): Promise<QuizSession | null> {
        try {
            const sessions = await this.getActiveSessions();
            return sessions.find((s) => s.quiz_id === quizId) || null;
        } catch (error) {
            console.error('Error checking for active session:', error);
            return null;
        }
    }

    /**
     * Get the most recent active session (for resume functionality)
     */
    async getMostRecentSession(): Promise<QuizSession | null> {
        try {
            const sessions = await this.getActiveSessions();
            if (sessions.length === 0) return null;

            // Sort by last_activity_at descending
            return sessions.sort(
                (a, b) =>
                    new Date(b.last_activity_at).getTime() -
                    new Date(a.last_activity_at).getTime()
            )[0];
        } catch (error) {
            console.error('Error fetching most recent session:', error);
            return null;
        }
    }
}

// Export singleton instance
export const quizSessionService = new QuizSessionService();
export default quizSessionService;
