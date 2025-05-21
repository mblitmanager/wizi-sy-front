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
import { Loader2 } from "lucide-react";

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

export default function Catalogue() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("categories");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const {
    data: formationsResponse,
    isLoading: isLoadingFormations,
    isFetching: isFetchingFormations,
    error: formationsError,
  } = useFormations(currentPage);

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const filteredFormations = useMemo(() => {
    if (!formationsResponse?.data) return [];
    if (selectedCategory === "all") return formationsResponse.data;
    return formationsResponse.data.filter(
      (formation) => formation.formation.categorie === selectedCategory
    );
  }, [formationsResponse, selectedCategory]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (categoriesError || formationsError) {
    return (
      <Layout>
        <div className="text-red-500 p-4">
          Erreur lors du chargement des données
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl text-blue-custom-100 font-bold mb-8">
          Catalogue de formations
        </h1>

        <div className="mt-2 h-[calc(100vh-18rem)] overflow-y-auto p-4 mb-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-8"
          >
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
                      className="overflow-hidden transition-all hover:shadow-lg"
                    >
                      <CardHeader className="pb-2 bg-opacity-10 bg-gray-200">
                        <CardTitle className="text-xl pt-2">
                          {category.name}
                        </CardTitle>
                        <CardDescription>
                          {category.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <p className="mb-6 text-sm text-muted-foreground">
                          {category.count} formations disponibles
                        </p>
                        <Button
                          asChild
                          className="w-full"
                          onClick={() => {
                            setActiveTab("formations");
                            setSelectedCategory(category.name);
                          }}
                        >
                          <Link to="#">Explorer</Link>
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
                <p className="text-gray-600 max-w-2xl">
                  Accédez à une sélection de formations enrichissantes pour
                  développer vos compétences à votre rythme.
                </p>
              </div>

              <div className="mb-6 flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("all")}
                >
                  Toutes les catégories
                </Button>
                {categories?.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={
                      selectedCategory === cat.name ? "default" : "outline"
                    }
                    onClick={() => setSelectedCategory(cat.name)}
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {isLoadingFormations || isFetchingFormations
                  ? Array.from({ length: 6 }).map((_, idx) => (
                      <SkeletonCard key={idx} />
                    ))
                  : filteredFormations.map((formation) => (
                      <FormationCard
                        key={`formation-${formation.id}`}
                        formation={formation}
                      />
                    ))}
              </div>

              {formationsResponse && (
                <div className="mt-10 flex justify-center">
                  <PaginationControls
                    currentPage={currentPage}
                    lastPage={formationsResponse.last_page}
                    onPageChange={handlePageChange}
                    nextPageUrl={formationsResponse.next_page_url}
                    prevPageUrl={formationsResponse.prev_page_url}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
