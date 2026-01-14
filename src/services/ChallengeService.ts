import api from "./api";

export interface Challenge {
  id: number;
  titre: string;
  description: string;
  date_debut: string;
  date_fin: string;
  points: number;
  participation_id?: number;
  created_at?: string;
  updated_at?: string;
}

export const challengeService = {
  getAll: async (page = 1, limit = 10) => {
    const response = await api.get(`/challenges?page=${page}&limit=${limit}`);
    return {
      items: response.data.member,
      total: response.data.totalItems,
    };
  },

  getOne: async (id: number) => {
    const response = await api.get(`/challenges/${id}`);
    return response.data;
  },

  create: async (data: Partial<Challenge>) => {
    const response = await api.post("/challenges", data);
    return response.data;
  },

  update: async (id: number, data: Partial<Challenge>) => {
    const response = await api.patch(`/challenges/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/challenges/${id}`);
  },
};
