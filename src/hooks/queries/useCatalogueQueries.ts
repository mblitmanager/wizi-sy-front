import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, unwrapList } from "@/lib/api";
import { useUser } from "@/hooks/useAuth";
import { catalogueFormationApi } from "@/services/catalogueFormationApi";
import type { CatalogueFormation, CatalogueFormationResponse } from "@/types/stagiaire";

/**
 * Données catalogue partagées entre les pages (accueil, classement, contacts, profil).
 * Une seule requête par session grâce au cache React Query, au lieu d'un appel par page.
 */
export const catalogueKeys = {
  all: ["catalogue-formations"] as const,
  list: () => [...catalogueKeys.all, "list"] as const,
  stagiaire: () => [...catalogueKeys.all, "stagiaire"] as const,
};

export function useCatalogueFormations() {
  const { token } = useUser();
  return useQuery({
    queryKey: catalogueKeys.list(),
    queryFn: async () => {
      const res = await api.get("/catalogueFormations/formations");
      return unwrapList<CatalogueFormation>(res.data);
    },
    enabled: !!token,
    staleTime: 15 * 60 * 1000,
  });
}

/** Réponse brute de /catalogueFormations/stagiaire, partagée par toutes les vues qui en dérivent. */
export function useStagiaireCatalogueResponse<T = CatalogueFormationResponse>(
  select?: (data: CatalogueFormationResponse) => T,
  { enabled = true }: { enabled?: boolean } = {}
) {
  const { token } = useUser();
  return useQuery({
    queryKey: catalogueKeys.stagiaire(),
    queryFn: () => catalogueFormationApi.getCatalogueFormationStagiaire(),
    select,
    enabled: enabled && !!token,
  });
}

/**
 * Selon les versions du backend, `catalogues` contient soit les formations,
 * soit des objets `{ catalogue, formation }` : on normalise vers la formation.
 */
function toStagiaireCatalogues(res: CatalogueFormationResponse): CatalogueFormation[] {
  const entries: unknown[] = Array.isArray(res?.catalogues) ? res.catalogues : unwrapList(res);
  return entries.map((entry) => {
    const wrapped = entry as { catalogue?: CatalogueFormation };
    return wrapped.catalogue ?? (entry as CatalogueFormation);
  });
}

/** Formations du catalogue auxquelles le stagiaire est déjà inscrit. */
export function useStagiaireCatalogues() {
  return useStagiaireCatalogueResponse(toStagiaireCatalogues);
}

/** Formations du catalogue que le stagiaire ne suit pas encore (pour les encarts de promotion). */
export function useSuggestedFormations() {
  const catalogue = useCatalogueFormations();
  const mine = useStagiaireCatalogues();

  const suggestions = useMemo(() => {
    const all = catalogue.data ?? [];
    const ownedIds = new Set((mine.data ?? []).map((f) => String(f.id)));
    return ownedIds.size ? all.filter((f) => !ownedIds.has(String(f.id))) : all;
  }, [catalogue.data, mine.data]);

  return {
    suggestions,
    isLoading: catalogue.isLoading || mine.isLoading,
  };
}
