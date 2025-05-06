import { useQuery } from "@tanstack/react-query";
import formationService from "@/services/FormationService";
import { Formation } from "@/types/stagiaire";

export const useFormations = () => {
  return useQuery<Formation[]>({
    queryKey: ["formations"],
    queryFn: async () => {
      const res = await formationService.getFormations();
      return res.member || [];
    },
    // 10 minutes
    staleTime: 1000 * 60 * 10,
  });
};
