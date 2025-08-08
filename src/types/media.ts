import { Stagiaire } from "./stagiaire";

export type MediaType = "video" | "image" | "audio" | "document";

export interface Media {
  id: string;
  titre: string;
  description: string;
  url: string;
  type: MediaType;
  categorie: string;
  duree?: string;
  ordre?: number;
  created_at: string;
  updated_at: string;
  formation_id?: string;
  stagiaires?: { is_watched: boolean }[];
}

export interface MediaCategory {
  id: string;
  nom: string;
  description: string;
  created_at: string;
  updated_at: string;
}
