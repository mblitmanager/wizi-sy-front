import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

export interface ReminderStats {
    formation: Record<string, number>;
    inactivity: Record<string, number>;
    no_quiz: Record<string, number>;
    recent_sends: Record<string, number>;
    last_run: string;
}

export interface ReminderHistoryItem {
    id: number;
    type: string;
    message: string;
    created_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

export interface TargetedUser {
    user: {
        id: number;
        name: string;
        email: string;
    };
    reason: string;
    type: string;
}

const AutoReminderService = {
    getStats: async (): Promise<ReminderStats> => {
        const response = await axios.get(`${API_URL}/auto-reminders/stats`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    },

    getHistory: async (page = 1): Promise<PaginatedResponse<ReminderHistoryItem>> => {
        const response = await axios.get(`${API_URL}/auto-reminders/history?page=${page}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    },

    runManualReminders: async (): Promise<{ message: string; output: string }> => {
        const response = await axios.post(`${API_URL}/auto-reminders/run`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    },

    getTargeted: async (): Promise<TargetedUser[]> => {
        const response = await axios.get(`${API_URL}/auto-reminders/targeted`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    },
};

export default AutoReminderService;
