import { api } from "@/lib/api";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000/api";

export const AdminStagiaireAPI = {
  // Get all stagiaires with pagination
  getAll: async (page = 1, search = "") => {
    const response = await api.get("/admin/stagiaires", {
      params: { page, search },
    });
    return response.data;
  },

  // Get single stagiaire
  getById: async (id: number) => {
    const response = await api.get(`/admin/stagiaires/${id}`);
    return response.data;
  },

  // Create stagiaire
  create: async (data: any) => {
    const response = await api.post("/admin/stagiaires", data);
    return response.data;
  },

  // Update stagiaire
  update: async (id: number, data: any) => {
    const response = await api.put(`/admin/stagiaires/${id}`, data);
    return response.data;
  },

  // Delete stagiaire
  delete: async (id: number) => {
    const response = await api.delete(`/admin/stagiaires/${id}`);
    return response.data;
  },

  // Activate stagiaire
  activate: async (id: number) => {
    const response = await api.patch(`/admin/stagiaires/${id}/activate`, {});
    return response.data;
  },

  // Deactivate stagiaire
  deactivate: async (id: number) => {
    const response = await api.patch(`/admin/stagiaires/${id}/deactivate`, {});
    return response.data;
  },
};

export const AdminQuizAPI = {
  // Get all quizzes
  getAll: async (page = 1, search = "") => {
    const response = await api.get("/admin/quiz", {
      params: { page, search },
    });
    return response.data;
  },

  // Get single quiz
  getById: async (id: number) => {
    const response = await api.get(`/admin/quiz/${id}`);
    return response.data;
  },

  // Create quiz
  create: async (data: any) => {
    const response = await api.post("/admin/quiz", data);
    return response.data;
  },

  // Update quiz
  update: async (id: number, data: any) => {
    const response = await api.put(`/admin/quiz/${id}`, data);
    return response.data;
  },

  // Delete quiz
  delete: async (id: number) => {
    const response = await api.delete(`/admin/quiz/${id}`);
    return response.data;
  },

  // Duplicate quiz
  duplicate: async (id: number) => {
    const response = await api.post(`/admin/quiz/${id}/duplicate`, {});
    return response.data;
  },

  // Enable quiz
  enable: async (id: number) => {
    const response = await api.patch(`/admin/quiz/${id}/enable`, {});
    return response.data;
  },

  // Disable quiz
  disable: async (id: number) => {
    const response = await api.patch(`/admin/quiz/${id}/disable`, {});
    return response.data;
  },
};

export const AdminFormationAPI = {
  // Get all formations
  getAll: async (page = 1, search = "") => {
    const response = await api.get("/admin/formations", {
      params: { page, search },
    });
    return response.data;
  },

  // Get single formation
  getById: async (id: number) => {
    const response = await api.get(`/admin/formations/${id}`);
    return response.data;
  },

  // Create formation
  create: async (data: any) => {
    const response = await api.post("/admin/formations", data);
    return response.data;
  },

  // Update formation
  update: async (id: number, data: any) => {
    const response = await api.put(`/admin/formations/${id}`, data);
    return response.data;
  },

  // Delete formation
  delete: async (id: number) => {
    const response = await api.delete(`/admin/formations/${id}`);
    return response.data;
  },

  // Duplicate formation
  duplicate: async (id: number) => {
    const response = await api.post(`/admin/formations/${id}/duplicate`, {});
    return response.data;
  },
};

export const AdminCatalogueAPI = {
  // Get all catalogue formations
  getAll: async (page = 1, search = "") => {
    const response = await api.get("/admin/catalogue-formations", {
      params: { page, search },
    });
    return response.data;
  },

  // Get single catalogue
  getById: async (id: number) => {
    const response = await api.get(`/admin/catalogue-formations/${id}`);
    return response.data;
  },

  // Create catalogue
  create: async (data: any) => {
    const response = await api.post("/admin/catalogue-formations", data);
    return response.data;
  },

  // Update catalogue
  update: async (id: number, data: any) => {
    const response = await api.put(`/admin/catalogue-formations/${id}`, data);
    return response.data;
  },

  // Delete catalogue
  delete: async (id: number) => {
    const response = await api.delete(`/admin/catalogue-formations/${id}`);
    return response.data;
  },

  // Duplicate catalogue
  duplicate: async (id: number) => {
    const response = await api.post(
      `/admin/catalogue-formations/${id}/duplicate`,
      {}
    );
    return response.data;
  },

  // Download PDF
  downloadPdf: async (id: number) => {
    const response = await api.get(
      `/admin/catalogue-formations/${id}/download-pdf`,
      {
        responseType: "blob",
      }
    );
    return response.data;
  },
};

export const AdminFormateurAPI = {
  getAll: async (page = 1, search = "") => {
    const response = await api.get("/admin/formateurs", {
      params: { page, search },
    });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/admin/formateurs/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post("/admin/formateurs", data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await api.put(`/admin/formateurs/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/admin/formateurs/${id}`);
    return response.data;
  },
};

export const AdminCommercialAPI = {
  getAll: async (page = 1, search = "") => {
    const response = await api.get("/admin/commerciaux", {
      params: { page, search },
    });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/admin/commerciaux/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post("/admin/commerciaux", data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await api.put(`/admin/commerciaux/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/admin/commerciaux/${id}`);
    return response.data;
  },
};
