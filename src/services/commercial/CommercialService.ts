import { api } from "../api";

export interface CommercialDashboardStats {
  summary: {
    totalSignups: number;
    signupsThisMonth: number;
    activeStudents: number;
    conversionRate: number;
  };
  recentSignups: Array<{
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
  }>;
  topFormations: Array<{
    id: number;
    name: string;
    enrollments: number;
    price: number;
  }>;
  signupTrends: Array<{
    date: string;
    value: number;
  }>;
}

export const commercialService = {
  getDashboardStats: async (): Promise<CommercialDashboardStats> => {
    const response = await api.get("/commercial/stats/dashboard");
    // Handle both Laravel (response.data.data) and Node (response.data) formats
    // api.ts interceptor doesn't seem to extract the 'data' field automatically
    return response.data.data || response.data;
  },
};
