import { useEffect, useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HeaderSection from "@/components/features/HeaderSection";

import FormationCard from "@/components/catalogueFormation/FormationCard";
import PaginationControls from "@/components/catalogueFormation/PaginationControls";
import SkeletonCard from "@/components/ui/SkeletonCard";
import { catalogueFormationApi, progressAPI, stagiaireAPI } from "@/services/api";
import { CatalogueFormationWithFormation, Formation } from "@/types/stagiaire";
import { mapCatalogueToFormation } from "@/utils/mapCatalogueToFormation";

const FormationsPage = () => {
  const [formationsDisponibles, setFormationsDisponibles] = useState([]);
  const [mesFormations, setMesFormations] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tabsValue, setTabsValue] = useState("available");
  const [isLoadingMesFormations, setIsLoadingMesFormations] = useState(false);
  const [hasLoadedMesFormations, setHasLoadedMesFormations] = useState(false);

  // Fonction pour récupérer les formations disponibles et les formations de l'utilisateur
  const fetchPage = async (page = 1) => {
    setIsLoading(true);
    try {
      const [progress, catalogueResponse] = await Promise.all([
        progressAPI.getUserProgress(),
        catalogueFormationApi.getAllCatalogueFormation(page),
      ]);

      interface CatalogueResponse {
        data: CatalogueFormationWithFormation[];
        current_page: number;
        last_page: number;
        total: number;
        next_page_url: string | null;
        prev_page_url: string | null;
      }

      const { data, current_page, last_page, next_page_url, prev_page_url } =
        catalogueResponse.data as CatalogueResponse;

      setFormationsDisponibles(data);
      setLastPage(last_page);
      setCurrentPage(current_page);
      setNextPageUrl(next_page_url);
      setPrevPageUrl(prev_page_url);
    } catch (e) {
      console.error("Erreur générale de récupération:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion de la pagination
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page); // Met à jour la page actuelle
      fetchPage(page); // Recharge les formations pour la nouvelle page
    }
  };

  // Utilisation de useMemo pour éviter de re-calculer les formations à chaque rendu
  const formationsRender = useMemo(() => {
    return formationsDisponibles
      .map(mapCatalogueToFormation)
      .map((formation: Formation) => (
        <FormationCard
          key={`available-${formation.catalogue_formation.id}-${formation.id}`}
          formation={formation}
        />
      ));
  }, [formationsDisponibles]);

  // Récupérer les formations à chaque changement de page
  useEffect(() => {
    fetchPage(currentPage);
  }, [currentPage]);

  return (
    <div className="container mx-auto p-4 pb-20 md:pb-4">
      <HeaderSection titre="Catalogue des Formations" buttonText="Retour" />

      <Tabs
        value={tabsValue}
        onValueChange={(value) => {
          setTabsValue(value);
          if (value === "completed" && !hasLoadedMesFormations) {
            setHasLoadedMesFormations(true);
            setIsLoadingMesFormations(true);
          }
        }}
        className="w-full">
        <TabsList className="w-full justify-start mb-6">
          <TabsTrigger value="available">Formations disponibles</TabsTrigger>
        </TabsList>

        {/* Formations disponibles */}
        <TabsContent value="available">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, idx) => (
                  <SkeletonCard key={idx} />
                ))
              : formationsRender}
          </div>

          {/* Pagination */}
          <PaginationControls
            currentPage={currentPage}
            lastPage={lastPage}
            onPageChange={handlePageChange}
            nextPageUrl={nextPageUrl}
            prevPageUrl={prevPageUrl}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormationsPage;
