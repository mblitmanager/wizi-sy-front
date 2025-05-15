export interface Category {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  description?: string;
  quizCount?: number;
  colorClass?: string;
}

export interface Participation {
  stagiaire_id: number;
  quiz_id: number;
  date: string; // Format: 'YYYY-MM-DD'
  heure: string; // Format: 'HH:MM' ou 'HH:MM:SS'
  score: number;
  deja_jouer: boolean;
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
  reponses?: Answer[];
  blanks?: Blank[];
  matching?: MatchingItem[];
  flashcard?: FlashCard;
  wordbank?: WordBankItem[];
  correctAnswers?: string[]; // Pour le résumé du quiz
  selectedAnswers?: string[]; // Pour le résumé du quiz
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
  lastQuizDate?: string;
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
}

// Extend the existing QuizResult type with missing properties
export interface QuizResult {
  id?: string;
  score: number;
  totalPoints: number;
  quizTitle: string;
  correctAnswers: number;
  correct_answers?: number;
  totalQuestions: number;
  total_questions?: number;
  timeSpent: number;
  questions: Question[];
  quiz_name?: string;
  completed_at?: string;
  quizId?: string;
}
