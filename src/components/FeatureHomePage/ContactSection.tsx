// components/ContactSection.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { ChevronRight, Mail, Phone, User } from "lucide-react";
import { Skeleton } from "@mui/material";

interface Contact {
  id: number;
  name: string;
  email: string;
  telephone?: string;
  type?: string;
  avatar?: string;
}

interface ContactSectionProps {
  commerciaux: Contact[];
  formateurs: Contact[];
  poleRelation: Contact[];
}

const ContactSection: React.FC<ContactSectionProps> = ({
  commerciaux,
  formateurs,
  poleRelation,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [commerciaux, formateurs, poleRelation]);

  const typeStyles: Record<string, string> = {
    Formateur: "bg-blue-100 text-blue-800",
    Commercial: "bg-green-100 text-green-800",
    "Pôle Relation Client": "bg-yellow-100 text-yellow-800",
  };

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

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Vos contacts</h2>
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <ContactCardSkeleton />
          <ContactCardSkeleton />
          <ContactCardSkeleton />
        </div>
      </div>
    );
  }

  const renderContactCard = (contact: Contact | undefined, type: string) => {
    if (!contact) return null;

    return (
      <div className="bg-white shadow-md rounded-2xl p-5 border hover:shadow-lg transition">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
            <User className="text-gray-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {contact.name}
            </h2>
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${typeStyles[type]}`}
            >
              {type}
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
              {contact.telephone || "Non renseigné"}
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Vos contacts</h2>
        <Link to="/contacts">
          <Button className="text-blue-600" variant="ghost" size="sm">
            Voir tous <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {renderContactCard(commerciaux?.[0], "Commercial")}
        {renderContactCard(formateurs?.[0], "Formateur")}
        {renderContactCard(poleRelation?.[0], "Pôle Relation Client")}
      </div>
    </div>
  );
};

export default ContactSection;
