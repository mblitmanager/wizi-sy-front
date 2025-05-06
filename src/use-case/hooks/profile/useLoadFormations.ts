import { useEffect, useState } from "react";
import { formationService } from "@/services/formationServiceA";

export const useLoadFormations = () => {
  interface Formation {
    id: number;
    name: string;
  }

  const [formations, setFormations] = useState<Formation[]>([]);

  useEffect(() => {
    formationService.getFormationsByStagiaire().then((res) => {
      setFormations(
        (res?.data || []).map((entry) => ({
          id: entry.id,
          name: entry.titre || "Unknown",
        }))
      );
    });
  }, []);

  return formations;
};
