import { api } from "./api";
export const mediaService = {
  getTutoriels: () => api.get("/medias/tutoriels"),
  getAstuces: () => api.get("/medias/astuces"),
  getAstuceByFormationId: (formationId: string) =>
    api.get(`/medias/formations/${formationId}/astuces`),
  getTutorielByFormationId: (formationId: string) =>
    api.get(`/medias/formations/${formationId}/tutoriels`),
  markAsWatched: (mediaId: string, stagiaireId: number) =>
    api.post(`/medias/${mediaId}/watched`, {
      stagiaire_id: stagiaireId,
      media_id: mediaId,
    }),
};
