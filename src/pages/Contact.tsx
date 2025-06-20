import React, { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Mail, Phone, User } from "lucide-react";
import { contactService } from "@/services/contactService copy";

// Données mock
const typeStyles: Record<string, string> = {
  Formateur: "bg-blue-100 text-blue-800",
  Commercial: "bg-green-100 text-green-800",
  "Pôle Relation Client": "bg-yellow-100 text-yellow-800",
};

interface Contact {
  id: number;
  type: string;
  name: string;
  email: string;
  telephone?: string;
}

export default function Contact() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setIsLoading(true);
        const data = await contactService.getContacts();

        const formateurs = data.formateurs.map((f: any) => ({
          id: f.id,
          type: "Formateur",
          name: f.user.name,
          email: f.user.email,
          telephone: f.telephone ?? "",
        }));

        const commerciaux = data.commerciaux.map((c: any) => ({
          id: c.id,
          type: "Commercial",
          name: c.user.name,
          email: c.user.email,
          telephone: c.telephone ?? "",
        }));

        const poleRelation = data.pole_relation.map((p: any) => ({
          id: p.id,
          type: "Pôle Relation Client",
          name: p.user.name,
          email: p.user.email,
          telephone: p.telephone ?? "",
        }));

        setContacts([...formateurs, ...commerciaux, ...poleRelation]);
      } catch (error) {
        console.error("Erreur lors de la récupération des contacts :", error);
        setError("Impossible de charger les contacts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
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
                      }`}>
                      {contact.type}
                    </span>
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
