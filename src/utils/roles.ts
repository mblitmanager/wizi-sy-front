/**
 * Normalisation des rôles utilisateur.
 * L'API renvoie selon les endpoints `user.role` ou `user.user.role`, parfois au féminin
 * ("formatrice", "commerciale") ou en toutes lettres ("administrateur").
 */

export type AppRole = "stagiaire" | "formateur" | "commercial" | "admin";

const ROLE_ALIASES: Record<string, AppRole> = {
  stagiaire: "stagiaire",
  formateur: "formateur",
  formatrice: "formateur",
  commercial: "commercial",
  commerciale: "commercial",
  admin: "admin",
  administrateur: "admin",
  administrator: "admin",
};

type UserLike = { role?: string | null; user?: { role?: string | null } | null } | null | undefined;

export function normalizeRole(role?: string | null): AppRole {
  return ROLE_ALIASES[role?.trim().toLowerCase() ?? ""] ?? "stagiaire";
}

export function getUserRole(user: UserLike): AppRole {
  return normalizeRole(user?.role ?? user?.user?.role);
}

/** Page d'accueil de chaque rôle après connexion. */
export const ROLE_HOME: Record<AppRole, string> = {
  stagiaire: "/",
  formateur: "/formateur/dashboard",
  commercial: "/commercial/dashboard",
  admin: "/admin/statistics",
};
