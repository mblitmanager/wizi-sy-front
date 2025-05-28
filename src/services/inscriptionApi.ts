// Service d'inscription à une formation
import axios from "axios";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // ou sessionStorage, ou cookies selon votre app
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function inscrireAFormation(catalogueFormationId: number) {
  // L'utilisateur connecté est déterminé côté backend via le token JWT
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/stagiaire/inscription-catalogue-formation`,
    { catalogue_formation_id: catalogueFormationId }
  );
  return response.data;
}
