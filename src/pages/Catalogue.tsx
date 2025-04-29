
import { Layout } from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/quiz/CategoryService";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Catalogue() {
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["quiz-categories"],
    queryFn: () => categoryService.getCategories(),
    enabled: !!localStorage.getItem('token')
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Catalogue des formations</h1>
        
        {categoriesLoading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories?.map((category) => (
              <Card key={category.id} className="overflow-hidden transition-all hover:shadow-lg">
                <CardHeader className="pb-2" style={{ backgroundColor: category.color + '10' }}>
                  <div className="flex justify-between items-center">
                    <Badge style={{ backgroundColor: category.color }}>{category.quizCount || 0} formations</Badge>
                  </div>
                  <CardTitle className="text-xl pt-2">{category.name}</CardTitle>
                  <CardDescription>{category.description || 'Explorez nos formations dans cette catégorie'}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="mb-6 text-sm text-muted-foreground">
                    Accédez à toutes nos formations et quiz dans la catégorie {category.name}.
                  </p>
                  <Button asChild className="w-full">
                    <Link to={`/catalogue/${category.id}`}>
                      Explorer
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
