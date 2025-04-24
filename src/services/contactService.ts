import { api } from './api';

export const contactService = {
  getCommerciaux: async () => {
    const response = await api.get("/stagiaire/contacts/commerciaux");
    return response.data;
  },

  getFormateurs: async () => {
    const response = await api.get("/stagiaire/contacts/formateurs");
    return response.data;
  },

  getPoleRelation: async () => {
    const response = await api.get("/stagiaire/contacts/pole-relation");
    return response.data;
  },

  getContacts: async () => {
    const response = await api.get("/stagiaire/contacts");
    return response.data;
  },
}; 