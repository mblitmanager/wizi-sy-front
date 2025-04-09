const API_URL = import.meta.env.VITE_API_BACKEND_URL;

export const fetchFormations = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token not found");

  const response = await fetch(`${API_URL}/formations`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch formations");

  const data = await response.json();
  return data.member.map((formation: any) => ({
    value: formation.id.toString(),
    label: formation.titre,
  }));
};

export const createStagiaire = async (data: any) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token not found");

  const response = await fetch(`${API_URL}/stagiaire/ajouter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      nom: data.name,
      prenom: data.prenom,
      email: data.email,
      password: data.password,
      formations: data.formations.map((f: any) => f.value),
    }),
  });

  if (!response.ok) throw new Error("Failed to create user");

  return await response.json();
};
