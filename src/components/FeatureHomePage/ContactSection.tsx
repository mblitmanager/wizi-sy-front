import { useEffect, useState } from "react";
import { User, Mail, Phone, ChevronDown, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { contactService } from "@/services";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { Contact } from "@/types/contact";
import { CONTACTEZ_NOUS } from "@/utils/constants";

const typeStyles: Record<string, string> = {
  Formateur: "bg-blue-100 text-blue-800",
  Commercial: "bg-green-100 text-green-800",
  "Pôle Relation Client": "bg-yellow-100 text-yellow-800",
};

interface FormationStagiaire {
  id: number;
  titre: string;
  dateDebut?: string;
  dateFin?: string;
  formateur?: string;
}

interface ContactsSectionProps {
  commerciaux: Contact[];
  formateurs: Contact[];
  poleRelation: Contact[];
}

const ContactSection = ({
  commerciaux,
  formateurs,
  poleRelation,
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
      const allContacts = [
        ...(data.formateurs || []),
        ...(data.commerciaux || []),
        ...(data.pole_relation || [])
      ];
      return allContacts;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes de cache
    retry: 2, // 2 tentatives en cas d'erreur
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

  const renderContactCard = (contact: Contact) => (
    <div
      key={`${contact.type}-${contact.id}`}
      className="bg-white shadow-md rounded-2xl p-5 border hover:shadow-lg transition"
    >
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
          <User className="text-gray-500" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {contact.name}
          </h2>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              typeStyles[contact.type]
            }`}
          >
            {contact.type}
          </span>
        </div>
      </div>

      <div className="text-sm text-gray-600 space-y-1 mt-2">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          <a href={`mailto:${contact.email}`} className="hover:underline">
            {contact.email}
          </a>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4" />
          <a href={`tel:${contact.phone}`} className="hover:underline">
            {contact.telephone || "Non renseigné"}
          </a>
        </div>
        {contact.formation && contact.formation.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
                {contact.formations.length > 1 ? "Formations" : "Formation"}
              </span>
              <span className="text-xs text-gray-400">
                ({contact.formations.length})
              </span>
            </div>
            <div className="space-y-2">
              {contact.formations.map((formation) => (
                <div
                  key={formation.id}
                  className="flex items-center bg-gray-50 rounded-lg px-3 py-2 shadow-sm hover:bg-blue-50 transition"
                >
                  <div className="flex-1">
                    <span className="font-medium text-gray-800">{formation.titre}</span>
                    <div className="text-xs text-gray-500">
                      {formation.dateDebut && (
                        <span className="mr-2">
                          <span className="font-semibold">Début:</span>{" "}
                          {new Date(formation.dateDebut).toLocaleDateString("fr-FR")}
                        </span>
                      )}
                      {formation.dateFin && (
                        <span>
                          <span className="font-semibold">Fin:</span>{" "}
                          {new Date(formation.dateFin).toLocaleDateString("fr-FR")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const groupedContacts = (type: string) =>
    contacts.filter((c) => c.type === type);

  // Afficher un seul contact de chaque type (Formateur, Commercial, Pôle Relation Client)
  const getVisibleContacts = () => {
    return [
      groupedContacts("Commercial")[0],
      groupedContacts("Formateur")[0],
      groupedContacts("Pôle Relation Client")[0],
    ].filter(Boolean);
  };

  return (
    <div className="py-6 mt-2">
      <div className="container mx-auto py-4 px-2 sm:py-6 sm:px-4 lg:py-6 space-y-6 sm:space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl md:text-2xl text-orange-400 font-bold">
            {CONTACTEZ_NOUS}
          </h1>
          <Link to="/contacts">
            <Button variant="ghost" className="text-orange-600 font-bold" size="sm">
              Voir tous 
            </Button>
          </Link>
        </div>
        {/* Ligne orange décorative */}
        <div className="relative mb-2">
          <span className="absolute left-1/2 transform -translate-x-1/2 w-16 h-1 bg-orange-400 rounded-full"></span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {getVisibleContacts().map(renderContactCard)}
          </div>
        )}

        {isMobile &&
          !showAllContacts &&
          !isLoading &&
          contacts &&
          contacts.length > 3 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAllContacts(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-amber-600 bg-amber-50 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                Voir plus de contacts
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>
            </div>
          )}
      </div>
    </div>
  );
};

export default ContactSection;
