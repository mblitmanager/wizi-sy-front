import apiClient from "../lib/api-client";

export const contactService = {
  getCommerciaux: async () => {
    const response = await apiClient.get("/stagiaire/contacts/commerciaux");
    return response.data;
  },

  getFormateurs: async () => {
    const response = await apiClient.get("/stagiaire/contacts/formateurs");
    return response.data;
  },

  getPoleRelation: async () => {
    const response = await apiClient.get("/stagiaire/contacts/pole-relation");
    return response.data;
  },

  getContacts: async () => {
    const response = await apiClient.get("/stagiaire/contacts");
    return response.data;
  },
};
