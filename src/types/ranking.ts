
export interface RankingEntry {
  id: number;
  stagiaire_id: number;
  stagiaire_name: string;
  score: number;
  position: number;
  image_url?: string;
}

export interface UserRankingStats {
  totalQuizzes: number;
  totalScore: number;
  averageScore: number;
  highestScore: number;
  completionRate: number;
  rank: number;
}
