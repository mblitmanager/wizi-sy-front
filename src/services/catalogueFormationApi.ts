import { api } from "@/lib/api";
import type { CatalogueFormationResponse } from "@/types/stagiaire";

export const catalogueFormationApi = {
  getCatalogueFormation: async (stagiaireId: string): Promise<CatalogueFormationResponse> => {
    const response = await api.get<CatalogueFormationResponse>(`/catalogueFormations/stagiaire/${stagiaireId}`);
    return response.data;
  },

  getCatalogueFormationStagiaire: async (): Promise<CatalogueFormationResponse> => {
    const response = await api.get<CatalogueFormationResponse>("/catalogueFormations/stagiaire");
    return response.data;
  },

  getFormationDetails: async (formationId: string) => {
    const response = await api.get(`/formations/${formationId}`);
    return response.data;
  },

  getFormationQuizzes: async (formationId: string) => {
    const response = await api.get(`/formations/${formationId}/quizzes`);
    return response.data;
  },
};
