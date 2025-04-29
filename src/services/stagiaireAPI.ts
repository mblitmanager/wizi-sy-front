import { api } from './api';

export const stagiaireAPI = {
  getFormations: () => api.get("/stagiaire/formations"),
  getFormationById: (formationId: string) => api.get(`/formations/${formationId}`),
  getProgressById: (formationId: string) => api.get(`/stagiaire/progress/${formationId}`),
  getCatalogueFormations: (stagiaireId: number) => api.get(`/catalogue_formations/stagiaire/${stagiaireId}`),
}; 