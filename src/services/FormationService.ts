import axiosInstance from './axios';

const formationService = {
  async getFormations() {
    const response = await axiosInstance.get('/formations');
    return response.data;
  },

  async getFormationById(id: string) {
    const response = await axiosInstance.get(`/formations/${id}`);
    return response.data;
  },

  async getFormationProgress(id: string) {
    const response = await axiosInstance.get(`/formations/${id}/progress`);
    return response.data;
  }
};

export default formationService; 