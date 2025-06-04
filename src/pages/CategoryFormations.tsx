import { Layout } from "@/components/layout/Layout";
import { FormationCard } from "@/components/dashboard/FormationCard";
import { useQuery } from "@tanstack/react-query";
import { Formation } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

async function fetchFormations(categoryId: string): Promise<Formation[]> {
  try {
    const response = await fetch(
      `${backendUrl}/formations/categories/${categoryId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch formations");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching formations:", error);
    throw error;
  }
}

export default function CategoryFormations() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const isMobile = useIsMobile();

  const {
    data: formations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["formations", categorySlug],
    queryFn: () => fetchFormations(categorySlug || ""),
    enabled: !!categorySlug,
  });

  if (error) {
    toast.error("Failed to load formations");
  }

  return (
    <Layout>
      <div className="container py-4 sm:py-8">
        <Link
          to="/catalogue"
          className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-4 sm:mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span className="text-sm sm:text-base">Retour au catalogue</span>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
          {categorySlug === "bureautique" && "Bureautique"}
          {categorySlug === "langues" && "Langues"}
          {categorySlug === "internet" && "Internet"}
          {categorySlug === "creation" && "Création"}
        </h1>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(isMobile ? 3 : 6)].map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-40 w-full rounded-xl" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {formations && formations.length > 0 ? (
              formations.map((formation) => (
                <FormationCard key={formation.id} formation={formation} />
              ))
            ) : (
              <div className="col-span-full text-center py-8 sm:py-12">
                <p className="text-gray-500 text-sm sm:text-base">
                  Aucune formation n'est disponible dans cette catégorie pour le
                  moment.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
