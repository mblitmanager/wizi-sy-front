import { Layout } from "@/components/layout/Layout";
import { CategoryCard } from "@/components/dashboard/CategoryCard";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const backendUrl = "http://localhost:8000/api";

async function fetchCategories(token: string): Promise<Category[]> {
  try {
    const response = await fetch(`${backendUrl}/quiz/categories`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

export default function Catalogue() {
  const { token } = useAuth();
  
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(token),
    enabled: !!token
  });

  if (error) {
    toast.error("Failed to load categories");
  }

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Catalogue de formations</h1>
        <p className="text-gray-600 mb-8">
          Découvrez toutes nos formations disponibles par catégorie
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))
            ) : (
              <p className="col-span-full text-center py-12 text-gray-500">
                Aucune catégorie de formation n'est disponible pour le moment.
              </p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
