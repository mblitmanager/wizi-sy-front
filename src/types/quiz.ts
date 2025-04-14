import { User } from './index';

export interface Question {
  id: string;
  quiz_id: string;
  text: string;
  media?: {
    type: 'image' | 'video' | 'audio';
    url: string;
  };
  type: 'vrai faux' | 'choix multiples' | 'remplir le champ vide' | 'correspondance' | 'commander' | 'banque de mots' | 'carte flash' | 'question audio';
  // type: 'true_false' | 'multiple_choice' | 'fill_blank' | 'matching' | 'ordering' | 'word_bank' | 'flashcard' | 'audio';
  media_url?: string;
  explication?: string;
  points: number;
  astuce?: string;
  options?: string[];
  categories?: string[];
  correct_answer: string | number | boolean | string[] | number[] | Record<string, string> | Record<string, string[]> | Record<string, number[]>;
  time_limit?: number;
}

export interface Answer {
  id: string;
  question_id: string;
  text: string;
  is_correct: number;
  position?: number;
  match_pair?: string;
  bank_group?: string;
  flashcard_back?: string;
}

export interface Quiz {
  id: string;
  title: string;
  titre?: string;
  description: string;
  category: string;
  categoryId: string;
  level: 'débutant' | 'intermédiaire' | 'avancé' | 'super';
  niveau?: 'débutant' | 'intermédiaire' | 'avancé' | 'super';
  questions: Question[];
  points: number;
  nb_points_total?: number;
  timeLimit?: number;
  passingScore?: number;
  trainingId?: string;
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
  answers?: Record<string, string>;
}

export interface QuizResponse {
  data: Quiz;
}

export interface QuizSubmitResponse {
  data: {
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    results: {
      questionId: string;
      isCorrect: boolean;
      correctAnswer: string | number | boolean | string[] | number[] | Record<string, string> | Record<string, string[]>;
    }[];
  };
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
}

export interface UserProgress {
  user_id: string;
  quiz_id: string;
  score: number;
  completed_at: string;
  attempts: number;
}

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  score: number;
  rank: number;
}

export interface Formation {
  id: number;
  titre: string;
  description: string;
  categorie: string;
  image?: string;
  statut: number;
  duree: string;
  created_at: string;
  updated_at: string;
  formateurs: User[];
  stagiaires: User[];
  quizzes: Quiz[];
} 