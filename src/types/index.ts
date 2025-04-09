
// Types pour les utilisateurs
export interface User {
  id: string;
  username: string;
  email: string;
  points: number;
  level: number;
  role: 'admin' | 'stagiaire' | 'formateur' | 'commercial' | 'pole_relation_client';
  token?: string;
}

// Types pour les catégories
export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  colorClass: string;
  quizCount: number;
}

// Types pour les questions et réponses
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

// Types pour les quiz
export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryId: string;
  level: 'débutant' | 'intermédiaire' | 'avancé' | 'super';
  questions: Question[];
  points: number;
}

// Types pour les résultats de quiz
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

// Types pour la progression des utilisateurs
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

// Types pour le classement
export interface LeaderboardEntry {
  userId: string;
  username: string;
  points: number;
  level: number;
  rank: number;
  avatar?: string;
}
