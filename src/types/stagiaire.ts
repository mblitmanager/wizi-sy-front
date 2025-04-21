export interface CatalogueFormation {
  id: number;
  titre: string;
  description: string;
  prerequis: string;
  tarif: string;
  certification: string;
  statut: number;
  duree: string;
  image_url: string;
  formation_id: number;
  created_at: string;
  updated_at: string;
}

export interface Formation {
  id: number;
  titre: string;
  description: string;
  categorie: string;
  image: string;
  statut: number;
  duree: string;
  created_at: string;
  updated_at: string;
  pivot: {
    stagiaire_id: number;
    formation_id: number;
  };
  catalogue_formation?: CatalogueFormation;
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
  formations: Formation[]; // doublon avec stagiaire.formations mais utile
  catalogues: CatalogueFormation[];
}
