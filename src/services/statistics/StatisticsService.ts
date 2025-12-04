import api from '../api';

export interface DashboardSummary {
    totalStudents: number;
    activeStudents: number;
    totalFormations: number;
    averageCompletionRate: number;
}

export interface QuizStats {
    globalSuccessRate: number;
    averageScore: number;
    averageTime: string;
    totalAttempts: number;
    hardestQuestions: Array<{ id: number; question: string; difficulty: number }>;
    easiestQuestions: Array<{ id: number; question: string; difficulty: number }>;
    scoreDistribution: Array<{ range: string; count: number }>;
    trends: Array<{ date: string; value: number }>;
}

export interface FormationStats {
    totalFormations: number;
    averageCompletionRate: number;
    topFormations: Array<{ id: number; titre: string; students_count: number; completion_rate: number }>;
    enrollmentTrends: Array<{ date: string; value: number }>;
    dropoutRate: number;
    averageCompletionTime: string;
}

export interface OnlineUser {
    id: number;
    name: string;
    email: string;
    role: string;
    connected_at: string;
    online_duration: number;
}

export interface AffluenceStats {
    hourly: Array<{ hour: string; count: number }>;
    daily: Array<{ date: string; count: number }>;
    monthly: Array<{ month: string; count: number }>;
    peakHours: Array<{ hour: string; count: number }>;
    comparison: {
        current: number;
        previous: number;
        change: number;
    };
}

export const StatisticsService = {
    // Admin endpoints
    getAdminDashboard: (period = '30d') =>
        api.get<{
            summary: DashboardSummary;
            onlineUsers: number;
            recentActivity: any[];
            topFormations: any[];
            quizOverview: any;
        }>('/admin/stats/dashboard', { params: { period } }),

    getQuizStats: (period = '30d') =>
        api.get<QuizStats>('/admin/stats/quiz', { params: { period } }),

    getFormationStats: (period = '30d') =>
        api.get<FormationStats>('/admin/stats/formation', { params: { period } }),

    getOnlineUsers: () =>
        api.get<OnlineUser[]>('/admin/stats/online-users'),

    getAffluenceStats: (period = '30d', granularity: 'hourly' | 'daily' | 'monthly' = 'daily') =>
        api.get<AffluenceStats>('/admin/stats/affluence', { params: { period, granularity } }),

    exportPdf: (data: any) =>
        api.post('/admin/stats/export/pdf', data, { responseType: 'blob' }),

    exportExcel: (data: any) =>
        api.post('/admin/stats/export/excel', data, { responseType: 'blob' }),

    // Commercial endpoints
    getCommercialDashboard: () =>
        api.get('/commercial/stats/dashboard'),

    // Formateur endpoints
    getFormateurDashboard: () =>
        api.get('/formateur/stats/dashboard'),

    getMyFormations: () =>
        api.get('/formateur/stats/my-formations'),

    getFormationQuizStats: (formationId: number) =>
        api.get(`/formateur/stats/formation/${formationId}/quiz`),

    getFormationStudents: (formationId: number) =>
        api.get(`/formateur/stats/formation/${formationId}/students`),
};
