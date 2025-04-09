// User types
export interface User {
  id: string;
  username: string;
  email: string;
  points: number;
  level: number;
  role?: 'stagiaire' | 'admin';
  avatar?: string;
  token?: string; // Ajout du token pour l'authentification
}

// Quiz and Question types
export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Media {
  type: 'image' | 'video' | 'audio';
  url: string;
}

export interface Question {
  id: string;
  text: string;
  answers: Answer[];
  media?: Media;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryId?: string; // Pour faciliter le filtrage
  level: 'débutant' | 'intermédiaire' | 'avancé' | 'super';
  questions: Question[];
  points: number;
}

export interface QuizResult {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  completedAt: string;
  timeSpent: number; // en secondes
}

// Category types
export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  colorClass: string;
  quizCount: number;
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
