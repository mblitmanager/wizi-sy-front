import formationService from "@/services/FormationService";
import { useQuery } from "@tanstack/react-query";

export const useFormationStagiaire = (stagiaireId: number | null) => {
  return useQuery({
    queryKey: ["formations-stagiaire", stagiaireId],
    queryFn: () =>
      stagiaireId ? formationService.getFormationStagiaire(stagiaireId) : [],
    // N'exécute la requête que si stagiaireId est défini
    enabled: !!stagiaireId,
  });
};
