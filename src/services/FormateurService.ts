import api from "./api";
import { Contact } from "@/types/contact";

export interface StudentPerformance {
  id: number;
  name: string;
  prenom?: string;
  email: string;

  image: string | null;
  last_quiz_at: string | null;
  total_quizzes: number;
  total_logins: number;
}

export interface TrainerPerformanceResponse {
  performance: StudentPerformance[];
  rankings: {
    most_quizzes: StudentPerformance[];
    most_active: StudentPerformance[];
  };
}

export interface StudentDetails {
  stagiaire: {
    id: number;
    prenom: string;
    nom: string;
    email: string;
  };
  quiz_stats: {
    total_quiz: number;
    avg_score: number;
    best_score: number;
    total_correct: number;
    total_questions: number;
  };
  activity: {
    last_activity: string;
    last_login: string | null;
    is_online: boolean;
    last_client: string | null;
  };
}

export interface FormationPerformance {
  id: number;
  titre: string;
  image_url: string | null;
  student_count: number;
  avg_score: number;
  total_completions: number;
}

export interface StagiaireFormationPerformance {
  id: number;
  titre: string;
  image_url: string | null;
  avg_score: number;
  best_score: number;
  completions: number;
  last_activity: string | null;
}

const FormateurService = {
  getStudentsPerformance: async (): Promise<TrainerPerformanceResponse> => {
    const response = await api.get("/formateur/analytics/performance");
    return response.data.data || response.data;
  },

  getStagiaireStats: async (id: number): Promise<StudentDetails> => {
    const response = await api.get(`/formateur/stagiaire/${id}/stats`);
    return response.data.data || response.data;
  },

  getFormationsPerformance: async (): Promise<FormationPerformance[]> => {
    const response = await api.get(
      "/formateur/analytics/formations/performance",
    );
    const data = response.data.data || response.data;
    return Array.isArray(data) ? data : data.performance || [];
  },

  getStagiaireFormations: async (
    id: number,
  ): Promise<StagiaireFormationPerformance[]> => {
    const response = await api.get(
      `/formateur/analytics/stagiaire/${id}/formations`,
    );
    return response.data.data || response.data;
  },

  getFormations: async (): Promise<any[]> => {
    const response = await api.get("/formateur/formations");
    return response.data.formations || [];
  },

  getDashboardSummary: async (
    period = 30,
    formationId?: string,
  ): Promise<any> => {
    const fQuery = formationId ? `&formation_id=${formationId}` : "";
    const response = await api.get(
      `/formateur/analytics/dashboard?period=${period}${fQuery}`,
    );
    return response.data.summary;
  },

  getQuizSuccessRate: async (
    period = 30,
    formationId?: string,
  ): Promise<any[]> => {
    const fQuery = formationId ? `&formation_id=${formationId}` : "";
    const response = await api.get(
      `/formateur/analytics/quiz-success-rate?period=${period}${fQuery}`,
    );
    return response.data.quiz_stats || [];
  },

  getActivityHeatmap: async (
    period = 30,
    formationId?: string,
  ): Promise<any[]> => {
    const fQuery = formationId ? `&formation_id=${formationId}` : "";
    const response = await api.get(
      `/formateur/analytics/activity-heatmap?period=${period}${fQuery}`,
    );
    return response.data.activity_by_day || [];
  },

  getDropoutRate: async (formationId?: string): Promise<any[]> => {
    const fQuery = formationId ? `?formation_id=${formationId}` : "";
    const response = await api.get(
      `/formateur/analytics/dropout-rate${fQuery}`,
    );
    return response.data.quiz_dropout || [];
  },

  getStudentsComparison: async (formationId?: string): Promise<any> => {
    const fQuery = formationId ? `?formation_id=${formationId}` : "";
    const response = await api.get(
      `/formateur/analytics/students-comparison${fQuery}`,
    );
    return response.data;
  },

  getTraineesAsContacts: async (): Promise<Contact[]> => {
    const response = await api.get("/formateur/analytics/performance");
    const trainees = response.data.performance || [];
    return trainees.map((t: StudentPerformance) => ({
      id: t.id,
      name: t.name,
      email: t.email,
      image: t.image || undefined,
      avatar: t.image || undefined,
      role: "Apprenant",
      type: "stagiaire",
    }));
  },
};

export default FormateurService;
