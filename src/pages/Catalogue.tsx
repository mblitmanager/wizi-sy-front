import { Layout } from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/quiz/CategoryService";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HeaderSection from "@/components/features/HeaderSection";
import FormationCard from "@/components/catalogueFormation/FormationCard";
import PaginationControls from "@/components/catalogueFormation/PaginationControls";
import SkeletonCard from "@/components/ui/SkeletonCard";
import { catalogueFormationApi, progressAPI } from "@/services/api";
import { CatalogueFormationWithFormation, Formation } from "@/types/stagiaire";
import { mapCatalogueToFormation } from "@/utils/mapCatalogueToFormation";
import AdvertBanner from "@/components/publiciter/AdvertBanner";
import useAdvert from "@/components/publiciter/useAdvert";

export default function Catalogue() {
  // Catégories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["quiz-categories"],
    queryFn: () => categoryService.getCategories(),
    enabled: !!localStorage.getItem("token"),
  });

  // Formations
  const [formationsDisponibles, setFormationsDisponibles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);
  const [isLoadingFormations, setIsLoadingFormations] = useState(true);
  const [activeTab, setActiveTab] = useState("categories");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const formationsParPage = 6;
  // Filtrage des formations selon la catégorie sélectionnée
  const formationsFiltrees = useMemo(() => {
    if (selectedCategory === "all") return formationsDisponibles;
    return formationsDisponibles.filter((formation: any) => {
      // On suppose que la catégorie est dans formation.categoryId ou formation.categorieId
      return (
        String(formation.categoryId || formation.categorieId) ===
        String(selectedCategory)
      );
    });
  }, [formationsDisponibles, selectedCategory]);

  const formationsPage = useMemo(() => {
    const start = (currentPage - 1) * formationsParPage;
    const end = start + formationsParPage;
    return formationsFiltrees.slice(start, end);
  }, [formationsFiltrees, currentPage]);

  useEffect(() => {
    setLastPage(Math.ceil(formationsFiltrees.length / formationsParPage) || 1);
  }, [formationsFiltrees]);

  const fetchFormationsPage = async () => {
    setIsLoadingFormations(true);
    try {
      const [, catalogueResponse] = await Promise.all([
        progressAPI.getUserProgress(),
        catalogueFormationApi.getAllCatalogueFormation(),
      ]);

      // catalogueResponse est l'objet JSON complet
      const formations = catalogueResponse.member || [];

      setFormationsDisponibles(formations);
      setLastPage(1); // Pas de pagination côté API
      setCurrentPage(1);
      setNextPageUrl(null);
      setPrevPageUrl(null);
    } catch (e) {
      console.error("Erreur de récupération :", e);
    } finally {
      setIsLoadingFormations(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    if (activeTab === "formations") {
      fetchFormationsPage();
    }
  }, [activeTab]);

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
  const { isVisible, message, closeAdvert } = useAdvert(
    "Je parraine et je gagne 50 € !"
  );
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl text-blue-custom-100 font-bold mb-8">
          Catalogue
        </h1>

        <div className="mt-2 h-[calc(100vh-18rem)] overflow-y-auto p-4 mb-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-8">
            <TabsList className="mb-4">
              <TabsTrigger value="categories">Catégories</TabsTrigger>
              <TabsTrigger value="formations">
                Toutes les formations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="categories">
              {categoriesLoading ? (
                <div className="flex items-center justify-center min-h-[50vh]">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories?.map((category) => (
                    <Card
                      key={category.id}
                      className="overflow-hidden transition-all hover:shadow-lg">
                      <CardHeader
                        className="pb-2"
                        style={{ backgroundColor: category.color + "10" }}>
                        <div className="flex justify-between items-center">
                          <Badge style={{ backgroundColor: category.color }}>
                            {category.quizCount || 0} formations
                          </Badge>
                        </div>
                        <CardTitle className="text-xl pt-2">
                          {category.name}
                        </CardTitle>
                        <CardDescription>
                          {category.description ||
                            "Explorez nos formations dans cette catégorie"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <p className="mb-6 text-sm text-muted-foreground">
                          Accédez à toutes nos formations et quiz dans la
                          catégorie {category.name}.
                        </p>
                        <Button asChild className="w-full">
                          <Link to={`/catalogue/${category.id}`}>Explorer</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="formations">
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-2">
                  Découvrez Nos Formations
                </h2>
                {isVisible && (
                  <AdvertBanner message={message} onClose={closeAdvert} />
                )}

                <p className="text-gray-600 max-w-2xl">
                  Accédez à une sélection de formations enrichissantes pour
                  développer vos compétences à votre rythme.
                </p>
              </div>

              {/* Filtres par catégorie */}
              <div className="mb-6 flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("all")}>
                  Toutes les catégories
                </Button>
                {categories?.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={
                      selectedCategory === cat.id ? "default" : "outline"
                    }
                    style={{
                      backgroundColor:
                        selectedCategory === cat.id ? cat.color : undefined,
                    }}
                    onClick={() => setSelectedCategory(cat.id)}>
                    {cat.name}
                  </Button>
                ))}
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {isLoadingFormations
                  ? Array.from({ length: formationsParPage }).map((_, idx) => (
                      <SkeletonCard key={idx} />
                    ))
                  : formationsPage
                      .map(mapCatalogueToFormation)
                      .map((formation: Formation) => {
                        // Chercher la couleur de la catégorie
                        const catName = formation.categorie;
                        const cat = categories?.find((c) => c.name === catName);
                        return (
                          <FormationCard
                            key={`available-${formation.catalogue_formation.id}-${formation.id}`}
                            formation={formation}
                            bgColor={cat?.color}
                          />
                        );
                      })}
              </div>

              <div className="mt-10 flex justify-center">
                <PaginationControls
                  currentPage={currentPage}
                  lastPage={lastPage}
                  onPageChange={handlePageChange}
                  nextPageUrl={nextPageUrl}
                  prevPageUrl={prevPageUrl}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
