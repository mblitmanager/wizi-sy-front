import React, { useEffect, useState } from "react";
import { Contact } from "@/types/contact";
import { ContactCard } from "@/components/Contacts/ContactCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Users, GraduationCap, Phone } from "lucide-react";
import { Button } from "../ui/button";
import { contactService } from "@/services";
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
  // États pour chaque type de contact
  const [commerciaux, setCommerciaux] = useState<Contact[]>([]);
  const [formateurs, setFormateurs] = useState<Contact[]>([]);
  const [poleRelation, setPoleRelation] = useState<Contact[]>([]);

  // États de pagination
  const [currentPages, setCurrentPages] = useState({
    commerciaux: 1,
    formateurs: 1,
    poleRelation: 1,
  });

  const [lastPages, setLastPages] = useState({
    commerciaux: 1,
    formateurs: 1,
    poleRelation: 1,
  });

  const [nextPageUrls, setNextPageUrls] = useState({
    commerciaux: null,
    formateurs: null,
    poleRelation: null,
  });

  const [prevPageUrls, setPrevPageUrls] = useState({
    commerciaux: null,
    formateurs: null,
    poleRelation: null,
  });

  const [isLoading, setIsLoading] = useState({
    commerciaux: true,
    formateurs: true,
    poleRelation: true,
  });

  // Fonction utilisant contactService
  const fetchContacts = async (type: keyof typeof currentPages, page = 1) => {
    setIsLoading((prev) => ({ ...prev, [type]: true }));

    try {
      let response;

      switch (type) {
        case "commerciaux":
          response = await contactService.getCommerciaux(page);
          break;
        case "formateurs":
          response = await contactService.getFormateurs(page);
          break;
        case "poleRelation":
          response = await contactService.getPoleRelation(page);
          break;
      }

      const { data, current_page, last_page, next_page_url, prev_page_url } =
        response;

      const normalizeData = (
        data: Record<string, unknown> | unknown[]
      ): Contact[] => {
        if (Array.isArray(data)) return data as Contact[];
        if (typeof data === "object" && data !== null)
          return Object.values(data) as Contact[];
        return [];
      };

      const normalized = normalizeData(data);

      switch (type) {
        case "commerciaux":
          setCommerciaux(normalized);
          break;
        case "formateurs":
          setFormateurs(normalized);
          break;
        case "poleRelation":
          setPoleRelation(normalized);
          break;
      }

      setCurrentPages((prev) => ({ ...prev, [type]: current_page }));
      setLastPages((prev) => ({ ...prev, [type]: last_page }));
      setNextPageUrls((prev) => ({ ...prev, [type]: next_page_url }));
      setPrevPageUrls((prev) => ({ ...prev, [type]: prev_page_url }));
    } catch (error) {
      console.error(`Erreur lors de la récupération des ${type}:`, error);
    } finally {
      setIsLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  // Gestion du changement de page
  const handlePageChange = (type: keyof typeof currentPages, page: number) => {
    if (page >= 1 && page <= lastPages[type]) {
      setCurrentPages((prev) => ({ ...prev, [type]: page }));
      fetchContacts(type, page);
    }
  };

  // Chargement initial
  useEffect(() => {
    fetchContacts("commerciaux");
    fetchContacts("formateurs");
    fetchContacts("poleRelation");
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
            value="poleRelation"
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
          <div className="mt-6">
            <PaginationControls
              currentPage={currentPages.commerciaux}
              lastPage={lastPages.commerciaux}
              onPageChange={(page) => handlePageChange("commerciaux", page)}
              nextPageUrl={nextPageUrls.commerciaux}
              prevPageUrl={prevPageUrls.commerciaux}
            />
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
          <div className="mt-6">
            <PaginationControls
              currentPage={currentPages.formateurs}
              lastPage={lastPages.formateurs}
              onPageChange={(page) => handlePageChange("formateurs", page)}
              nextPageUrl={nextPageUrls.formateurs}
              prevPageUrl={prevPageUrls.formateurs}
            />
          </div>
        </TabsContent>

        <TabsContent value="poleRelation">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading.poleRelation ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <SkeletonCard key={`poleRelation-skeleton-${idx}`} />
              ))
            ) : poleRelation.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                Aucun contact du pôle relation disponible
              </div>
            ) : (
              poleRelation.map((contact) => (
                <ContactCard key={contact.id} contact={contact} />
              ))
            )}
          </div>
          <div className="mt-6">
            <PaginationControls
              currentPage={currentPages.poleRelation}
              lastPage={lastPages.poleRelation}
              onPageChange={(page) => handlePageChange("poleRelation", page)}
              nextPageUrl={nextPageUrls.poleRelation}
              prevPageUrl={prevPageUrls.poleRelation}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContactsSection;
