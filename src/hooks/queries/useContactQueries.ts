import { useQuery } from "@tanstack/react-query";
import { contactService } from "@/services/ContactService";
import { useUser } from "@/hooks/useAuth";
import type { Contact } from "@/types/contact";

export interface ContactsDirectory {
  formateurs?: Contact[];
  commerciaux?: Contact[];
  pole_relation?: Contact[];
  pole_sav?: Contact[];
}

export interface PartnerContact {
  prenom?: string;
  nom?: string;
  fonction?: string;
  email?: string;
  tel?: string;
}

export interface Partner {
  identifiant: string;
  type: string;
  adresse: string;
  ville: string;
  departement: string;
  code_postal: string;
  logo?: string;
  actif?: boolean;
  contacts?: PartnerContact[];
}

export const contactKeys = {
  directory: ["contacts", "directory"] as const,
  partner: ["contacts", "partner"] as const,
};

/**
 * Annuaire des contacts du stagiaire (une seule requête partagée).
 * `select` permet à chaque écran d'en tirer la vue qui l'intéresse sans refaire d'appel.
 */
export function useContactsDirectory<T = ContactsDirectory>(
  select?: (data: ContactsDirectory) => T,
  { enabled = true }: { enabled?: boolean } = {}
) {
  const { token } = useUser();
  return useQuery({
    queryKey: contactKeys.directory,
    queryFn: () => contactService.getContacts() as Promise<ContactsDirectory>,
    select,
    enabled: enabled && !!token,
  });
}

export const allContacts = (d: ContactsDirectory): Contact[] => [
  ...(d.formateurs ?? []),
  ...(d.commerciaux ?? []),
  ...(d.pole_relation ?? []),
  ...(d.pole_sav ?? []),
];

/** Un interlocuteur par pôle (formateur, commercial, relation, SAV). */
export const mainContacts = (d: ContactsDirectory): Contact[] =>
  [d.formateurs?.[0], d.commerciaux?.[0], d.pole_relation?.[0], d.pole_sav?.[0]].filter(
    (c): c is Contact => !!c
  );

export function usePartner() {
  const { token } = useUser();
  return useQuery({
    queryKey: contactKeys.partner,
    queryFn: async () => ((await contactService.getPartner()) ?? null) as Partner | null,
    enabled: !!token,
    // Pas de partenaire = 404 côté backend : ce n'est pas une erreur à réessayer
    retry: false,
  });
}
