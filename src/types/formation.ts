import { Quiz } from './quiz';

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