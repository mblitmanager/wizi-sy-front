import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { contactService } from "@/services";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { Contact } from "@/types/contact";
import { CONTACTEZ_NOUS } from "@/utils/constants";
import { ArrowRight } from "lucide-react";
import { ContactCard } from "@/components/Contacts/ContactCard";
import { Skeleton } from "@/components/ui/skeleton";

interface ContactsSectionProps {
  commerciaux: Contact[];
  formateurs: Contact[];
  poleRelation: Contact[];
  poleSav?: Contact[];
  showFormations?: boolean;
}

const ContactSection = ({
  commerciaux,
  formateurs,
  poleRelation,
  poleSav,
  showFormations = true,
}: ContactsSectionProps) => {
  const [showAllContacts, setShowAllContacts] = useState(false);
  const isMobile = useIsMobile();

  const {
    data: contacts,
    isLoading,
    error,
  } = useQuery<Contact[]>({
    queryKey: ["contacts"],
    queryFn: async () => {
      const data = await contactService.getContacts();
      // Fusionne tous les contacts dans un seul tableau pour l'affichage
      // Prendre un seul contact par groupe (si présent)
      const allContacts: Contact[] = [];
      if (data.formateurs && data.formateurs.length > 0) allContacts.push(data.formateurs[0]);
      if (data.commerciaux && data.commerciaux.length > 0) allContacts.push(data.commerciaux[0]);
      if (data.pole_relation && data.pole_relation.length > 0) allContacts.push(data.pole_relation[0]);
      if (data.pole_sav && data.pole_sav.length > 0) allContacts.push(data.pole_sav[0]);
      return allContacts;
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const ContactCardSkeleton = () => (
    <div className="bg-white shadow-md rounded-2xl p-5 border">
      <div className="animate-pulse">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  );

  // // Fonction améliorée pour grouper les contacts par rôle
  // const groupedContacts = (targetRole: string) =>
  //   contacts?.filter((c) => {
  //     const role = c.role || c.type;
  //     // Gérer les différents formats de rôle
  //     if (targetRole === "pole_sav") {
  //       return role === "pole_sav" || role === "Pôle SAV";
  //     }
  //     return role === targetRole;
  //   }) || [];

  // NOTE: `getContactsInOrder` removed — we directly render the contacts returned
  // from the query (which are already limited to one per group in queryFn).
  return (
    <div className="py-6 mt-2">
      <div className="">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600">
            {CONTACTEZ_NOUS}
          </h1>
          <Link
            to="/contacts"
            className="group flex items-center gap-1 text-orange-600 hover:text-orange-700 font-semibold transition-colors">
            Voir tous
            <ArrowRight className="w-4 h-4 transform transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <ContactCardSkeleton />
            <ContactCardSkeleton />
            <ContactCardSkeleton />
            <ContactCardSkeleton />
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded">
            Erreur lors du chargement des contacts
          </div>
        ) : !contacts?.length ? (
          <div className="bg-blue-100 text-blue-800 px-4 py-3 rounded">
            Aucun contact disponible.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {(contacts || []).map((contact) => (
              <ContactCard key={`${contact.role}-${contact.id}`} contact={contact} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactSection;