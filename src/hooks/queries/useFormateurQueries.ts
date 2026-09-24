import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Paginated<T> {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
}

const PER_PAGE = 5;

/**
 * /formateur/dashboard/stats renvoie à la fois la synthèse et deux listes paginées.
 * Les widgets du tableau de bord partagent la même requête tant qu'ils sont en page 1 :
 * un seul appel au chargement au lieu de trois.
 */
export function useFormateurDashboardStats<T = Record<string, unknown>>({
  formationsPage = 1,
  formateursPage = 1,
}: { formationsPage?: number; formateursPage?: number } = {}) {
  return useQuery({
    queryKey: ["formateur", "dashboard-stats", formationsPage, formateursPage],
    queryFn: async (): Promise<T> => {
      const res = await api.get("/formateur/dashboard/stats", {
        params: {
          formations_page: formationsPage,
          formations_per_page: PER_PAGE,
          formateurs_page: formateursPage,
          formateurs_per_page: PER_PAGE,
        },
      });
      return res.data;
    },
    // Changement de page : on garde l'ancienne page affichée pendant le chargement
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
}
