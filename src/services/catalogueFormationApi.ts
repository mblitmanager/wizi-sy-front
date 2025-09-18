import axios from 'axios';
import { CatalogueFormationResponse } from '@/types/stagiaire';

const API_URL = import.meta.env.VITE_API_URL;

export const catalogueFormationApi = {
  getCatalogueFormation: async (stagiaireId: string): Promise<CatalogueFormationResponse> => {
    try {
      const response = await axios.get<CatalogueFormationResponse>(
        `${API_URL}/catalogueFormations/stagiaire/${stagiaireId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du catalogue:', error);
      throw error;
    }
  },
  getCatalogueFormationStagiaire: async (): Promise<CatalogueFormationResponse> => {
    try {
      const response = await axios.get<CatalogueFormationResponse>(
        `${API_URL}/catalogueFormations/stagiaire`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du catalogue:', error);
      throw error;
    }
  },

  getFormationDetails: async (formationId: string): Promise<any> => {
    try {
      const response = await axios.get(
        `${API_URL}/formations/${formationId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de la formation:', error);
      throw error;
    }
  },

  getFormationQuizzes: async (formationId: string): Promise<any[]> => {
    try {
      const response = await axios.get(
        `${API_URL}/formations/${formationId}/quizzes`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des quiz de la formation:', error);
      throw error;
    }
  }
}; 