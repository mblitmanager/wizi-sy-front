
import { CatalogueFormationWithFormation, Formation } from '@/types/stagiaire';

export const mapCatalogueToFormation = (catalogue: CatalogueFormationWithFormation): Formation => {
  return {
    id: catalogue.formation.id || 0,
    titre: catalogue.formation.titre || catalogue.titre,
    description: catalogue.formation.description || catalogue.description,
    categorie: catalogue.formation.categorie,
    duree: catalogue.duree || '0',
    catalogue_formation: catalogue,
  };
};
