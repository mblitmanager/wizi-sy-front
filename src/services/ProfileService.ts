import { quizManagementService } from './quiz/QuizManagementService';
import { contactService } from './ContactService';
import apiClient from '../lib/api-client';

const API_URL = import.meta.env.VITE_API_URL;

export interface Contact {
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface Contacts {
  formateur: Contact;
  commercial: Contact;
  relationClient: Contact;
}

export interface Formation {
  id: string;
  title: string;
  progress: number;
  startDate: string;
  endDate?: string;
  status: 'current' | 'completed';
}

export interface ParrainageStats {
  referralCode: string;
  totalReferrals: number;
  rewards: {
    points: number;
    quizzes: number;
  };
}

export interface Progress {
  totalPoints: number;
  completedQuizzes: number;
  streak: number;
  level: number;
  rank: number;
}

class ProfileService {
  async getContacts(): Promise<any> {
    const response = await apiClient.get('/stagiaire/contacts');
    const data = response.data;

    return {
      formateurs: data.formateurs.map((formateur: any) => ({
        id: formateur.id,
        role: formateur.role,
        prenom: formateur.prenom,
        user: {
          id: formateur.user.id,
          name: formateur.user.name,
          email: formateur.user.email,
          image: formateur.user.image,
        },
        formations: formateur.formations.map((formation: any) => ({
          id: formation.id,
          titre: formation.titre,
          description: formation.description,
          categorie: formation.categorie,
          duree: formation.duree,
        })),
      })),
      commerciaux: data.commerciaux.map((commercial: any) => ({
        id: commercial.id,
        prenom: commercial.prenom,
        role: commercial.role,
        user: {
          id: commercial.user.id,
          name: commercial.user.name,
          email: commercial.user.email,
          image: commercial.user.image,
        },
      })),
      pole_relation: data.pole_relation.map((relation: any) => ({
        id: relation.id,
        prenom: relation.prenom,
        role: relation.role,
        user: {
          id: relation.user.id,
          name: relation.user.name,
          email: relation.user.email,
          image: relation.user.image,
        },
      })),
    };
  }

  async getFormations(): Promise<Formation[]> {
    const response = await apiClient.get('/stagiaire/formations');
    return Array.isArray(response.data) ? response.data : [];
  }

  async getProgress(): Promise<Progress> {
    const response = await apiClient.get('/stagiaire/progress');
    return response.data;
  }

  async getParrainageStats(): Promise<ParrainageStats> {
    const [statsResponse, rewardsResponse, linkResponse] = await Promise.all([
      apiClient.get('/stagiaire/parrainage/stats'),
      apiClient.get('/stagiaire/parrainage/rewards'),
      apiClient.get('/stagiaire/parrainage/link')
    ]);

    return {
      referralCode: linkResponse.data.code,
      totalReferrals: statsResponse.data.total,
      rewards: rewardsResponse.data
    };
  }

  async getQuizzes() {
    const response = await apiClient.get('/stagiaire/quizzes');
    const quizzes = response.data.data || [];
    const categories = await quizManagementService.getCategories();

    return Promise.all(
      quizzes.map(quiz => quizManagementService['formatQuiz'](quiz, categories))
    );
  }
}

export const profileService = new ProfileService();
