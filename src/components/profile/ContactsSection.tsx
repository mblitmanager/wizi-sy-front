import React, { useEffect, useState } from "react";
import { Contact } from "@/types/contact";
import { ContactCard } from "@/components/Contacts/ContactCard";
import { Users, GraduationCap, Phone, HeadphonesIcon, ChevronUp, ChevronDown } from "lucide-react";
import axios from "axios";

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
  const VITE_API_URL =
    import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
  const [commerciaux, setCommerciaux] = useState<Contact[]>([]);
  const [formateurs, setFormateurs] = useState<Contact[]>([]);
  const [poleRelation, setPoleRelation] = useState<Contact[]>([]);
  const [poleSav, setPoleSav] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState({
    commerciaux: true,
    formateurs: true,
    "pole-relation": true,
    "pole-sav": true,
  });

  const fetchContacts = async (type: keyof typeof isLoading) => {
    setIsLoading((prev) => ({ ...prev, [type]: true }));
    try {
      const token = localStorage.getItem("token");
      
      // Gestion spéciale pour pole-sav qui a une URL différente
      const endpoint = type === "pole-sav" ? "pole-save" : type;
      
      const response = await axios.get(
        `${VITE_API_URL}/stagiaire/contacts/${endpoint}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const data = response.data.data || [];

      // Mapper les données pour uniformiser la structure
      const mappedData = data.map((contact: Contact) => ({
        ...contact,
        telephone: contact.telephone || contact.phone,
        image: contact.image || contact.avatar,
        // S'assurer que le rôle est correctement défini
        role: contact.role || contact.type
      }));

      if (type === "commerciaux") {
        setCommerciaux(mappedData);
      } else if (type === "formateurs") {
        setFormateurs(mappedData);
      } else if (type === "pole-relation") {
        setPoleRelation(mappedData);
      } else if (type === "pole-sav") {
        setPoleSav(mappedData);
      }
    } catch (error) {
      console.error(`❌ Erreur lors de la récupération des ${type}:`, error);
    } finally {
      setIsLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  useEffect(() => {
    fetchContacts("commerciaux");
    fetchContacts("formateurs");
    fetchContacts("pole-relation");
    fetchContacts("pole-sav");
  }, []);

  const [showAll, setShowAll] = useState({
    commerciaux: false,
    formateurs: false,
    "pole-relation": false,
    "pole-sav": false,
  });

  const toggleShowAll = (type: keyof typeof showAll) => {
    setShowAll((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const renderContacts = (contacts: Contact[], type: keyof typeof showAll) => {
    const bgColors = {
      commerciaux: "bg-blue-50",
      formateurs: "bg-green-50",
      "pole-relation": "bg-yellow-50",
      "pole-sav": "bg-purple-50",
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
          visibleContacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))
        )}
        {contacts.length > 1 && (
          <button
            className="w-full flex items-center justify-center text-blue-700 border border-blue-300 py-2 px-6 gap-2 rounded hover:bg-blue-100 transition-colors duration-200"
            onClick={() => toggleShowAll(type)}>
            {showAll[type] ? (
              <>
                Voir moins
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Voir plus ({contacts.length - 1} autre{contacts.length - 1 > 1 ? 's' : ''})
                <ChevronDown className="w-4 h-4" />
              </>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Formateurs - Premier */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Formateurs
            <span className="text-sm text-gray-500 ml-2">({formateurs.length})</span>
          </h3>
          {renderContacts(formateurs, "formateurs")}
        </div>

        {/* Pôle SAV - Deuxième */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <HeadphonesIcon className="w-5 h-5" />
            Pôle SAV
            <span className="text-sm text-gray-500 ml-2">({poleSav.length})</span>
          </h3>
          {renderContacts(poleSav, "pole-sav")}
        </div>

        {/* Commercial - Troisième */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Commercial
            <span className="text-sm text-gray-500 ml-2">({commerciaux.length})</span>
          </h3>
          {renderContacts(commerciaux, "commerciaux")}
        </div>

        {/* Pôle Relation - Quatrième */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Pôle Relation
            <span className="text-sm text-gray-500 ml-2">({poleRelation.length})</span>
          </h3>
          {renderContacts(poleRelation, "pole-relation")}
        </div>
      </div>
    </div>
  );
};

export default ContactsSection;