import { api } from "./api";

export const mediaService = {
  getTutoriels: () => api.get("/medias/tutoriels"),
  getAstuces: () => api.get("/medias/astuces"),
  getAstuceByFormationId: (formationId: string) =>
    api.get(`/medias/formations/${formationId}/astuces`),
  getTutorielByFormationId: (formationId: string) =>
    api.get(`/medias/formations/${formationId}/tutoriels`),
};
