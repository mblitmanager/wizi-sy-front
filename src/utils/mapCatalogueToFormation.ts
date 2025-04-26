// utils/mapCatalogueToFormation.ts

import { CatalogueFormation, Formation } from "@/types/stagiaire";

interface CatalogueFormationWithFormation extends CatalogueFormation {
  formation: Omit<Formation, "catalogue_formation" | "pivot">;
}

export const mapCatalogueToFormation = (
  item: CatalogueFormationWithFormation
): Formation => ({
  ...item.formation,
  catalogue_formation: { ...item },
  pivot: {
    stagiaire_id: 0,
    formation_id: item.formation.id,
  },
});
