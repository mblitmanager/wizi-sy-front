import { useEffect, useState } from "react";
import { formationService } from "@/services/formationServiceA";
import { Formation } from "@/types";

export const useLoadFormations = () => {
  const [formations, setFormations] = useState<Formation[]>([]);

  useEffect(() => {
    formationService.getFormationsByStagiaire().then((res) => {
      setFormations(
        (res?.data || []).map((entry) => ({
          id: entry.formation?.id?.toString?.() ?? "",
          titre: entry.formation?.titre || entry.titre || "Unknown",
          categorie: entry.formation?.categorie,
          description: entry.formation?.description || entry.description || "",
          image: entry.formation?.image_url || entry.image || null,
          duree: entry.formation?.duree || entry.duree || "",
          formateur: entry.formateur || null,
        }))
      );
    });
  }, []);

  return formations;
};
