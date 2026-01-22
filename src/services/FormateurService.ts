import api from "./api";
import { Contact } from "@/types/contact";

export interface StudentPerformance {
  id: number;
  name: string;
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
    return response.data;
  },
  getStagiaireStats: async (id: number): Promise<StudentDetails> => {
    const response = await api.get(`/formateur/stagiaire/${id}/stats`);
    return response.data;
  },
  getFormationsPerformance: async (): Promise<FormationPerformance[]> => {
    const response = await api.get(
      "/formateur/analytics/formations/performance",
    );
    // Handle both new structured response and potential array
    return Array.isArray(response.data)
      ? response.data
      : response.data.performance || [];
  },
  getStagiaireFormations: async (
    id: number,
  ): Promise<StagiaireFormationPerformance[]> => {
    const response = await api.get(
      `/formateur/analytics/stagiaire/${id}/formations`,
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
