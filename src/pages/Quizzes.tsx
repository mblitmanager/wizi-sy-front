import { Layout } from "@/components/layout/Layout";
import { QuizList } from "@/components/quiz/QuizList";
import { StagiaireQuizList } from "@/components/quiz/StagiaireQuizList";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/quiz/CategoryService";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAdvert from "@/components/publiciter/useAdvert";
import AdvertBanner from "@/components/publiciter/AdvertBanner";

export default function Quizzes() {
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["quiz-categories"],
    queryFn: () => categoryService.getCategories(),
    enabled: !!localStorage.getItem("token"),
  });
  const { isVisible, message, closeAdvert } = useAdvert(
    "Je parraine et je gagne 50 € !"
  );
  return (
    <Layout>
      <div className="container mx-auto px-4 md:pb-4 max-w-7xl">
        <h1 className="text-3xl text-blue-custom-100 font-bold mb-8">
          Quiz disponibles
        </h1>

        {isVisible && <AdvertBanner message={message} onClose={closeAdvert} />}

        {categoriesLoading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="mes-quizzes" className="space-y-6 ">
            <TabsList className="grid w-full grid-cols-2 bg-slate-200">
              <TabsTrigger value="mes-quizzes">Mes Quiz</TabsTrigger>
              <TabsTrigger value="tous-quizzes">Tous les Quiz</TabsTrigger>
            </TabsList>
            <TabsContent value="mes-quizzes">
              <StagiaireQuizList />
            </TabsContent>
            <TabsContent value="tous-quizzes">
              <QuizList />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
}
