export interface Formation {
  id: number;
  titre: string;
  description: string;
  certification: string;
  categorie?: string;
  categoryId?: string;
  image: string;
  statut: number;
  duree: string;
  created_at: string;
  updated_at: string;
  pivot?: {
    stagiaire_id: number;
    formation_id: number;
  };
  catalogue_formation?: CatalogueFormationWithFormation | CatalogueFormation;
}

export interface CatalogueFormation {
  id: number;
  titre: string;
  description: string;
  duree: number;
  tarif: number;
  statut: string;
  image_url: string;
  cursus_pdf?: string;
  certification: string;
  formation_id: number;
  created_at: string;
  updated_at: string;
  formation?: Formation;
}

export interface Stagiaire {
  id: number;
  prenom: string;
  civilite: string;
  telephone: string;
  adresse: string;
  date_naissance: string;
  ville: string;
  code_postal: string;
  role: string;
  statut: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  formations: Formation[];

  // Nouvelle propriété optionnelle pour gérer le pivot avec media
  is_watched: boolean;
}

export interface CatalogueFormationResponse {
  stagiaire: Stagiaire;
  data: CatalogueFormation[];
  formations: Formation[];
  catalogues: CatalogueFormation[];
}

export interface CatalogueFormationWithFormation extends CatalogueFormation {
  formation: Omit<Formation, "catalogue_formation" | "pivot">;
}
