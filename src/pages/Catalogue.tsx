import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BookOpen,
  Loader2,
  Funnel,
  LucideTrainFrontTunnel,
  ChevronLeft,
} from "lucide-react";

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  useCategories,
  useFormations,
} from "@/use-case/hooks/catalogue/useCatalogue";
import { Layout } from "@/components/layout/Layout";
import PaginationControls from "@/components/catalogueFormation/PaginationControls";
import SkeletonCard from "@/components/ui/SkeletonCard";
import FormationCard from "@/components/catalogueFormation/FormationCard";
import { stripHtmlTags } from "@/utils/UtilsFunction";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Catalogue() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("categories");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
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
  console.log(formationsResponse);
  const filteredFormations = useMemo(() => {
    if (!formationsResponse) return [];
    // Toujours convertir en tableau si ce n'est pas déjà un tableau
    const data = Array.isArray(formationsResponse)
      ? formationsResponse
      : Object.values(formationsResponse);

    if (selectedCategory === "all") return data;
    return data.filter(
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
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-lg sm:text-2xl font-bold">Catalogue de formations</h1>
          <Link
            to="/"
            className="inline-flex items-center text-amber-600 hover:text-amber-700">
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span className="text-sm sm:text-base">Retour</span>
          </Link>
        </div>

        {categoriesLoading ? (
          <div className="flex items-center justify-center min-h-[30vh] sm:min-h-[50vh]">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-amber-500" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1.5 sm:gap-4 mb-4 sm:mb-8">
            {categories?.map((category) => {
              const categoryStyles = {
                Bureautique: "bg-[#3D9BE9] border-[#3D9BE9]/30 text-[#3D9BE9]",
                Langues: "bg-[#A55E6E] border-[#A55E6E]/30 text-[#A55E6E]",
                Internet: "bg-[#FFC533] border-[#FFC533]/30 text-[#FFC533]",
                Création: "bg-[#9392BE] border-[#9392BE]/30 text-[#9392BE]",
              };

              const defaultStyle = "border-gray-200 text-white";
              const cardStyle =
                categoryStyles[category.name as keyof typeof categoryStyles] ||
                defaultStyle;

              return (
                <Card
                  key={category.id}
                  className={`group relative overflow-hidden border rounded-lg transition-all hover:shadow-lg ${
                    cardStyle.split(" ")[0]
                  } ${cardStyle.split(" ")[1]}`}>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 opacity-20"></div>

                  <CardHeader className="relative z-10 p-2 sm:p-4">
                    <div className="flex items-center gap-1.5 sm:gap-3">
                      <div
                        className={`p-1 sm:p-2 rounded-lg ${cardStyle.split(" ")[2]}`}>
                        <svg
                          className="w-2.5 h-2.5 sm:w-5 sm:h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-xs sm:text-lg font-bold text-white truncate">
                          {category.name}
                        </CardTitle>
                        <CardDescription className="text-[10px] sm:text-sm line-clamp-1 text-white/90">
                          {stripHtmlTags(category.description)}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="relative z-10 p-2 sm:p-4 pt-0">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 text-[10px] sm:text-sm text-white">
                        <BookOpen className="w-2.5 h-2.5 sm:w-4 sm:h-4" />
                        <span>{category.count}</span>
                      </div>

                      <Button
                        variant="ghost"
                        className="h-5 sm:h-8 px-1.5 sm:px-3 text-[10px] sm:text-xs font-medium rounded-full hover:bg-opacity-30 border border-white text-white group-hover:bg-white group-hover:text-black transition duration-300 ease-in-out"
                        onClick={() => {
                          setSelectedCategory(category.name);
                        }}>
                        <span className="hidden sm:inline">Explorer</span>
                        <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 sm:ml-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="mb-4 sm:mb-10">
          <h2 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">Découvrez Nos Formations</h2>
          <p className="text-xs sm:text-base text-gray-600 max-w-2xl">
            Accédez à une sélection de formations enrichissantes pour développer
            vos compétences à votre rythme.
          </p>
        </div>

        <div className="mb-4 sm:mb-6">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            className="w-full sm:w-auto"
            onClick={() => setSelectedCategory("all")}>
            Toutes les catégories
          </Button>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {isLoadingFormations || isFetchingFormations
            ? Array.from({ length: isMobile ? 3 : 6 }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))
            : Array.isArray(filteredFormations) &&
              paginatedFormations.map((formation) => (
                <FormationCard
                  key={`formation-${formation.id}`}
                  formation={formation}
                />
              ))}
        </div>

        {selectedCategory === "all" && totalPages > 1 && (
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
      </div>
    </Layout>
  );
}
