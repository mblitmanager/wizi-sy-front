import React, { useEffect, useState, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { Mail, Phone, User } from "lucide-react";
import { contactService } from "@/services/ContactService";
import AdCatalogueBlock from "@/components/FeatureHomePage/AdCatalogueBlock";
import { CatalogueFormation } from "@/types/stagiaire";
import apiClient from "@/lib/api-client";
import { ContactCard } from "@/components/Contacts/ContactCard";
import type { Contact } from "@/types/contact";

const VITE_API_URL_IMG = import.meta.env.VITE_API_URL_MEDIA;

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
          ...(data.pole_sav || []),
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

  // Temporary placeholders for catalogue data used by AdCatalogueBlock
  const [stagiaireCatalogues, setStagiaireCatalogues] = useState<
    CatalogueFormation[]
  >([]);
  const [catalogueData, setCatalogueData] = useState<CatalogueFormation[]>([]);

  // Fetch catalogue data and stagiaire-specific catalogues
  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    let mounted = true;
    apiClient
      .get("/catalogueFormations/formations")
      .then((res) => {
        if (!mounted) return;
        const d = res?.data;
        if (Array.isArray(d)) setCatalogueData(d);
        else if (d && Array.isArray(d.data)) setCatalogueData(d.data);
        else setCatalogueData([]);
      })
      .catch(() => setCatalogueData([]));

    apiClient
      .get("/catalogueFormations/stagiaire")
      .then((res) => {
        if (!mounted) return;
        setStagiaireCatalogues(res?.data?.catalogues || []);
      })
      .catch(() => setStagiaireCatalogues([]));

    return () => {
      mounted = false;
    };
  }, []);

  const filteredFormations = useMemo<CatalogueFormation[]>(() => {
    if (!stagiaireCatalogues.length) return catalogueData;
    const ids = new Set(stagiaireCatalogues.map((f) => f.id));
    return catalogueData.filter((f) => !ids.has(f.id));
  }, [catalogueData, stagiaireCatalogues]);

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
                    <div
                      key={c.email ? c.email : c.tel ? c.tel : `partner-${idx}`}
                      className="border rounded-lg p-3 bg-gray-50">
                      <div className="font-medium">
                        {c.prenom || c.nom
                          ? `${c.prenom || ""} ${
                              c.nom ? c.nom.toUpperCase() : ""
                            }`.trim()
                          : "Contact partenaire"}
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
              <ContactCard
                key={`${contact.role || contact.type}-${contact.id}`}
                contact={contact}
              />
            ))}
          </div>
        )}

        <div className="flex-1">
          <AdCatalogueBlock formations={filteredFormations.slice(0, 4)} />
        </div>
      </div>
    </Layout>
  );
}
