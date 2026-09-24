import { QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

/** Statuts pour lesquels relancer la requête ne changera rien. */
const NON_RETRYABLE_STATUSES = [400, 401, 403, 404, 422];

/**
 * Client React Query unique de l'application.
 * Exporté pour pouvoir vider le cache au logout depuis le UserContext.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Les données restent "fraîches" 5 min : pas de refetch en naviguant entre pages
      staleTime: 5 * 60 * 1000,
      gcTime: 15 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (isAxiosError(error) && NON_RETRYABLE_STATUSES.includes(error.response?.status ?? 0)) {
          return false;
        }
        return failureCount < 1;
      },
    },
  },
});
