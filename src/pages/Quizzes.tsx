import { Layout } from "@/components/layout/Layout";
import axios from "axios";
import { useUser } from "@/hooks/useAuth";
import { QuizList } from "@/components/quiz/QuizList";
import { StagiaireQuizList } from "@/components/quiz/StagiaireQuizList";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/quiz/CategoryService";
import { Loader2, WifiOff } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StagiaireQuizAdventure from "@/components/quiz/StagiaireQuizAdventure";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function Quizzes() {
  const isOnline = useOnlineStatus();
  const { user } = useUser();

  // À appeler à la fin d'un quiz réussi : triggerQuizBadge();
  const triggerQuizBadge = async () => {
    if (user && localStorage.getItem("token")) {
      await axios.post(
        "/api/stagiaire/achievements/check",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    }
  };

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["quiz-categories"],
    queryFn: () => categoryService.getCategories(),
    enabled: !!localStorage.getItem("token") && isOnline,
  });

  return (
    <Layout>
      <div className="container mx-auto py-4 px-2 sm:py-6 sm:px-4 lg:py-8 space-y-6 sm:space-y-8">
        {/* À appeler dans le callback de succès de la soumission d'un quiz : triggerQuizBadge() */}
        {!isOnline && (
          <Alert variant="destructive" className="mb-4">
            <WifiOff className="h-4 w-4" />
            <AlertTitle>Vous êtes hors ligne</AlertTitle>
            <AlertDescription>
              Certaines fonctionnalités peuvent être limitées. Vous pourrez
              toujours accéder aux quiz que vous avez déjà chargés.
            </AlertDescription>
          </Alert>
        )}

        <h1 className="text-2xl font-bold mb-8"></h1>

        {categoriesLoading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="adventure" className="space-y-6 ">
            <TabsList>
              <TabsTrigger value="adventure">Aventure</TabsTrigger>
              <TabsTrigger value="mes-quizzes">Mes quiz</TabsTrigger>
            </TabsList>
            <TabsContent value="adventure">
              <StagiaireQuizAdventure />
            </TabsContent>
            <TabsContent value="mes-quizzes">
              <StagiaireQuizList onQuizSuccess={triggerQuizBadge} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
}
