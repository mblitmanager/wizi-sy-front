import React from "react";
import { Layout } from "@/components/layout/Layout";
import { Mail, Phone, User } from "lucide-react";

// Données mock
const contacts = [
  {
    id: 1,
    type: "Formateur",
    name: "Alice Dupont",
    email: "alice.dupont@example.com",
    phone: "+33 6 12 34 56 78",
  },
  {
    id: 2,
    type: "Commercial",
    name: "Benjamin Leroy",
    email: "benjamin.leroy@example.com",
    phone: "+33 7 89 12 34 56",
  },
  {
    id: 3,
    type: "Pôle Relation Client",
    name: "Claire Moreau",
    email: "claire.moreau@example.com",
    phone: "+33 1 23 45 67 89",
  },
  {
    id: 4,
    type: "Formateur",
    name: "David Martin",
    email: "david.martin@example.com",
    phone: "+33 6 98 76 54 32",
  },
];

// Couleurs par type
const typeStyles: Record<string, string> = {
  Formateur: "bg-blue-100 text-blue-800",
  Commercial: "bg-green-100 text-green-800",
  "Pôle Relation Client": "bg-yellow-100 text-yellow-800",
};

export default function Contact() {
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
