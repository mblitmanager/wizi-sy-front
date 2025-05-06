export interface Formation {
  id: number;
  titre: string;
  description: string;
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
  prerequis?: string;
  tarif?: string;
  certification?: string;
  statut: number;
  duree?: string;
  image_url?: string;
  formation?: {
    titre: string;
    description: string;
    categorie?: string;
  };

  created_at: string;
  updated_at: string;
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
}

export interface CatalogueFormationResponse {
  stagiaire: Stagiaire;
  formations: Formation[];
  catalogues: CatalogueFormation[];
}

export interface CatalogueFormationWithFormation extends CatalogueFormation {
  formation: Omit<Formation, "catalogue_formation" | "pivot">;
}
