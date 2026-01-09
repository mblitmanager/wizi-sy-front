
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

const CATEGORIES = ["Tous", "Bureautique", "Langues", "Internet", "Création", "IA"];

const FormationsPage = () => {
  const [formationsDisponibles, setFormationsDisponibles] = useState<Formation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [loadedCategories, setLoadedCategories] = useState(new Set(["Tous"]));
  const [categoryCache, setCategoryCache] = useState<Record<string, Formation[]>>({});

  const fetchPage = async (page: number, category: string) => {
    setIsLoading(true);
    try {
      const [, catalogueResponse] = await Promise.all([
        progressAPI.getUserProgress(),
        catalogueFormationApi.getAllCatalogueFormation(page, category),
      ]);

      interface CatalogueResponse {
        data: CatalogueFormationWithFormation[];
        current_page: number;
        last_page: number;
        total: number;
        next_page_url: string | null;
        prev_page_url: string | null;
      }

      // Check if data is array (old format) or object (new paginated format)
      // The backend now returns the paginated object directly
      const responseData = catalogueResponse as unknown as CatalogueResponse;

      let mappedFormations: Formation[] = [];
      if (Array.isArray(responseData.data)) {
           mappedFormations = responseData.data.map(mapCatalogueToFormation);
           setLastPage(responseData.last_page);
           setCurrentPage(responseData.current_page);
           setNextPageUrl(responseData.next_page_url);
           setPrevPageUrl(responseData.prev_page_url);
      } else {
          // Fallback if backend structure differs safely
          console.warn("Unexpected API response structure", responseData);
      }
      
      setFormationsDisponibles(mappedFormations);
      // Cache the formations for this category
      setCategoryCache(prev => ({
        ...prev,
        [category]: mappedFormations
      }));

    } catch (e) {
      console.error("Erreur de récupération :", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  const handleCategoryChange = (category: string) => {
      setSelectedCategory(category);
      setCurrentPage(1); // Reset to first page
      
      // Load category content on demand if not already loaded
      if (!loadedCategories.has(category)) {
        setIsLoading(true);
        fetchPage(1, category).then(() => {
          setLoadedCategories(prev => new Set([...prev, category]));
        });
      }
  };

  // Trigger fetch only on page change (category is handled by handleCategoryChange)
  useEffect(() => {
    if (loadedCategories.has(selectedCategory)) {
      // Retrieve cached formations if already loaded
      const cached = categoryCache[selectedCategory];
      if (cached) {
        setFormationsDisponibles(cached);
        setIsLoading(false);
      }
    }
  }, [currentPage]);

  const formationsRender = useMemo(() => {
    return formationsDisponibles.map((formation: Formation) => (
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
        <Tabs defaultValue="Tous" value={selectedCategory} onValueChange={handleCategoryChange}>
          <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent justify-start p-0">
            {CATEGORIES.map((category) => (
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
          : formationsDisponibles.length > 0 ? formationsRender : (
            <div className="col-span-full py-10 text-center text-gray-500">
                Aucune formation trouvée pour cette catégorie.
            </div>
          )
        }
      </div>

      {/* Pagination */}
      {!isLoading && formationsDisponibles.length > 0 && (
        <div className="mt-10 flex justify-center">
            <PaginationControls
            currentPage={currentPage}
            lastPage={lastPage}
            onPageChange={handlePageChange}
            nextPageUrl={nextPageUrl}
            prevPageUrl={prevPageUrl}
            />
        </div>
      )}
    </div>
  );
};

export default FormationsPage;
