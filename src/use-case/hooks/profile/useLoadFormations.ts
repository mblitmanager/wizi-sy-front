import { useEffect, useState } from "react";
import { catalogueFormationApi } from "@/services/catalogueFormationApi";
import type { CatalogueFormation, CatalogueFormationResponse, Formation as StagiaireFormation } from "@/types/stagiaire";

type FormationCatalogueItem = {
  id?: string | number;
  formation?: {
    titre?: string;
    categorie?: string;
    description?: string;
    image?: string | null;
    duree?: string;
  } | null;
  catalogue?: {
    id: number;
    titre: string;
    description: string;
    image_url: string | null;
    duree: string;
    certification?: string;
    tarif?: string;
    categorie?: string;
  } | null;
  titre?: string;
  categorie?: string;
  description?: string;
  image?: string | null;
  duree?: string;
  formateur?: {
    image?: string | null;
    nom?: string | null;
    prenom?: string | null;
    email?: string | null;
  } | null;
};

export const useLoadFormations = (stagiaireId: number | null = null) => {
  const [formations, setFormations] = useState<FormationCatalogueItem[]>([]);

  useEffect(() => {
    // Endpoint sans ID (dépend du token): /catalogueFormations/stagiaire
    catalogueFormationApi
      .getCatalogueFormationStagiaire()
      .then((res: CatalogueFormationResponse) => {
        const wrapped: { catalogue: CatalogueFormation; formation?: StagiaireFormation }[] = Array.isArray(res.catalogues)
          ? (res.catalogues as unknown as { catalogue: CatalogueFormation; formation?: StagiaireFormation }[])
          : [];
        const singles: CatalogueFormation[] = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.stagiaire?.catalogue_formations)
          ? (res.stagiaire.catalogue_formations as CatalogueFormation[])
          : [];

        const listFromWrapped: FormationCatalogueItem[] = wrapped.map((entry) => {
          const item = entry.catalogue;
          const titre = item.titre;
          const categorie = entry.formation?.categorie ?? item.formation?.categorie;
          const description = item.description;
          const image = item.image_url ?? null;
          const duree = item.duree != null ? String(item.duree) : "";
          return {
            id: item.id,
            catalogue: {
              id: item.id,
              titre,
              description,
              image_url: image,
              duree,
              certification: item.certification,
              tarif: item.tarif != null ? String(item.tarif) : "",
              categorie,
            },
            formation: entry.formation ?? item.formation ?? null,
            titre,
            categorie,
            description,
            image,
            duree,
            formateur: null,
          };
        });

        const listFromSingles: FormationCatalogueItem[] = singles.map((item) => {
          const titre = item.titre;
          const categorie = item.formation?.categorie;
          const description = item.description;
          const image = item.image_url ?? null;
          const duree = item.duree != null ? String(item.duree) : "";
          return {
            id: item.id,
            catalogue: {
              id: item.id,
              titre,
              description,
              image_url: image,
              duree,
              certification: item.certification,
              tarif: item.tarif != null ? String(item.tarif) : "",
              categorie,
            },
            formation: item.formation ?? null,
            titre,
            categorie,
            description,
            image,
            duree,
            formateur: null,
          };
        });

        setFormations([...listFromWrapped, ...listFromSingles]);
      })
      .catch(() => setFormations([]));
  }, [/* no ID needed: depends on auth token */]);

  return formations;
};
