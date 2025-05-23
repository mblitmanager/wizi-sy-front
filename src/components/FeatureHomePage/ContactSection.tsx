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
            Vos contacts
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

  return (
    <div className="mb-4 bg-card rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-brown-shade">Vos contacts</h2>
        <Link to="/contacts">
          <Button className="text-blue-400" variant="ghost" size="sm">
            Voir tous <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {commerciaux?.[0] && (
          <ContactCard
            contact={{
              ...commerciaux[0],
              telephone: commerciaux[0].telephone || "N/A",
              role: commerciaux[0].role || "N/A",
              avatar: commerciaux[0].avatar || "",
              created_at: commerciaux[0].created_at || new Date().toISOString(),
            }}
          />
        )}
        {formateurs?.[0] && (
          <ContactCard
            contact={{
              ...formateurs[0],
              telephone: formateurs[0].telephone || "N/A",
              role: formateurs[0].role || "N/A",
              avatar: formateurs[0].avatar || "",
              created_at: formateurs[0].created_at || new Date().toISOString(),
            }}
          />
        )}
        {poleRelation?.[0] && (
          <ContactCard
            contact={{
              ...poleRelation[0],
              telephone: poleRelation[0].telephone || "N/A",
              role: poleRelation[0].role || "N/A",
              avatar: poleRelation[0].avatar || "",
              created_at:
                poleRelation[0].created_at || new Date().toISOString(),
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ContactSection;
