import axiosInstance from './axios';

export const mediaService = {
  async getTutoriels() {
    const response = await axiosInstance.get('/tutoriels');
    return response.data;
  },

  async getAstuces() {
    const response = await axiosInstance.get('/astuces');
    return response.data;
  },

  async getTutorielById(id: string) {
    const response = await axiosInstance.get(`/tutoriels/${id}`);
    return response.data;
  },

  async getAstuceById(id: string) {
    const response = await axiosInstance.get(`/astuces/${id}`);
    return response.data;
  },

  async getLanguageSessions() {
    const response = await axiosInstance.get('/language-sessions');
    return response.data;
  },

  async getInteractiveFormations() {
    const response = await axiosInstance.get('/interactive-formations');
    return response.data;
  }
}; 