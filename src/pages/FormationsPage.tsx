import { useEffect, useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HeaderSection from "@/components/features/HeaderSection";

import FormationCard from "@/components/catalogueFormation/FormationCard";
import PaginationControls from "@/components/catalogueFormation/PaginationControls";
import SkeletonCard from "@/components/ui/SkeletonCard";
import { progressAPI } from "@/api";
import { catalogueFormationApi, stagiaireAPI } from "@/services/api";
import { CatalogueFormationWithFormation, Formation } from "@/types/stagiaire";
import { mapCatalogueToFormation } from "@/utils/mapCatalogueToFormation";

const FormationsPage = () => {
  const [formationsDisponibles, setFormationsDisponibles] = useState([]);
  const [mesFormations, setMesFormations] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [tabsValue, setTabsValue] = useState("available");
  const [isLoadingMesFormations, setIsLoadingMesFormations] = useState(false);
  const [hasLoadedMesFormations, setHasLoadedMesFormations] = useState(false);
  const [pageCache, setPageCache] = useState<Record<number, Formation[]>>({});

  const fetchPage = async (page = 1) => {
    setIsLoading(true);
    try {
      const [progress, catalogueResponse] = await Promise.all([
        progressAPI.getUserProgress(),
        catalogueFormationApi.getAllCatalogueFormation(),
      ]);

      interface CatalogueResponse {
        data: CatalogueFormationWithFormation[];
        last_page: number;
      }

      const { data, last_page } = catalogueResponse.data as CatalogueResponse;
      setFormationsDisponibles(data);
      setLastPage(last_page);
      setPageCache((prev) => ({ ...prev, [page]: data }));

      const stagiaireId = progress?.stagiaire?.id;
      if (stagiaireId) {
        try {
          const response = await stagiaireAPI.getCatalogueFormations(
            stagiaireId
          );
          setMesFormations(response.data);
        } catch (e) {
          console.error("Erreur formations stagiaire:", e);
        }
      }
    } catch (e) {
      console.error("Erreur générale de récupération:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMesFormationsOnly = async () => {
    setIsLoadingMesFormations(true);
    try {
      const progress = await progressAPI.getUserProgress();
      const stagiaireId = progress?.stagiaire?.id;
      if (stagiaireId) {
        const response = await stagiaireAPI.getCatalogueFormations(stagiaireId);
        setMesFormations(response.data);
      }
    } catch (e) {
      console.error("Erreur formations stagiaire:", e);
    } finally {
      setIsLoadingMesFormations(false);
    }
  };

  useEffect(() => {
    if (pageCache[currentPage]) {
      setFormationsDisponibles(pageCache[currentPage]);
      setIsLoading(false);
    } else {
      fetchPage(currentPage);
    }
  }, [currentPage]);

  useEffect(() => {
    if (tabsValue === "completed" && !hasLoadedMesFormations) {
      fetchMesFormationsOnly();
      setHasLoadedMesFormations(true);
    }
  }, [tabsValue]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
    }
  };

  const formationsRender = useMemo(() => {
    return formationsDisponibles
      .map(mapCatalogueToFormation)
      .map((formation: Formation) => (
        <FormationCard key={formation.id} formation={formation} />
      ));
  }, [formationsDisponibles]);

  return (
    <div className="container mx-auto p-4 pb-20 md:pb-4">
      <HeaderSection titre="Formations" buttonText="Retour" />

      <Tabs
        value={tabsValue}
        onValueChange={(value) => {
          setTabsValue(value);
          if (value === "completed" && !hasLoadedMesFormations) {
            setHasLoadedMesFormations(true);
            setIsLoadingMesFormations(true);
            fetchMesFormationsOnly().finally(() => {
              setIsLoadingMesFormations(false);
            });
          }
        }}
        className="w-full">
        <TabsList className="w-full justify-start mb-6">
          <TabsTrigger value="available">Formations disponibles</TabsTrigger>
          <TabsTrigger value="completed">Mes Formations</TabsTrigger>
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

          <PaginationControls
            currentPage={currentPage}
            lastPage={lastPage}
            onPageChange={handlePageChange}
          />
        </TabsContent>

        {/* Mes formations */}
        <TabsContent value="completed">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isLoadingMesFormations
              ? Array.from({ length: 6 }).map((_, idx) => (
                  <SkeletonCard key={idx} />
                ))
              : mesFormations?.formations
                  ?.filter((f: Formation) => !!f.catalogue_formation)
                  ?.map((formation: Formation) => (
                    <FormationCard key={formation.id} formation={formation} />
                  ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormationsPage;
