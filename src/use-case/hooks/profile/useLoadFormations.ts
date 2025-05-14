import { useEffect, useState } from "react";
import { formationService } from "@/services/formationServiceA";
import { Formation } from "@/types";

export const useLoadFormations = () => {
  const [formations, setFormations] = useState<Formation[]>([]);

  useEffect(() => {
    formationService.getFormationsByStagiaire().then((res) => {
      setFormations(
        (res?.data || []).map((entry) => ({
          id: entry.id?.toString?.() ?? "",
          titre: entry.titre || "Unknown",
          categorie: entry.categorie,
          description: entry.description || "",
          image: entry.image,
          duree: entry.duree,
        }))
      );
    });
  }, []);

  return formations;
};
