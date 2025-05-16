import React, { useEffect, useState } from "react";
import { Contact } from "@/types/contact";
import { ContactCard } from "@/components/Contacts/ContactCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { Users, GraduationCap, Phone } from "lucide-react";
import PaginationControls from "../catalogueFormation/PaginationControls";
import { Button } from "@mui/material";

const SkeletonCard = () => (
  <div className="rounded-lg border p-4 space-y-3">
    <div className="flex items-center space-x-3">
      <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
      <div className="space-y-1">
        <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
        <div className="h-3 w-24 bg-gray-200 animate-pulse rounded" />
        <div className="h-3 w-24 bg-gray-200 animate-pulse rounded" />
      </div>
    </div>
    <div className="h-3 w-full bg-gray-200 animate-pulse rounded" />
    <div className="h-3 w-3/4 bg-gray-200 animate-pulse rounded" />
  </div>
);

const ContactsSection = () => {
  const VITE_API_URL = import.meta.env.VITE_API_URL || "https://wizi-learn.com/api";
  const [commerciaux, setCommerciaux] = useState<Contact[]>([]);
  const [formateurs, setFormateurs] = useState<Contact[]>([]);
  const [poleRelation, setPoleRelation] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState({
    commerciaux: true,
    formateurs: true,
    "pole-relation": true,
  });

  const fetchContacts = async (type: keyof typeof isLoading) => {
    setIsLoading((prev) => ({ ...prev, [type]: true }));
    try {
      const token = localStorage.getItem("token"); // Retrieve the JWT token from local storage
      const response = await axios.get(
        type === "commerciaux"
          ? "http://localhost:8000/api/stagiaire/contacts/commerciaux"
          : type === "formateurs"
          ? "http://localhost:8000/api/stagiaire/contacts/formateurs"
          : "http://localhost:8000/api/stagiaire/contacts/pole-relation",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the JWT token to the headers
          },
        }
      );
      const data = response.data.data;
      if (type === "commerciaux") {
        setCommerciaux(data);
      } else if (type === "formateurs") {
        setFormateurs(data);
      } else {
        setPoleRelation(data);
      }
    } catch (error) {
      console.error(`Erreur lors de la récupération des ${type}:`, error);
    } finally {
      setIsLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  useEffect(() => {
    fetchContacts("commerciaux");
    fetchContacts("formateurs");
    fetchContacts("pole-relation");
  }, []);

  const [showAll, setShowAll] = useState({
    commerciaux: false,
    formateurs: false,
    "pole-relation": false,
  });

  const toggleShowAll = (type) => {
    setShowAll((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const renderContacts = (contacts, type) => {
    const bgColors = {
      commerciaux: "bg-slate-100",
      formateurs: "bg-slate-100",
      "pole-relation": "bg-slate-100",
    };
    const visibleContacts = showAll[type] ? contacts : contacts.slice(0, 1);
    return (
      <div className={`space-y-4 border rounded-lg p-4 ${bgColors[type]}`}>
        {isLoading[type] ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <SkeletonCard key={`${type}-skeleton-${idx}`} />
          ))
        ) : contacts.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Aucun contact disponible
          </p>
        ) : (
          visibleContacts.map((contact, index) => (
            <ContactCard key={contact.id} contact={contact} index={index + 1} />
          ))
        )}
        {contacts.length > 5 && (
          <button
            className="w-full flex items-center text-gold-700 border border-gold py-2 px-6 gap-2 rounded inline-flex items-center justify-center hover:bg-gold hover:text-white transition-colors duration-200"
            color="success"
            onClick={() => toggleShowAll(type)}>
            {showAll[type] ? "Voir moins" : "Voir plus"}
            {showAll[type] ? (
              <Phone className="w-4 h-4" />
            ) : (
              <Users className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-xl font-semibold font-montserrat">Mes contacts</h2>
        <p className="text-sm text-muted-foreground">
          Retrouvez tous vos contacts importants pour votre formation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Commerciaux</h3>
          {renderContacts(commerciaux, "commerciaux")}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Formateurs</h3>
          {renderContacts(formateurs, "formateurs")}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Pôle Relation</h3>
          {renderContacts(poleRelation, "pole-relation")}
        </div>
      </div>
    </div>
  );
};

export default ContactsSection;
