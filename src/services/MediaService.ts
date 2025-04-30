import { api } from "./api";

export const mediaService = {
  getTutoriels: () => api.get("/medias/tutoriels"),
  getAstuces: () => api.get("/medias/astuces"),
};
