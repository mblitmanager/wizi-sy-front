import { Mail, Phone, User } from "lucide-react";
import { Contact } from "@/types/contact";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ContactCardProps {
  contact: Contact;
}

const typeStyles: Record<string, string> = {
  Commercial: "bg-blue-100 text-blue-800",
  Formateur: "bg-green-100 text-green-800",
  "Pôle Relation": "bg-yellow-100 text-yellow-800",
  autre: "bg-gray-100 text-gray-800",
};

export const ContactCard = ({ contact }: ContactCardProps) => {
  // Get name from either name field or combine nom/prenom
  const displayName =
    contact.name ||
    `${contact.prenom || ""} ${contact.nom || ""}`.trim() ||
    "Nom inconnu";
  const displayPhone = contact.telephone || contact.telephone;
  return (
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
              typeStyles[contact.role]
            }`}>
            {contact.role}
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
          <a href={`tel:${contact.telephone}`} className="hover:underline">
            {contact.telephone}
          </a>
        </div>
      </div>
    </div>
  );
};
