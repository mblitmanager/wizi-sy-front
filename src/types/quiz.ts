
export interface Category {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  description?: string;
  quizCount?: number;
  colorClass?: string;
}

export interface Quiz {
  id: string;
  titre: string;
  description?: string;
  niveau: string;
  points: number;
  categorie: string;
  categorieId: string;
  questions?: Question[];
  duree?: number;
  completedCount?: number;
  thumbnail?: string;
  created_at?: string; // Added for filtering by date
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  points?: number;
  astuce?: string;
  explication?: string;
  audioUrl?: string;
  media_url?: string;
  answers?: Answer[];
  reponses?: Answer[]; // Required for Ordering component
  blanks?: Blank[];
  matching?: MatchingItem[];
  flashcard?: FlashCard;
  wordbank?: WordBankItem[];
  correctAnswers?: string[]; // Pour le résumé du quiz
  selectedAnswers?: string[] | Record<string, string>; // Pour le résumé du quiz
  isCorrect?: boolean; // Pour le résumé du quiz
}

export interface Answer {
  id: string;
  text: string;
  isCorrect?: boolean;
  is_correct?: boolean | number; // backend compatibility
  flashcard_back?: string | null; // backend compatibility
  reponse_correct?: boolean;
  position?: number;
  match_pair?: string | null;
  bank_group?: string | null;
  question_id?: string;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface Blank {
  id: string;
  text: string;
  position: number;
  bankGroup: string;
}

export interface MatchingItem {
  id: string;
  text: string;
  matchPair: string;
  position?: number;
}

export interface FlashCard {
  front: string;
  back: string;
}

export type QuestionType =
  | "choix multiples"
  | "vrai/faux"
  | "remplir le champ vide"
  | "rearrangement"
  | "correspondance"
  | "carte flash"
  | "banque de mots"
  | "question audio";

export interface QuizHistory {
  id: string;
  quizId: string;
  quiz?: {
    title: string;
    category: string;
    totalPoints?: number;
  };
  score: number;
  completedAt: string;
  timeSpent: number;
}

export interface QuizStats {
  totalQuizzes: number;
  totalScore: number;
  averageScore: number;
  completedQuizzes: number;
  totalPoints: number;
  averageTimeSpent: number;
}

export interface WordBankItem {
  id: string;
  text: string;
  isCorrect?: boolean;
  bankGroup?: string;
}

export interface UserProgress {
  id?: string;
  stagiaire_id?: string;
  totalScore?: number;
  completedQuizzes?: number;
  completed_quizzes?: number;
  totalQuizzes?: number;
  completionRate?: number;
  averageScore?: number;
  average_score?: number;
  currentStreak?: number;
  current_streak?: number;
  longestStreak?: number;
  longest_streak?: number;
  lastQuizDate?: string;
  last_quiz_date?: string;
  total_points?: number;
  category_progress?: {
    [key: string]: {
      completed: number;
      total: number;
    };
  };
  stats?: {
    byCategory: {
      [key: string]: {
        count: number;
        averageScore: number;
      };
    };
  };
}

export interface LeaderboardEntry {
  id: number;
  name: string;
  score: number;
  position: number;
  image?: string;
  stagiaire_id?: number;
  stagiaire_name?: string;
  image_url?: string;
  rang?: number;
  quizCount?: number;
  averageScore?: number;
  totalPoints?: number; // Added for sponsorship component 
  totalPointsEarned?: number; // Added for sponsorship component
  pointsEarned?: number; // Added for referral
}

export interface QuizResult {
  id?: string;
  score: number;
  totalPoints: number;
  quizTitle?: string;
  quiz_name?: string; // For backend compatibility
  correctAnswers: number;
  correct_answers?: number; 
  totalQuestions: number;
  total_questions?: number;
  timeSpent: number;
  questions: Question[];
  completedAt?: string;
  completed_at?: string;
  quizId?: string;
  userId?: string;
}

export interface QuizFilterPreferences {
  category: string;
  level: string;
  sortBy: 'newest' | 'popular' | 'difficulty';
  showCompleted: boolean;
}

// Add interface for QuizHistoryProps to include loading
export interface QuizHistoryProps {
  history: QuizHistory[];
  loading?: boolean;
}

// Add missing interfaces for Sponsorship components
export interface SponsorshipResponse {
  data?: {
    link?: SponsorshipLink;
    stats?: SponsorshipStats;
    referrals?: Referral[];
  };
}

export interface SponsorshipLink {
  url: string;
  shareText?: string;
}

export interface SponsorshipStats {
  totalFilleuls?: number;
  totalPoints?: number;
  totalRewards?: number;
  totalPointsEarned?: number;
  nextReward?: {
    points: number;
    name: string;
  };
}

export interface Referral {
  id: number;
  referredUserName?: string;
  joinDate?: string;
  pointsEarned?: number;
  status: string;
}
