import { api } from './api';

export const catalogueFormationApi = {
  getCatalogueFormationById: (catFormationId: number) => api.get(`/catalogueFormations/formations/${catFormationId}`),
}; 