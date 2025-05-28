import { Layout } from "@/components/layout/Layout";
import { QuizList } from "@/components/quiz/QuizList";
import { StagiaireQuizList } from "@/components/quiz/StagiaireQuizList";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/quiz/CategoryService";
import { Loader2, WifiOff } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function Quizzes() {
  const isOnline = useOnlineStatus();
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["quiz-categories"],
    queryFn: () => categoryService.getCategories(),
    enabled: !!localStorage.getItem("token") && isOnline,
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 md:pb-4 max-w-7xl">
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

        <h1 className="text-2xl font-bold mb-8">Quiz disponibles</h1>

        {categoriesLoading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="mes-quizzes" className="space-y-6 ">
            {/* <TabsList className="grid w-full grid-cols-2 bg-slate-200">
              <TabsTrigger value="mes-quizzes">Mes Quiz</TabsTrigger>
              <TabsTrigger value="tous-quizzes">Tous les Quiz</TabsTrigger>
            </TabsList> */}
            {/* <div className="mt-2 h-[calc(100vh-25rem)] overflow-y-auto p-4"> */}
            {/* <TabsContent value="mes-quizzes"> */}
              <StagiaireQuizList />
            {/* </TabsContent> */}
            {/* <TabsContent value="tous-quizzes">
              <QuizList />
            </TabsContent> */}
            {/* </div> */}
          </Tabs>
        )}
      </div>
    </Layout>
  );
}
