
export interface Formation {
  id: number;
  titre: string;
  description: string;
  categorie?: string;
  categoryId?: string;
  duree: string | number;
  catalogue_formation: CatalogueFormationWithFormation | CatalogueFormation;
}

export interface CatalogueFormation {
  id: number;
  titre: string;
  description: string;
  prerequis?: string;
  tarif?: string;
  certification?: string;
  duree?: string;
  image_url?: string;
  formation?: {
    titre: string;
    description: string;
    categorie?: string;
  };
}

export interface CatalogueFormationWithFormation extends CatalogueFormation {
  formation: {
    id: number;
    titre: string;
    description: string;
    categorie?: string;
  };
}

export interface CatalogueFormationResponse {
  stagiaire: {
    formations: Formation[];
  };
}
