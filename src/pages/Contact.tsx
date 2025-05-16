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
  phone?: string;
}

export default function Contact() {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await contactService.getContacts();

        const formateurs = data.formateurs.map((f: any) => ({
          id: f.id,
          type: "Formateur",
          name: f.user.name,
          email: f.user.email,
          phone: f.user.phone ?? "", // si `user.phone` existe
        }));

        const commerciaux = data.commerciaux.map((c: any) => ({
          id: c.id,
          type: "Commercial",
          name: c.user.name,
          email: c.user.email,
          phone: c.user.phone ?? "",
        }));

        const poleRelation = data.pole_relation.map((p: any) => ({
          id: p.id,
          type: "Pôle Relation Client",
          name: p.user.name,
          email: p.user.email,
          phone: p.user.phone ?? "",
        }));

        setContacts([...formateurs, ...commerciaux, ...poleRelation]);
      } catch (error) {
        console.error("Erreur lors de la récupération des contacts :", error);
      }
    };

    fetchContacts();
  }, []);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Mes Contacts</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((contact) => (
            <div
              key={contact.id}
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
                  <a
                    href={`mailto:${contact.email}`}
                    className="hover:underline"
                  >
                    {contact.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${contact.phone}`} className="hover:underline">
                    {contact.phone}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
