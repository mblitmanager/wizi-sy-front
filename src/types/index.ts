
// src/types/index.ts

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  avatar?: string;
  stagiaire?: {
    id: string;
    prenom: string;
    image?: string | null;
  };
  points?: number;
  level?: number;
  progress?: {
    totalPoints: number;
    completedQuizzes: number;
    streak: number;
    level: number;
  };
}

export interface Contact {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  fonction: string;
  image: string | null;
}
