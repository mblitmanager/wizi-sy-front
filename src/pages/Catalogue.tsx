import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  useCategories,
  useFormations,
} from "@/use-case/hooks/catalogue/useCatalogue";
import { Layout } from "@/components/layout/Layout";
import SkeletonCard from "@/components/ui/SkeletonCard";
import FormationCard from "@/components/catalogueFormation/FormationCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { CategorySelector } from "@/components/catalogueFormation/CategorySelector";

export default function Catalogue() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const formationsPerPage = 6;
  const isMobile = useIsMobile();

  const {
    data: formationsResponse,
    isLoading: isLoadingFormations,
    isFetching: isFetchingFormations,
    error: formationsError,
  } = useFormations();

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Sélectionner la première catégorie par défaut
  useEffect(() => {
    if (categories && categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].name);
    }
  }, [categories, selectedCategory]);

  const filteredFormations = useMemo(() => {
    if (!formationsResponse || !selectedCategory) return [];

    const data = Array.isArray(formationsResponse)
      ? formationsResponse
      : Object.values(formationsResponse);

    return data.filter(
      // @ts-expect-error formation type may not have 'formation.categorie' property due to API response shape
      (formation) => formation.formation.categorie === selectedCategory
    );
  }, [formationsResponse, selectedCategory]);

  const paginatedFormations = useMemo(() => {
    const start = (currentPage - 1) * formationsPerPage;
    const end = start + formationsPerPage;
    return filteredFormations.slice(start, end);
  }, [filteredFormations, currentPage]);

  const totalPages = Math.ceil(filteredFormations.length / formationsPerPage);

  if (categoriesError || formationsError) {
    return (
      <Layout>
        <div className="text-red-500 p-4">
          Erreur lors du chargement des données
        </div>
      </Layout>
    );
  }

  function handlePageChange(page: number): void {
    setCurrentPage(page);
  }

  return (
    <Layout>
      <div className="container mx-auto py-4 px-2 sm:py-6 sm:px-4 lg:py-8 space-y-8">
        <div className="flex flex-col items-center justify-center mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl text-[#333] font-bold text-center">
            Notre catalogue de formations
          </h1>
          
          {categoriesLoading ? (
            <div className="flex items-center justify-center min-h-[100px]">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
          ) : (
            <CategorySelector 
              categories={categories || []} 
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          )}

          {selectedCategory && (
            <Button
              variant="link"
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="text-gray-500 hover:text-gray-700 underline"
            >
              Réinitialiser le filtre
            </Button>
          )}
        </div>

        {/* Afficher les formations seulement quand une catégorie est sélectionnée */}
        {selectedCategory && (
          <>
            <div className="mb-4 sm:mb-10">
              <h1 className="text-2xl sm:text-2xl text-orange-400 font-bold mb-1 sm:mb-2">
                Formations {selectedCategory}
              </h1>
              <p className="text-xs sm:text-base text-gray-600 max-w-2xl">
                Nos formations pour développer vos compétences en{" "}
                {selectedCategory.toLowerCase()}.
              </p>
            </div>

            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {isLoadingFormations || isFetchingFormations
                ? Array.from({ length: isMobile ? 3 : 6 }).map((_, idx) => (
                    <SkeletonCard key={idx} />
                  ))
                : paginatedFormations.map((formation) => (
                    <FormationCard
                      // @ts-expect-error formation type may not have 'formation.categorie' property due to API response shape
                      key={`formation-${formation.id}`}
                      // @ts-expect-error formation type may not have 'formation.categorie' property due to API response shape
                      formation={formation}
                    />
                  ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-6 sm:mt-8 gap-2 flex-wrap">
                {Array.from({ length: totalPages }, (_, index) => (
                  <Button
                    key={index + 1}
                    variant={currentPage === index + 1 ? "default" : "outline"}
                    className="h-8 w-8 sm:h-10 sm:w-10 p-0"
                    onClick={() => handlePageChange(index + 1)}>
                    {index + 1}
                  </Button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
