import { api } from "@/lib/api";

/** Inscription du stagiaire connecté (déterminé côté backend via le token) à une formation. */
export async function inscrireAFormation(catalogueFormationId: number) {
  const response = await api.post("/stagiaire/inscription-catalogue-formation", {
    catalogue_formation_id: catalogueFormationId,
  });
  return response.data;
}
