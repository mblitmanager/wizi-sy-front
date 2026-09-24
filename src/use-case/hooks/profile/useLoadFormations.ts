import { useStagiaireCatalogueResponse } from "@/hooks/queries/useCatalogueQueries";
import type {
  CatalogueFormation,
  CatalogueFormationResponse,
  Formation as StagiaireFormation,
} from "@/types/stagiaire";

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
  tarif?: string;
  dateDebut?: string | null;
  progression?: number | null;
  formateur?: {
    image?: string | null;
    nom?: string | null;
    prenom?: string | null;
    email?: string | null;
  } | null;
};

/** Normalise la réponse de /catalogueFormations/stagiaire pour l'affichage du profil. */
function toFormationItems(res: CatalogueFormationResponse): FormationCatalogueItem[] {
  const wrapped: {
    catalogue: CatalogueFormation;
    formation?: StagiaireFormation;
  }[] = Array.isArray(res.catalogues)
    ? (res.catalogues as unknown as {
        catalogue: CatalogueFormation;
        formation?: StagiaireFormation;
      }[])
    : [];

  const singles: CatalogueFormation[] = Array.isArray(res.data)
    ? res.data
    : Array.isArray(res.stagiaire?.catalogue_formations)
    ? (res.stagiaire.catalogue_formations as CatalogueFormation[])
    : [];

  const listFromWrapped: FormationCatalogueItem[] = wrapped.map(
    (entry) => {
      // Certaines réponses renvoient directement la formation, sans wrapper
      const item = entry.catalogue ?? (entry as unknown as CatalogueFormation);
      const titre = item.titre;
      const categorie =
        entry.formation?.categorie ?? item.formation?.categorie;
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
    }
  );

  const listFromSingles: FormationCatalogueItem[] = singles.map(
    (item) => {
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
    }
  );

  return [...listFromWrapped, ...listFromSingles];
}

/** Formations suivies par le stagiaire connecté (même requête que le reste de l'app, mise en cache). */
export const useLoadFormations = ({ enabled = true }: { enabled?: boolean } = {}) => {
  const { data, isLoading, isError } = useStagiaireCatalogueResponse(toFormationItems, { enabled });

  return {
    formations: data ?? (enabled && isLoading ? null : []),
    loading: enabled && isLoading,
    error: isError ? "Erreur lors du chargement des formations" : null,
  };
};
