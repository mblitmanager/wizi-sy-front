import { api } from './api';

interface Stagiaire {
  id: number;
  prenom: string;
  civilite: string;
  telephone: string;
  adresse: string;
  date_naissance: string;
  ville: string;
  code_postal: string;
  role: string;
  statut: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    role: string;
    created_at: string;
    updated_at: string;
  };
  formations: Array<{
    id: number;
    titre: string;
    description: string;
    categorie: string;
    image: string | null;
    statut: number;
    duree: string;
    created_at: string;
    updated_at: string;
    pivot: {
      stagiaire_id: number;
      formation_id: number;
    };
  }>;
  formateur: Array<{
    id: number;
    role: string;
    prenom: string;
    user_id: number;
    created_at: string;
    updated_at: string;
    pivot: {
      stagiaire_id: number;
      formateur_id: number;
    };
  }>;
  commercial: Array<{
    id: number;
    prenom: string;
    role: string;
    user_id: number;
    created_at: string;
    updated_at: string;
    pivot: {
      stagiaire_id: number;
      commercial_id: number;
    };
  }>;
}

interface Progress {
  total_quizzes: number;
  completed_quizzes: number;
  average_score: number | null;
  total_points: number;
  level: string;
}

interface StagiaireResponse {
  stagiaire: Stagiaire;
  progress: Progress;
}

export const userService = {
  getProfile: async (): Promise<StagiaireResponse> => {
    const response = await api.get<StagiaireResponse>("/stagiaire/progress");
    return response.data;
  },
  
  updateProfile: async (data: { name?: string; email?: string; password?: string }): Promise<StagiaireResponse> => {
    const response = await api.put<StagiaireResponse>("/stagiaire/progress", data);
    return response.data;
  }
}; 