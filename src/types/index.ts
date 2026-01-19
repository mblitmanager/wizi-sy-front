import { Stagiaire } from "./stagiaire";

export interface User {
  id: string;
  name: string;
  email: string;
  points: number;
  level: number;
  stagiaire: Stagiaire;
  role?: "stagiaire" | "admin" | "formateur" | "formatrice" | "commercial";
  is_admin?: boolean;
  avatar?: string;
  progress?: Progress;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    image: string | null;
  };
}

export interface Progress {
  totalPoints: number;
  completedQuizzes: number;
  streak: number;
  level: number;
}

export interface Category {
  id: string;
  name: string;
  text?: string;
  isCorrect?: boolean;
  position?: number;
  bankGroup?: string;
  matchPair?: string;
  flashcardBack?: string;
  icon?: string;
  slug?: string;
  formations?: any[];
  description?: string;
}

export interface Media {
  type: "image" | "video" | "audio";
  url: string;
}

export type QuestionType =
  | "question audio"
  | "remplir le champ vide"
  | "carte flash"
  | "correspondance"
  | "choix multiples"
  | "rearrangement"
  | "vrai/faux"
  | "banque de mots";

export interface Formation {
  id: string;
  title?: string;
  titre?: string;
  name?: string;
  slug?: string;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
    color?: string;
  };
  description: string;
  image?: string;
  quizzes?: Quiz[];
  totalQuizzes?: number;
  completedQuizzes?: number;
  duree?: string;
  startDate?: string;
  dateDebut?: string;
  dateFin?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  formationId: string;
  questions: Question[];
  completed: boolean;
  score?: number;
  gameMode: GameMode;
  difficulty: "easy" | "medium" | "hard";
}

export interface Question {
  id: string;
  text: string;
  quizId: string;
  answers: Answer[];
  type: GameMode;
  media?: {
    type: "image" | "audio" | "video";
    url: string;
  };
}

export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export type GameMode =
  | "multiple-choice"
  | "true-false"
  | "fill-in-blank"
  | "rearrangement"
  | "matching"
  | "flash-card"
  | "word-bank"
  | "audio-question";

export interface Ranking {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  score: number;
  position: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  deadline?: Date;
  completed: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  date: Date;
  type: "schedule" | "achievement" | "challenge" | "system";
}

export interface AgendaEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  formationId?: string;
  location?: string;
  description?: string;
}
