export interface FormationFormateur {
  id: number;
  nom: string | null;
  prenom: string | null;
  email: string | null;
  image: string | null;
}


export interface FormationPivot {
  stagiaire_id: number;
  catalogue_formation_id: number;
  date_debut: string | null;
  date_inscription: string | null;
  date_fin: string | null;
  formateur_id: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface FormationCatalogue {
  id: number;
  titre: string;
  description: string;
  prerequis: string;
  image_url: string | null;
  cursus_pdf: string | null;
  tarif: string;
  certification: string;
  statut: number;
  duree: string;
  formation_id: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  formation?: FormationBase;
  pivot?: FormationPivot;
}

export interface FormationBase {
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
}

export interface Formation {
  pivot: FormationPivot;
  catalogue: FormationCatalogue;
  formation: FormationBase;
  formateur: FormationFormateur | null;
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
