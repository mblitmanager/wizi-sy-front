import React, { useEffect, useState } from "react";
import { Contact } from "@/types/contact";
import { ContactCard } from "@/components/Contacts/ContactCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { Users, GraduationCap, Phone } from "lucide-react";
import PaginationControls from "../catalogueFormation/PaginationControls";

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
          ? "https://wizi-learn.com/api/stagiaire/contacts/commerciaux"
          : type === "formateurs"
          ? "https://wizi-learn.com/api/stagiaire/contacts/formateurs"
          : "https://wizi-learn.com/api/stagiaire/contacts/pole-relation",
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-xl font-semibold font-montserrat">Mes contacts</h2>
        <p className="text-sm text-muted-foreground">
          Retrouvez tous vos contacts importants pour votre formation
        </p>
      </div>

      <Tabs defaultValue="commerciaux" className="w-full">
        <TabsList className="flex flex-wrap justify-start gap-2 mb-6">
          <TabsTrigger
            value="commerciaux"
            className="text-xs sm:text-sm px-3 py-2">
            <Users className="h-4 w-4 mr-2" />
            Commerciaux
          </TabsTrigger>
          <TabsTrigger
            value="formateurs"
            className="text-xs sm:text-sm px-3 py-2">
            <GraduationCap className="h-4 w-4 mr-2" />
            Formateurs
          </TabsTrigger>
          <TabsTrigger
            value="pole-relation"
            className="text-xs sm:text-sm px-3 py-2">
            <Phone className="h-4 w-4 mr-2" />
            Pôle Relation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="commerciaux">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading.commerciaux ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <SkeletonCard key={`commerciaux-skeleton-${idx}`} />
              ))
            ) : commerciaux.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                Aucun commercial disponible
              </div>
            ) : (
              commerciaux.map((contact) => (
                <ContactCard key={contact.id} contact={contact} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="formateurs">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading.formateurs ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <SkeletonCard key={`formateurs-skeleton-${idx}`} />
              ))
            ) : formateurs.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                Aucun formateur disponible
              </div>
            ) : (
              formateurs.map((contact) => (
                <ContactCard key={contact.id} contact={contact} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="pole-relation">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading["pole-relation"] ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <SkeletonCard key={`pole-relation-skeleton-${idx}`} />
              ))
            ) : poleRelation.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                Aucun contact disponible pour le Pôle Relation
              </div>
            ) : (
              poleRelation.map((contact) => (
                <ContactCard key={contact.id} contact={contact} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContactsSection;
