// components/ContactSection.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";
import { ContactCard } from "../Contacts/ContactCard";

interface ContactSectionProps {
  commerciaux: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role?: string;
    avatar?: string;
    created_at?: string;
  }[];
  formateurs: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role?: string;
    avatar?: string;
    created_at?: string;
  }[];
  poleRelation: {
    id: number;
    name: string;
    email: string;
    phone?: string;
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
  return (
    <div className="mb-4 bg-card rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-yellow-400">Vos contacts</h2>
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
              phone: commerciaux[0].phone || "N/A",
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
              phone: formateurs[0].phone || "N/A",
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
              phone: poleRelation[0].phone || "N/A",
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
