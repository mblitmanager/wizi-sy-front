import { api } from "@/lib/api";

const formationService = {
  async getFormations() {
    const response = await api.get("/formations");
    return response.data;
  },

  async getFormationById(id: string) {
    const response = await api.get(`/formations/${id}`);
    return response.data;
  },

  async getFormationProgress(id: string) {
    const response = await api.get(`/formations/${id}/progress`);
    return response.data;
  },

  async getFormationModules(id: string) {
    const response = await api.get(`/formations/${id}/modules`);
    return response.data;
  },

  async getFormationStagiaire(stagiaireId: number) {
    const response = await api.get(
      `/stagiaire/${stagiaireId}/formations`
    );
    return response.data;
  },
};
export default formationService;
