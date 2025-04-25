
import axios from 'axios';

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
  async getContacts(): Promise<Contacts> {
    const response = await axios.get(`${API_URL}/stagiaire/contacts`);
    return response.data;
  }

  async getFormations(): Promise<Formation[]> {
    const response = await axios.get(`${API_URL}/stagiaire/formations`);
    return response.data;
  }

  async getProgress(): Promise<Progress> {
    const response = await axios.get(`${API_URL}/stagiaire/progress`);
    return response.data;
  }

  async getParrainageStats(): Promise<ParrainageStats> {
    const [statsResponse, rewardsResponse, linkResponse] = await Promise.all([
      axios.get(`${API_URL}/stagiaire/parrainage/stats`),
      axios.get(`${API_URL}/stagiaire/parrainage/rewards`),
      axios.get(`${API_URL}/stagiaire/parrainage/link`)
    ]);

    return {
      referralCode: linkResponse.data.code,
      totalReferrals: statsResponse.data.total,
      rewards: rewardsResponse.data
    };
  }

  async getQuizzes() {
    const response = await axios.get(`${API_URL}/stagiaire/quizzes`);
    return response.data;
  }
}

export const profileService = new ProfileService();
