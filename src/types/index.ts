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
  flashcardBack?: string;
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

export interface Response {
  id: string;
  text: string;
  is_correct: boolean;
  question_id: string;
  created_at?: string;
  updated_at?: string;
  position?: number;
  match_pair?: string;
  bank_group?: string;
  flashcard_back?: string;
}

export interface Answer {
  id: number;
  text: string;
  is_correct: number;
  position: string | null;
  match_pair: string | null;
  bank_group: string | null;
  flashcard_back: string | null;
  question_id: number;
  created_at: string | null;
  updated_at: string | null;
}
export interface Question {
  id: number;
  quiz_id: number;
  text: string;
  type: string;
  explication: string | null;
  points: string;
  astuce: string | null;
  media_url: string | null;
  created_at: string;
  updated_at: string;
  reponses: Answer[];
}

export interface Quiz {
  id: string;
  titre: string;
  description: string;
  categorie: string;
  categorieId: string;
  niveau: string;
  questions: Question[];
  nb_points_total: number;
  duree: number;
  formation_id: string;
  created_at: string;
  updated_at: string;
}

export interface QuizResult {
  id: string;
  quizId: string;
  stagiaireId: string;
  formationId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  completedAt: string;
  timeSpent: number;
  questions: Array<{
    id: string;
    text: string;
    type: string;
    selectedAnswers: string[];
    correctAnswers: string[];
    answers: Array<{
      id: string;
      text: string;
      isCorrect: boolean;
    }>;
    isCorrect: boolean;
  }>;
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
