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
  async updateProgress(
    mediaId: string,
    currentTime: number,
    duration: number,
  ): Promise<any> {
    try {
      const response = await api.post("/medias/updateProgress", {
        media_id: mediaId,
        current_time: currentTime,
        duration: duration,
      });
      return response.data;
    } catch (error) {
      // Fail silently to avoid interrupting playback
      console.error("Error updating video progress:", error);
      return null;
    }
  },
};
