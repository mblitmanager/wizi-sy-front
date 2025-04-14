// Types pour les utilisateurs
export interface User {
  id: string;
  username: string;
  email: string;
  points: number;
  level: number;
  role: 'admin' | 'stagiaire' | 'formateur' | 'commercial' | 'pole_relation_client';
  token?: string;
  stagiaire?: {
    id: string;
    prenom: string;
    civilite: string;
    telephone: string;
    adresse: string;
    date_naissance: string;
    ville: string;
    code_postal: string;
    statut: boolean;
    formation_id?: string;
    formateur_id?: string;
    commercial_id?: string;
  };
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
  quiz_id: string;
  text: string;
  type: 'vrai faux' | 'choix multiples' | 'remplir le champ vide' | 'correspondance' | 'commander' | 'banque de mots' | 'carte flash' | 'question audio';
  media_url?: string;
  explication?: string;
  points: number;
  astuce?: string;
  options?: string[];
  correct_answer: any;
  time_limit?: number;
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
  formateurs: any[];
  stagiaires: any[];
  quizzes: Quiz[];
}
