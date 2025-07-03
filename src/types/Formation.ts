export interface FormationFormateur {
  id: number;
  nom: string | null;
  prenom: string | null;
  email: string | null;
  image: string | null;
}

export interface Formation {
  id: number;
  titre: string;
  slug: string | null;
  description: string;
  statut: number;
  duree: string;
  categorie: string;
  image: string | null;
  icon: string | null;
  created_at: string;
  updated_at: string;
  formateur?: FormationFormateur | null;
}

export interface FormationCardData {
  id: number;
  titre: string;
  description: string;
  prerequis: string;
  image_url: string;
  cursus_pdf: string;
  tarif: string;
  certification: string;
  statut: number;
  duree: string;
  formation_id: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  formation: Formation;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  count: number;
}
