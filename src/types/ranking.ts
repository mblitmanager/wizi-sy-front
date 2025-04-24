export interface RankingEntry {
  userId: string;
  username: string;
  score: number;
  rank: number;
  avatarUrl?: string;
  trainingId?: string;
}

export interface TrainingRanking {
  trainingId: string;
  trainingName: string;
  entries: RankingEntry[];
}

export interface GlobalRanking {
  entries: RankingEntry[];
  lastUpdated: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  pointsRequired: number;
  type: 'badge' | 'medal' | 'trophy';
  category: 'training' | 'global' | 'special';
  trainingId?: string;
}

export interface UserRewards {
  userId: string;
  rewards: Reward[];
  totalPoints: number;
  nextReward?: Reward;
}

export interface RankingResponse {
  data: {
    global: GlobalRanking;
    byTraining: TrainingRanking[];
    userPosition: number;
    userScore: number;
  };
}

export interface RewardsResponse {
  data: UserRewards;
} 