import { Link } from "react-router-dom";
import { Contact } from "@/types/contact";
import { CONTACTEZ_NOUS } from "@/utils/constants";
import { ArrowRight } from "lucide-react";
import { ContactCard } from "@/components/Contacts/ContactCard";
import { mainContacts, useContactsDirectory } from "@/hooks/queries/useContactQueries";

interface ContactsSectionProps {
  /** Contacts déjà chargés par la page (ex. apprenants d'un formateur). Sinon : un contact par pôle. */
  contacts?: Contact[];
  /** À fournir avec `contacts` quand la page charge elle-même la liste. */
  loading?: boolean;
  /** @deprecated Conservé pour compatibilité, sans effet. */
  showFormations?: boolean;
  title?: string;
}

const ContactSection = ({ contacts: initialContacts, loading, title }: ContactsSectionProps) => {
  const usesDirectory = !initialContacts && loading === undefined;
  const directory = useContactsDirectory(mainContacts, { enabled: usesDirectory });
  const isLoading = usesDirectory ? directory.isLoading : !!loading;
  const error = usesDirectory ? directory.error : null;
  const contacts = initialContacts ?? directory.data;

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
    <div>
      <div className="">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600">
            {title || CONTACTEZ_NOUS}
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
          <div className="grid grid-cols-1 md:grid-cols-2 Xl:grid-cols-4 gap-6">
            {(contacts || []).map((contact) => (
              <ContactCard
                key={`${contact.role}-${contact.id}`}
                contact={contact}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactSection;
