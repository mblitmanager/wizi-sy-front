import React, { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Mail, Phone, User } from "lucide-react";
import { contactService } from "@/services/ContactService";
import apiClient from "@/lib/api-client";

// Mapping des noms d'affichage
const typeDisplayNames: Record<string, string> = {
  Formateur: "Formateur",
  Commercial: "Commercial",
  pole_relation_client: "Pôle Relation Client",
  Conseiller: "Conseiller",
  "Consultant 1er accueil": "Consultant 1er accueil",
  Interlocuteur: "Interlocuteur",
};

const typeStyles: Record<string, string> = {
  Formateur: "bg-blue-100 text-blue-800",
  Commercial: "bg-green-100 text-green-800",
  pole_relation_client: "bg-yellow-100 text-yellow-800",
  Conseiller: "bg-purple-100 text-purple-800",
  "Consultant 1er accueil": "bg-pink-100 text-pink-800",
  Interlocuteur: "bg-orange-100 text-orange-800",
};

const VITE_API_URL_IMG = import.meta.env.VITE_API_URL_MEDIA;

interface FormationStagiaire {
  id: number;
  titre: string;
  dateDebut?: string;
  dateFin?: string;
  formateur?: string;
}

interface RawFormateur {
  id: number;
  user: {
    name: string;
    email: string;
  };
  telephone?: string;
  formations?: Array<{
    id: number;
    titre: string;
    pivot?: {
      date_debut?: string;
      date_fin?: string;
    };
  }>;
}

interface RawContact {
  id: number;
  user: {
    name: string;
    email: string;
  };
  telephone?: string;
}

interface Contact {
  id: number;
  type: string;
  name: string;
  email: string;
  telephone?: string;
  formations?: FormationStagiaire[];
  role?: string;
  image?: string;
}

interface PartnerContact {
  prenom?: string;
  nom?: string;
  fonction?: string;
  email?: string;
  tel?: string;
}

