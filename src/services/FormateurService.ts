import api from "./api";

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

const FormateurService = {
  getStudentsPerformance: async (): Promise<TrainerPerformanceResponse> => {
    const response = await api.get("/formateur/analytics/performance");
    return response.data;
  },
  getStagiaireStats: async (id: number): Promise<StudentDetails> => {
    const response = await api.get(`/formateur/stagiaire/${id}/stats`);
    return response.data;
  },
};

export default FormateurService;
