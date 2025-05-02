
import { api } from './api';
import { MediaCategory } from '@/types/media';
import { Contact, ContactResponse } from '@/types/contact';
import { Formation } from '@/types/stagiaire';
import { UserRankingStats } from '@/types/ranking';

interface StagiaireProfile {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  date_naissance: string;
  lieu_naissance: string;
  nationalite: string;
  sexe: string;
  situation_familiale: string;
  niveau_etude: string;
  domaine_etude: string;
  annee_experience: number;
  type_contrat: string;
  disponibilite: string;
  pretention_salariale: number;
  photo_url: string;
  cv_url: string;
  lettre_motivation_url: string;
  portfolio_url: string;
  linkedin_url: string;
  github_url: string;
  twitter_url: string;
  facebook_url: string;
  instagram_url: string;
  telegram_url: string;
  whatsapp_url: string;
  skype_url: string;
  created_at: string;
  updated_at: string;
}

interface StagiaireQuiz {
  id: number;
  titre: string;
  description: string;
  duree: number;
  points: number;
  created_at: string;
  updated_at: string;
}

interface ParrainageStats {
  referralCode: string;
  totalReferrals: number;
  rewards: {
    total: number;
    pending: number;
    received: number;
  };
}

export const userProfileService = {
  getStagiaireProfile: async (): Promise<StagiaireProfile> => {
    try {
      const response = await api.get<StagiaireProfile>('/stagiaire/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching stagiaire profile', error);
      throw error;
    }
  },

  getStagiaireQuizzes: async (): Promise<StagiaireQuiz[]> => {
    try {
      const response = await api.get<StagiaireQuiz[]>('/stagiaire/quizzes');
      return response.data;
    } catch (error) {
      console.error('Error fetching stagiaire quizzes', error);
      return [];
    }
  },

  getMediaCategories: async (): Promise<MediaCategory[]> => {
    try {
      const response = await api.get<{ data: MediaCategory[] }>('/media-categories');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching media categories', error);
      return [];
    }
  },

  updateStagiaireProfile: async (profileData: Partial<StagiaireProfile>): Promise<StagiaireProfile> => {
    try {
      const response = await api.put<StagiaireProfile>('/stagiaire/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating stagiaire profile', error);
      throw error;
    }
  },

  uploadStagiairePhoto: async (photo: File): Promise<StagiaireProfile> => {
    try {
      const formData = new FormData();
      formData.append('photo', photo);
      const response = await api.post<StagiaireProfile>('/stagiaire/profile/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading stagiaire photo', error);
      throw error;
    }
  },

  // Adding methods used in Profile.tsx
  getContacts: async (): Promise<ContactResponse> => {
    try {
      const response = await api.get<ContactResponse>('/stagiaire/contacts');
      return response.data;
    } catch (error) {
      console.error('Error fetching contacts', error);
      return {
        commerciaux: [],
        formateurs: [],
        poleRelation: []
      };
    }
  },

  getFormations: async (): Promise<Formation[]> => {
    try {
      const response = await api.get<{ data: Formation[] }>('/stagiaire/formations');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching formations', error);
      return [];
    }
  },

  getProgress: async (): Promise<UserRankingStats> => {
    try {
      const response = await api.get<UserRankingStats>('/stagiaire/progress');
      return response.data;
    } catch (error) {
      console.error('Error fetching progress', error);
      return {
        totalQuizzes: 0,
        totalScore: 0,
        averageScore: 0,
        highestScore: 0,
        completionRate: 0,
        rank: 0
      };
    }
  },

  getParrainageStats: async (): Promise<ParrainageStats> => {
    try {
      const response = await api.get<ParrainageStats>('/stagiaire/parrainage');
      return response.data;
    } catch (error) {
      console.error('Error fetching parrainage stats', error);
      return {
        referralCode: '',
        totalReferrals: 0,
        rewards: {
          total: 0,
          pending: 0,
          received: 0
        }
      };
    }
  }
};
