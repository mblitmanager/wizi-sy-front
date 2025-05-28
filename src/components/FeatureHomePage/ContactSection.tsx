// components/ContactSection.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";
import { ContactCard } from "../Contacts/ContactCard";
import { Skeleton } from "@mui/material";

interface ContactSectionProps {
  commerciaux: {
    id: number;
    name: string;
    email: string;
    telephone?: string;
    role?: string;
    avatar?: string;
    created_at?: string;
  }[];
  formateurs: {
    id: number;
    name: string;
    email: string;
    telephone?: string;
    role?: string;
    avatar?: string;
    created_at?: string;
  }[];
  poleRelation: {
    id: number;
    name: string;
    email: string;
    telephone?: string;
    role?: string;
    avatar?: string;
    created_at?: string;
  }[];
}

const ContactSection: React.FC<ContactSectionProps> = ({
  commerciaux,
  formateurs,
  poleRelation,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showAllContacts, setShowAllContacts] = useState(false);

  useEffect(() => {
    // Simule le chargement ou attend que les données soient disponibles
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [commerciaux, formateurs, poleRelation]);

  const ContactCardSkeleton = () => (
    <div className="border rounded-lg p-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-4 w-[80px]" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="mb-4 bg-card rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-brown-shade">
            Mes contacts
          </h2>
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <ContactCardSkeleton />
          <ContactCardSkeleton />
          <ContactCardSkeleton />
        </div>
      </div>
    );
  }

  const allContacts = [
    commerciaux?.[0],
    formateurs?.[0],
    poleRelation?.[0],
  ].filter(Boolean);

  const displayedContacts = showAllContacts ? allContacts : [allContacts[0]];

  return (
    <div className="mb-4 bg-card rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-brown-shade">Vos contacts</h2>
        <div className="flex items-center gap-2">
    
          <Link to="/contacts">
            <Button className="text-blue-400" variant="ghost" size="sm">
              Voir tous <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {displayedContacts.map((contact, index) => {
          if (!contact) return null;
          return (
            <ContactCard
              key={contact.id}
              contact={{
                ...contact,
                telephone: contact.phone || "N/A",
                role: contact.role || "N/A",
                avatar: contact.avatar || "",
                created_at: contact.created_at || new Date().toISOString(),
              }}
            />
          );
        })}
              {!showAllContacts && allContacts.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllContacts(true)}
              className="text-brown-shade md:hidden"
            >
              +{allContacts.length - 1} autres
            </Button>
          )}
      </div>
    </div>
  );
};

export default ContactSection;
