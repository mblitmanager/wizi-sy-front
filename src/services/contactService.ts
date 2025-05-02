import { api } from "./api";

export const contactService = {
  getCommerciaux: async (page = 1) => {
    const response = await api.get("/stagiaire/contacts/commerciaux", {
      params: { page },
    });
    return response.data;
  },
  getFormateurs: async (page = 1) => {
    const response = await api.get("/stagiaire/contacts/formateurs", {
      params: { page },
    });
    return response.data;
  },
  getPoleRelation: async (page = 1) => {
    const response = await api.get("/stagiaire/contacts/pole-relation", {
      params: { page },
    });
    return response.data;
  },
  getContacts: async (page = 1) => {
    const response = await api.get("/stagiaire/contacts", {
      params: { page },
    });
    return response.data;
  },
};
