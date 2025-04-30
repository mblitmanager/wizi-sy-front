export type Media = {
  id: number;
  titre: string;
  description: string;
  url: string | null;
  type: "video" | "audio" | "document" | "image" | string;
  categorie: "tutoriel" | "astuce" | string;
  duree: number;
  ordre: number;
  created_at: string;
  updated_at: string;
  formation_id: number;
};
