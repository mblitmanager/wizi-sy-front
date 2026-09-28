import type { User } from "@/types";

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

/**
 * Informations du compte, quelle que soit la forme de l'objet utilisateur :
 *  - après `POST /login` : modèle User à plat (`id`, `name`, `email`, `image`, `stagiaire`) ;
 *  - après `GET /me`     : `{ user: {...}, stagiaire: {...} }`.
 */
export function getUserAccount(user: User | null | undefined): UserAccount {
  const flat = user as (User & { image?: string | null }) | null | undefined;
  const nested = user?.user;
  return {
    id: String(nested?.id ?? flat?.id ?? ""),
    name: nested?.name || flat?.name || "",
    email: nested?.email || flat?.email || "",
    image: nested?.image ?? flat?.image ?? null,
  };
}
