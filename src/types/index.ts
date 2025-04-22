// User types
export interface User {
  id: string;
  username: string;
  email: string;
  points: number;
  level: number;
  role?: 'stagiaire' | 'admin';
  avatar?: string;
  token?: string;
}

// Quiz and Question types
export interface Reponse {
  id: string;
  text: string;
  isCorrect: boolean;
  position?: number;
  bankGroup?: string;
  matchPair?: string;
}

export interface Media {
  type: 'image' | 'video' | 'audio';
  url: string;
}

export type QuestionType = 
  | 'question audio'
  | 'remplir le champ vide'
  | 'carte flash'
  | 'correspondance'
  | 'choix multiples'
  | 'rearrangement'
  | 'vrai/faux'
  | 'banque de mots';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  answers?: Reponse[];
  blanks?: Array<{
    id: string;
    text: string;
    bankGroup: string;
  }>;
  wordbank?: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
    bankGroup: string;
  }>;
  flashcard?: {
    front: string;
    back: string;
  };
  matching?: Array<{
    id: string;
    text: string;
    matchPair: string;
  }>;
  audioUrl?: string;
}

export interface Quiz {
  id: string;
  titre: string;
  description: string;
  categorie: string;
  categorieId: string;
  niveau: string;
  questions: Question[];
  nbPointsTotal: number;
}

export interface QuizResult {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  completedAt: string;
  timeSpent: number;
}

// Category types
export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
  quizCount: number;
  colorClass: string;
}

// Progress types
export interface CategoryProgress {
  completedQuizzes: number;
  totalQuizzes: number;
  points: number;
}

export interface UserProgress {
  userId: string;
  categoryProgress: Record<string, CategoryProgress>;
  badges: string[];
  streak: number;
  lastActive: string;
}

// Leaderboard types
export interface LeaderboardEntry {
  userId: string;
  username: string;
  points: number;
  level: number;
  rank: number;
  avatar?: string;
}