interface PartnerDto {
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

export default function Contact() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [partner, setPartner] = useState<PartnerDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPartner, setIsLoadingPartner] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setIsLoading(true);
        const data = await contactService.getContacts();
        // Fusionne tous les contacts dans un seul tableau pour l'affichage
        const allContacts = [
          ...(data.formateurs || []),
          ...(data.commerciaux || []),
          ...(data.pole_relation || []),
        ];
        setContacts(allContacts);
      } catch (error) {
        console.error("Erreur lors de la récupération des contacts :", error);
        setError("Impossible de charger les contacts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
    const fetchPartner = async () => {
      try {
        setIsLoadingPartner(true);
        const data = await contactService.getPartner();
        setPartner(data);
      } catch (e) {
        // silencieux si pas de partenaire
      } finally {
        setIsLoadingPartner(false);
      }
    };
    fetchPartner();
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-4 px-2 sm:py-6 sm:px-4 lg:py-8 space-y-6 sm:space-y-8">
          <h1 className="text-3xl font-bold mb-8 text-brown-shade">
            Mes Contacts
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-2xl p-5 border">
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
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto py-4 px-2 sm:py-6 sm:px-4 lg:py-8 space-y-6 sm:space-y-8">
          <h1 className="text-3xl font-bold mb-8 text-brown-shade">
            Mes Contacts
          </h1>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-4 px-2 sm:py-6 sm:px-4 lg:py-8 space-y-6 sm:space-y-8">
        <h1 className="text-3xl font-bold mb-8 text-brown-shade">
          Mes Contacts
        </h1>

        {/* Partner header */}
        {isLoadingPartner && (
          <div className="mb-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 animate-pulse"
                style={{ width: "50%" }}
              />
            </div>
          </div>
        )}
        {partner && (
          <div className="bg-white shadow-md rounded-2xl p-5 border mb-4">
            <div className="flex gap-4 items-start">
              <div className="w-18 h-18">
                {partner.logo ? (
                  <img
                    src={`${VITE_API_URL_IMG}/${partner.logo}`}
                    alt="Logo partenaire"
                    className="w-18 h-18 object-contain rounded"
                  />
                ) : (
                  <div className="w-18 h-18 rounded bg-gray-100 flex items-center justify-center">
                    <User className="text-gray-500" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {partner.identifiant}
                  </h2>
                  <span className="text-xs px-2 py-1 rounded-full font-medium bg-amber-100 text-amber-800 border border-amber-200">
                    {partner.type}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {partner.adresse}, {partner.ville} ({partner.departement}){" "}
                  {partner.code_postal}
                </div>
                {typeof partner.actif === "boolean" && (
                  <div className="text-xs mt-1">
                    <span
                      className={`px-2 py-0.5 rounded ${
                        partner.actif
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                      {partner.actif ? "Actif" : "Inactif"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {partner.contacts && partner.contacts.length > 0 && (
              <div className="mt-4">
                <h3 className="text-md font-semibold mb-2">
                  Contacts du partenaire
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {partner.contacts.map((c, idx) => (
                    <div key={idx} className="border rounded-lg p-3 bg-gray-50">
                      <div className="font-medium">
                        {[c.prenom, c.nom].filter(Boolean).join(" ") ||
                          "Contact partenaire"}
                      </div>
                      {c.fonction && (
                        <div className="text-xs text-gray-500">
                          {c.fonction}
                        </div>
                      )}
                      {c.email && (
                        <div className="text-sm mt-1 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <a
                            href={`mailto:${c.email}`}
                            className="hover:underline">
                            {c.email}
                          </a>
                        </div>
                      )}
                      {c.tel && (
                        <div className="text-sm mt-1 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <a href={`tel:${c.tel}`} className="hover:underline">
                            {c.tel}
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {contacts.length === 0 ? (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
            Aucun contact disponible
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white shadow-md rounded-2xl p-5 border hover:shadow-lg transition">
                <div className="flex items-center mb-4">
                  {contact.image ? (
                    <img
                      src={`${VITE_API_URL_IMG}/${contact.image}`}
                      alt={contact.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                      <User className="text-gray-500" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {contact.name}
                    </h2>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        typeStyles[typeDisplayNames[contact.type]] ||
                        typeStyles[contact.type] ||
                        "bg-gray-100 text-gray-800"
                      }`}>
                      {typeDisplayNames[contact.type] || contact.type}
                    </span>
                    {contact.role && (
                      <span className="ml-2 text-xs px-2 py-1 rounded-full font-medium bg-gray-200 text-gray-700 border border-gray-300">
                        {contact.role === "pole_relation_client"
                          ? "Pôle relation client"
                          : contact.role}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-sm text-gray-600 space-y-1 mt-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <a
                      href={`mailto:${contact.email}`}
                      className="hover:underline">
                      {contact.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <a
                      href={`tel:${contact.telephone}`}
                      className="hover:underline">
                      {contact.telephone || "Non renseigné"}
                    </a>
                  </div>
                  {contact.formations && contact.formations.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
                          {contact.formations.length > 1
                            ? "Formations"
                            : "Formation"}
                        </span>
                        <span className="text-xs text-gray-400">
                          ({contact.formations.length})
                        </span>
                      </div>
                      <div className="space-y-2">
                        {contact.formations.map((formation) => (
                          <div
                            key={formation.id}
                            className="flex items-center bg-gray-50 rounded-lg px-3 py-2 shadow-sm hover:bg-blue-50 transition">
                            <div className="flex-1">
                              <span className="font-medium text-gray-800">
                                {formation.titre}
                              </span>
                              <div className="text-xs text-gray-500">
                                {formation.dateDebut && (
                                  <span className="mr-2">
                                    <span className="font-semibold">
                                      Début:
                                    </span>{" "}
                                    {new Date(
                                      formation.dateDebut
                                    ).toLocaleDateString("fr-FR")}
                                  </span>
                                )}
                                {formation.dateFin && (
                                  <span>
                                    <span className="font-semibold">Fin:</span>{" "}
                                    {new Date(
                                      formation.dateFin
                                    ).toLocaleDateString("fr-FR")}
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
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
