// components/ContactSection.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { ChevronRight, Mail, Phone, User, ChevronDown } from "lucide-react";
import { Skeleton } from "@mui/material";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [showAllContacts, setShowAllContacts] = useState(false);
  const isMobile = useIsMobile();

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
          <h2 className="text-2xl font-bold text-gray-800">Mes contacts</h2>
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
            <a href={`tel:${contact.phone}`} className="hover:underline">
              {contact.phone || "Non renseigné"}
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Contactez-nous</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {renderContactCard(commerciaux?.[0], "Commercial")}
          {(showAllContacts || !isMobile) && (
            <>
              {renderContactCard(formateurs?.[0], "Formateur")}
              {renderContactCard(poleRelation?.[0], "Pôle Relation Client")}
            </>
          )}
        </div>

        {isMobile && !showAllContacts && (
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
