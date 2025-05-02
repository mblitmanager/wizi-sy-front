
import { api } from "./api";
import { Media, MediaCategory } from "@/types/media";

export const mediaService = {
  getTutoriels: () => api.get("/medias/tutoriels"),
  getAstuces: () => api.get("/medias/astuces"),
  
  // Add these new methods
  getAllMedias: async (): Promise<Media[]> => {
    const response = await api.get("/medias");
    return response.data;
  },
  
  getMediasByType: async (type: string): Promise<Media[]> => {
    const response = await api.get(`/medias/type/${type}`);
    return response.data;
  },
  
  getMediasByCategory: async (categoryId: string): Promise<Media[]> => {
    const response = await api.get(`/medias/category/${categoryId}`);
    return response.data;
  },
  
  getFormationMedias: async (formationId: string): Promise<Media[]> => {
    const response = await api.get(`/formations/${formationId}/medias`);
    return response.data;
  },
  
  getCategories: async (): Promise<MediaCategory[]> => {
    const response = await api.get("/media-categories");
    return response.data;
  }
};
