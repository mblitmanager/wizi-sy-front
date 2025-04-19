import { api } from './api';

export const catalogueFormationApi = {
  getCatalogueFormationById: (catFormationId: number) => api.get(`/catalogue_formations/formations/${catFormationId}`),
}; 