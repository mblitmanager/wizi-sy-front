import React from 'react';
import { Contact } from '@/types/contact';
import { ContactCard } from '@/components/Contacts/ContactCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Users, GraduationCap, Phone } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const fetchContacts = async (endpoint: string): Promise<Contact[]> => {
  const response = await axios.get<Contact[]>(`${API_URL}/stagiaire/contacts/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }
  });
  return response.data;
};

const ContactsSection = () => {
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
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-xl font-semibold font-montserrat">Mes contacts</h2>
        <p className="text-sm text-muted-foreground">Retrouvez tous vos contacts importants pour votre formation</p>
      </div>

      <Tabs defaultValue="commerciaux" className="w-full">
        <TabsList className="flex flex-wrap justify-start gap-2 mb-6">
          <TabsTrigger value="commerciaux" className="text-xs sm:text-sm px-3 py-2">
            <Users className="h-4 w-4 mr-2" />
            Commerciaux
          </TabsTrigger>
          <TabsTrigger value="formateurs" className="text-xs sm:text-sm px-3 py-2">
            <GraduationCap className="h-4 w-4 mr-2" />
            Formateurs
          </TabsTrigger>
          <TabsTrigger value="pole-relation" className="text-xs sm:text-sm px-3 py-2">
            <Phone className="h-4 w-4 mr-2" />
            Pôle Relation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="commerciaux">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              <div className="col-span-full flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2 text-muted-foreground">Chargement des commerciaux...</span>
              </div>
            ) : commerciaux?.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                Aucun commercial disponible
              </div>
            ) : (
              commerciaux?.map((contact: Contact) => (
                <ContactCard key={contact.id} contact={contact} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="formateurs">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              <div className="col-span-full flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2 text-muted-foreground">Chargement des formateurs...</span>
              </div>
            ) : formateurs?.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                Aucun formateur disponible
              </div>
            ) : (
              formateurs?.map((contact: Contact) => (
                <ContactCard key={contact.id} contact={contact} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="pole-relation">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              <div className="col-span-full flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2 text-muted-foreground">Chargement du pôle relation...</span>
              </div>
            ) : poleRelation?.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                Aucun contact du pôle relation disponible
              </div>
            ) : (
              poleRelation?.map((contact: Contact) => (
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