import React from "react";
import { Layout } from "@/components/layout/Layout";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import { WifiOff, Megaphone } from "lucide-react";
import { Card, CardContent } from "@mui/material";
import { ProgressCard } from "@/components/dashboard/ProgressCard";
import { AgendaCard } from "@/components/dashboard/AgendaCard";
import ContactsSection from "@/components/FeatureHomePage/ContactSection";
import { useUser } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Contact } from "@/types/contact";
import { agendaEvents } from "@/data/mockData";
import { catalogueFormationApi } from "@/services/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdCatalogueBlock from "@/components/FeatureHomePage/AdCatalogueBlock";
import illustration from "../assets/Information tab-bro.png";
import { DASHBOARD, FORMATIONMETADATA } from "@/utils/constants";
import { BadgeUnlockModal } from "@/components/profile/BadgeUnlockModal";
import { useNewBadges } from "@/hooks/useNewBadges";
import AlertsWidget from "@/components/formateur/AlertsWidget";

const API_URL = import.meta.env.VITE_API_URL;

const fetchContacts = async (endpoint: string): Promise<Contact[]> => {
  const response = await fetch(`${API_URL}/stagiaire/contacts/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const data = await response.json();
  return data.data;
};

export default function DashboardPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();

  // Badge unlock modal
  const { currentBadge, showModal, setShowModal, checkForNewBadges } = useNewBadges();

  const { data: commerciaux } = useQuery<Contact[]>({
    queryKey: ["contacts", "commerciaux"],
    queryFn: () => fetchContacts("commerciaux"),
  });
  const { data: formateurs } = useQuery<Contact[]>({
    queryKey: ["contacts", "formateurs"],
    queryFn: () => fetchContacts("formateurs"),
  });
  const { data: poleRelation } = useQuery<Contact[]>({
    queryKey: ["contacts", "pole-relation"],
    queryFn: () => fetchContacts("pole-relation"),
  });
  const [catalogueData, setCatalogueData] = useState([]);

  // Check for new badges on mount
  useEffect(() => {
    checkForNewBadges();
  }, [checkForNewBadges]);
  useEffect(() => {
    catalogueFormationApi.getAllCatalogueFormation().then((response) => {
      let formations = [];
      if (response && typeof response === "object") {
        if ("data" in response && Array.isArray((response as any).data?.data)) {
          formations = (response as any).data.data;
        } else if (
          "data" in response &&
          typeof (response as any).data === "object" &&
          Array.isArray((response as any).data.member)
        ) {
          formations = (response as any).data.member;
        } else if (Array.isArray((response as any).member)) {
          formations = (response as any).member;
        } else if (
          "data" in response &&
          Array.isArray((response as any).data)
        ) {
          formations = (response as any).data;
        } else if (Array.isArray(response)) {
          formations = response;
        }
      }
      setCatalogueData(formations);
    });
  }, []);
  return (
    <Layout>
      {!isOnline && (
        <Alert variant="destructive" className="mb-4 mx-4 mt-4">
          <WifiOff className="h-4 w-4" />
          <AlertTitle>Vous êtes hors ligne</AlertTitle>
          <AlertDescription>
            Certaines fonctionnalités peuvent être limitées. Les données
            affichées peuvent ne pas être à jour.
          </AlertDescription>
        </Alert>
      )}
      <div className="container mx-auto py-4 px-2 sm:py-6 sm:px-4 lg:py-8 space-y-6 sm:space-y-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-8">
            {DASHBOARD}
          </h1>
        </div>
        
        {/* Alerts Widget for Formateurs */}
        {(user?.role === 'formateur' || user?.role === 'formatrice') && (
          <AlertsWidget />
        )}

        <div className="mt-2 space-y-6 md:space-y-12 mb-3">
          <Card className="border-blue-100">
            <CardContent className="p-3 md:p-6">
              <div className="flex items-center mb-2 md:mb-3">
                <Megaphone className="h-4 w-4 md:h-5 md:w-5 text-brown-shade mr-2" />
                <h3 className="text-sm md:text-lg font-medium">
                  Partagez et gagnez
                </h3>
              </div>
              <p className="text-xs md:text-base text-gray-700 mb-2 md:mb-3">
                Gagnez{" "}
                <span className="font-bold">50 ${FORMATIONMETADATA.euros}</span>{" "}
                par ami inscrit
              </p>
            </CardContent>
          </Card>
        </div>
        {catalogueData && catalogueData.length > 0 ? (
          <>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-900 text-center">
              Découvrez nos formations
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 px-2 py-6 md:py-12 bg-white rounded-xl shadow-md">
              <div className="hidden md:flex md:w-1/3 justify-center mb-4 md:mb-0">
                <img
                  src={illustration}
                  alt="Catalogue Illustration"
                  className="max-w-xs w-full h-auto object-contain"
                />
              </div>
              <div className="w-full flex flex-col items-center">
                <div className="w-full">
                  <AdCatalogueBlock formations={catalogueData.slice(0, 4)} />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="col-span-full text-center text-muted-foreground"></div>
        )}
        <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
          <ContactsSection
            commerciaux={commerciaux}
            formateurs={formateurs}
            poleRelation={poleRelation}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <ProgressCard user={user} />
          <AgendaCard events={agendaEvents} />
        </div>

        {/* Badge unlock modal */}
        {currentBadge && (
          <BadgeUnlockModal
            badge={currentBadge}
            isOpen={showModal}
            onClose={setShowModal}
            onViewAll={() => {
              setShowModal();
              navigate("/profile/badges");
            }}
          />
        )}
      </div>
    </Layout>
  );
}
