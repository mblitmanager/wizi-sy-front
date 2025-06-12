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
          titre: entry.catalogue_formation[0]?.titre || "Unknown",
          categorie: entry.categorie,
          description: entry.catalogue_formation[0]?.description || "",
          image: entry.catalogue_formation[0]?.image_url,
          duree: entry.catalogue_formation[0]?.duree,
        }))
      );
    });
  }, []);

  return formations;
};
