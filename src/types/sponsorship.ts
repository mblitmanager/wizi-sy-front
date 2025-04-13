export interface Referral {
  id: string;
  userId: string;
  referredUserId: string;
  referredUserName: string;
  status: 'pending' | 'active' | 'completed';
  joinDate: string;
  pointsEarned: number;
}

export interface SponsorshipStats {
  totalReferrals: number;
  activeReferrals: number;
  totalPointsEarned: number;
  nextReward?: {
    pointsRequired: number;
    pointsRemaining: number;
    reward: string;
  };
}

export interface SponsorshipLink {
  id: string;
  userId: string;
  code: string;
  url: string;
  shareText: string;
}

export interface SponsorshipResponse {
  data: {
    link: SponsorshipLink;
    stats: SponsorshipStats;
    referrals: Referral[];
  };
} 