
import { api } from './api';

export interface SponsorshipResponse {
  code: string;
  url: string;
  shareText: string;
}

export interface SponsorshipStats {
  totalReferrals: number;
  totalPointsEarned: number;
  nextReward: {
    points: number;
    name: string;
    description: string;
    pointsRequired: number;
    pointsRemaining: number;
    reward: string;
  };
}

export interface Referral {
  id: number;
  referredUserId: number;
  referredUserName: string;
  joinDate: string;
  status: string;
  pointsEarned: number;
}

export const sponsorshipService = {
  getLink: async (): Promise<SponsorshipResponse> => {
    const response = await api.get("/stagiaire/parrainage/link");
    return response.data;
  },
  
  getReferrals: async (): Promise<Referral[]> => {
    const response = await api.get("/stagiaire/parrainage/filleuls");
    return response.data;
  },
  
  getStats: async (): Promise<SponsorshipStats> => {
    const response = await api.get("/stagiaire/parrainage/stats");
    return response.data;
  }
}; 
