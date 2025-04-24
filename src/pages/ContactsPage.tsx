import { useEffect, useState } from "react";
import { Contact } from "@/types/contact";
import { ContactCard } from "@/components/Contacts/ContactCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const fetchContacts = async (endpoint: string): Promise<Contact[]> => {
  const response = await axios.get<Contact[]>(`${API_URL}/stagiaire/contacts/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }
  });
  return response.data;
};

const ContactsPage = () => {
  const { data: commerciaux, isLoading: loadingCommerciaux } = useQuery<Contact[]>({
    queryKey: ['contacts', 'commerciaux'],
    queryFn: () => fetchContacts('commerciaux'),
  });

  const { data: formateurs, isLoading: loadingFormateurs } = useQuery<Contact[]>({
    queryKey: ['contacts', 'formateurs'],
    queryFn: () => fetchContacts('formateurs'),
  });

  const { data: poleRelation, isLoading: loadingPoleRelation } = useQuery<Contact[]>({
    queryKey: ['contacts', 'pole-relation'],
    queryFn: () => fetchContacts('pole-relation'),
  });

  const isLoading = loadingCommerciaux || loadingFormateurs || loadingPoleRelation;

  return (
    <div className="container mx-auto p-4 pb-20 md:pb-4">
      <h1 className="text-3xl font-bold mb-6 font-montserrat">Contacts</h1>
      
      <Tabs defaultValue="commerciaux" className="w-full">
        <TabsList className="w-full justify-start mb-6 font-nunito">
          <TabsTrigger value="commerciaux">Commerciaux</TabsTrigger>
          <TabsTrigger value="formateurs">Formateurs</TabsTrigger>
          <TabsTrigger value="pole-relation">Pôle Relation</TabsTrigger>
        </TabsList>

        <TabsContent value="commerciaux">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              <p className="col-span-full text-center font-roboto">Chargement des commerciaux...</p>
            ) : commerciaux?.map((contact: Contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="formateurs">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              <p className="col-span-full text-center font-roboto">Chargement des formateurs...</p>
            ) : formateurs?.map((contact: Contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pole-relation">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              <p className="col-span-full text-center font-roboto">Chargement du pôle relation...</p>
            ) : poleRelation?.map((contact: Contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContactsPage;
