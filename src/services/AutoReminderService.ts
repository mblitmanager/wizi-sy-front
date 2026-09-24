import { api } from "@/lib/api";


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
        const response = await api.get(`/auto-reminders/stats`);
        return response.data;
    },

    getHistory: async (page = 1): Promise<PaginatedResponse<ReminderHistoryItem>> => {
        const response = await api.get(`/auto-reminders/history?page=${page}`);
        return response.data;
    },

    runManualReminders: async (): Promise<{ message: string; output: string }> => {
        const response = await api.post(`/auto-reminders/run`, {});
        return response.data;
    },

    getTargeted: async (): Promise<TargetedUser[]> => {
        const response = await api.get(`/auto-reminders/targeted`);
        return response.data;
    },
};

export default AutoReminderService;
