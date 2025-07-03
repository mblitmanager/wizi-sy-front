import { useEffect, useState } from "react";
import { formationService } from "@/services/formationServiceA";
import { Formation } from "@/types/Formation";

export const useLoadFormations = () => {
  const [formations, setFormations] = useState<Formation[]>([]);

  useEffect(() => {
    formationService.getFormationsByStagiaire().then((res) => {
      setFormations(
        (res?.data || []).map((entry) => {
          // On récupère le formateur directement (backend le fournit à la racine)
          return {
            id: Number(entry.id),
            titre: entry.catalogue_formation?.[0]?.titre || entry.titre || "Unknown",
            slug: (entry as any).slug ?? null,
            description: entry.catalogue_formation?.[0]?.description || entry.description || "",
            statut: entry.statut ?? 1,
            duree: entry.catalogue_formation?.[0]?.duree || entry.duree || "",
            categorie: entry.categorie || "",
            image: entry.catalogue_formation?.[0]?.image_url || entry.image || null,
            icon: (entry as any).icon ?? null,
            created_at: entry.created_at || "",
            updated_at: entry.updated_at || "",
            formateur: (entry as any).formateur ?? null,
          };
        })
      );
    });
  }, []);

  return formations;
};
