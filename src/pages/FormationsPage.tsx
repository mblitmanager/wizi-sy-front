
import { useEffect, useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HeaderSection from "@/components/features/HeaderSection";

import FormationCard from "@/components/catalogueFormation/FormationCard";
import PaginationControls from "@/components/catalogueFormation/PaginationControls";
import SkeletonCard from "@/components/ui/SkeletonCard";
import { api } from "@/services/api";
import { catalogueFormationApi, progressAPI, stagiaireAPI } from "@/services/api";
import { Formation, CatalogueFormationWithFormation } from "@/types/stagiaire";
import { mapCatalogueToFormation } from "@/utils/mapCatalogueToFormation";

const FormationsPage = () => {
  const [formationsDisponibles, setFormationsDisponibles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPage = async (page = 1) => {
    setIsLoading(true);
    try {
      const [, catalogueResponse] = await Promise.all([
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

      setFormationsDisponibles(Object.values(data));
      setLastPage(last_page);
      setCurrentPage(current_page);
      setNextPageUrl(next_page_url);
      setPrevPageUrl(prev_page_url);
    } catch (e) {
      console.error("Erreur de récupération :", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
      fetchPage(page);
    }
  };

  useEffect(() => {
    fetchPage(currentPage);
  }, [currentPage]);

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

  return (
    <div className="container mx-auto px-4 py-8  bg-white ">
      {/* En-tête */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">
          Découvrez Nos Formations
        </h1>
        <p className="text-gray-600 max-w-2xl">
          Accédez à une sélection de formations enrichissantes pour développer
          vos compétences à votre rythme.
        </p>
      </div>
      <hr className="mb-4" />

      {/* Grille des formations */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))
          : formationsRender}
      </div>

      {/* Pagination */}
      <div className="mt-10 flex justify-center">
        <PaginationControls
          currentPage={currentPage}
          lastPage={lastPage}
          onPageChange={handlePageChange}
          nextPageUrl={nextPageUrl}
          prevPageUrl={prevPageUrl}
        />
      </div>
    </div>
  );
};

export default FormationsPage;
