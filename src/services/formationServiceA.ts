import { api } from "./api";
import { Formation } from "@/types/stagiaire";

export const formationService = {
  getFormationsByStagiaire: async (): Promise<{ data: Formation[] }> => {
    const response = await api.get<{ data: Formation[] }>(
      `/stagiaire/formations`
    );
    return response.data;
  },

  getCategories: async (): Promise<string[]> => {
    const response = await api.get<{ data: Formation[] }>(
      "/stagiaire/formations"
    );
    const formations = response.data.data;
    const categories = new Set(
      formations.map((formation) => formation.categorie)
    );

    return Array.from(categories);
  },

  getFormationsByCategory: async (category: string): Promise<Formation[]> => {
    const response = await api.get<{ data: Formation[] }>(
      "/stagiaire/formations"
    );
    return response.data.data.filter(
      (formation) => formation.categorie === category
    );
  },

  getFormationById: async (formationId: number): Promise<Formation> => {
    const response = await api.get<{ data: Formation[] }>(
      "/stagiaire/formations"
    );
    const formation = response.data.data.find((f) => f.id === formationId);
    if (!formation) {
      throw new Error("Formation not found");
    }
    return formation;
  },
};
