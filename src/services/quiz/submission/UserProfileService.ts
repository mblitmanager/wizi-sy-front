
import apiClient from '@/lib/api-client';

interface UserProfile {
  user: {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    role: string;
    created_at: string;
    updated_at: string;
    image: string | null;
  };
  stagiaire: {
    id: number;
    prenom: string;
    civilite: string;
    telephone: string;
    adresse: string;
    date_naissance: string;
    ville: string;
    code_postal: string;
    role: string;
    statut: number;
    user_id: number;
    created_at: string;
    updated_at: string;
  };
}

export class UserProfileService {
  async getStagiaireProfile(): Promise<UserProfile> {
    try {
      const response = await apiClient.get('/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Failed to fetch user profile');
    }
  }

  async getStagiaireQuizzes(): Promise<any[]> {
    try {
      const response = await apiClient.get('/quiz/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching stagiaire quizzes:', error);
      throw new Error('Failed to fetch stagiaire quizzes');
    }
  }
}

export const userProfileService = new UserProfileService();
