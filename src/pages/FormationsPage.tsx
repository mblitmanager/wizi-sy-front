
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
  const [formationsDisponibles, setFormationsDisponibles] = useState<Formation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Tous");

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

      // Map and set formations
      const mappedFormations = Object.values(data).map(mapCatalogueToFormation);
      setFormationsDisponibles(mappedFormations);
      
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

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(formationsDisponibles.map((f) => f.categorie || "Autre"));
    return ["Tous", ...Array.from(cats)];
  }, [formationsDisponibles]);

  const filteredFormations = useMemo(() => {
    if (selectedCategory === "Tous") return formationsDisponibles;
    return formationsDisponibles.filter(
      (f) => (f.categorie || "Autre") === selectedCategory
    );
  }, [formationsDisponibles, selectedCategory]);

  const formationsRender = useMemo(() => {
    return filteredFormations.map((formation: Formation) => (
      <FormationCard
        key={`available-${formation.catalogue_formation.id}-${formation.id}`}
        formation={formation}
      />
    ));
  }, [filteredFormations]);

  return (
    <div className="container mx-auto px-4 py-8  bg-white ">
      {/* En-tête */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-2xl md:text-3xl text-brown-shade font-bold">
          Découvrez Nos Formations
        </h1>
        <p className="text-gray-600 max-w-2xl">
          Accédez à une sélection de formations enrichissantes pour développer
          vos compétences à votre rythme.
        </p>
      </div>
      <hr className="mb-4" />

      {/* Filtres par catégorie */}
      <div className="mb-6">
        <Tabs defaultValue="Tous" value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent justify-start p-0">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="data-[state=active]:bg-brown-shade data-[state=active]:text-white border border-gray-200 rounded-full px-4 py-2"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

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
