import { api } from './api';

export const sponsorshipService = {
  getLink: () => api.get("/stagiaire/parrainage/link"),
  getReferrals: () => api.get("/stagiaire/parrainage/filleuls"),
  getStats: () => api.get("/stagiaire/parrainage/stats"),
}; 