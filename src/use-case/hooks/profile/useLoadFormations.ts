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
          titre: entry.catalogue_formation?.[0]?.titre || entry.titre || "Unknown",
          categorie: entry.categorie,
          description: entry.catalogue_formation?.[0]?.description || entry.description || "",
          image: entry.catalogue_formation?.[0]?.image_url || entry.image || null,
          duree: entry.catalogue_formation?.[0]?.duree || entry.duree || "",
          formateur: entry.formateur || null,
        }))
      );
    });
  }, []);

  return formations;
};
