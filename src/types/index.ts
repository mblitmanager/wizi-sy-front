
// User type for the application
export interface User {
  id: string;
  username: string;
  email: string;
  points: number;
  level: number;
  avatar?: string;
  firstname?: string;
  lastname?: string;
  role?: string;
}

// Import and re-export types from other files for easier access
export type { 
  Quiz, 
  Question, 
  Answer, 
  Category, 
  QuizResult, 
  UserProgress, 
  LeaderboardEntry, 
  Formation,
  QuestionAnswer
} from './quiz';

export type { 
  RankingData, 
  RankingItem 
} from './ranking';

export type { 
  SponsorshipLink, 
  SponsorshipReferral, 
  SponsorshipStats 
} from './sponsorship';

export type {
  FormationDetails,
  FormationModule,
  FormationContent
} from './formation';
