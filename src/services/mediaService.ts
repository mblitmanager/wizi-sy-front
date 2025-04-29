import { api } from './api';

export const mediaService = {
  getMedia: () => api.get("/media"),
  getMediaItem: (id: string) => api.get(`/media/${id}`),
}; 