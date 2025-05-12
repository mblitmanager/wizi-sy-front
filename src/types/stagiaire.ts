
// Define the Image interface
export interface Image {
  id: number;
  url: string;
  name: string;
}

// Define the Formation interface
export interface Formation {
  id: number;
  titre?: string;
  description?: string;
  categorie?: string;
  image?: string;
  duree?: string;
  statut?: string;
  created_at?: string;
  updated_at?: string;
  catalogue_formation?: CatalogueFormation | CatalogueFormation[];
}

// Define the CatalogueFormation interface
export interface CatalogueFormation {
  id?: number | string;
  titre?: string;
  description?: string;
  prerequis?: string;
  certification?: string;
  tarif?: string;
  image_url?: string;
  imageUrl?: string;
  formation?: Formation;
}

// Define the ModuleFormation interface
export interface ModuleFormation {
  id?: number;
  titre?: string;
  description?: string;
  duree?: string;
  ordre?: number;
  formation_id?: number;
  created_at?: string;
  updated_at?: string;
}

// Define the StagiaireCatalogueFormation interface
export interface StagiaireCatalogueFormation {
  id?: number;
  stagiaire_id?: number;
  catalogue_formation_id?: number;
  date_debut?: string;
  date_fin?: string;
  statut?: string;
  created_at?: string;
  updated_at?: string;
  catalogue_formation?: CatalogueFormation;
}

// Define the CatalogueFormationResponse interface
export interface CatalogueFormationResponse {
  data?: CatalogueFormation[];
  member?: any;
  stagiaire?: { formations: Formation[] };
}

export interface CatalogueFormationWithFormation extends CatalogueFormation {
  id: number;
  formation_id: number;
  formation?: Formation;
}
