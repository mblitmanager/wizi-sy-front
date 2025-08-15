import { Layout } from "@/components/layout/Layout";
import axios from "axios";
import { useUser } from "@/hooks/useAuth";
import { StagiaireQuizList } from "@/components/quiz/StagiaireQuizList";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/quiz/CategoryService";
import { Loader2, WifiOff } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StagiaireQuizAdventure from "@/components/quiz/StagiaireQuizAdventure";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function TabSkeleton({ tab }: { tab: string }) {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 w-40 bg-gray-200 rounded" />
        <div className="h-6 w-24 bg-gray-200 rounded" />
      </div>
      {/* Cards grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4">
            <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-1/2 bg-gray-200 rounded mb-3" />
            <div className="h-28 w-full bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Quizzes() {
  const isOnline = useOnlineStatus();
  const { user } = useUser();

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialTab = params.get("tab") || "adventure";
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    p.set("tab", activeTab);
    navigate({ search: p.toString() }, { replace: true });
  }, [activeTab, navigate, location.search]);

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

  const handleTabChange = (value: string) => {
    setIsSwitching(true);
    setActiveTab(value);
    // petite fenêtre de transition pour l’effet visuel
    setTimeout(() => setIsSwitching(false), 220);
  };

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
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6 ">
            <TabsList className="flex flex-wrap gap-2">
              <TabsTrigger value="adventure">Aventure</TabsTrigger>
              <TabsTrigger value="mes-quizzes">Mes quiz</TabsTrigger>
            </TabsList>
            <div className={`transition-opacity duration-200 ${isSwitching ? 'opacity-0' : 'opacity-100'}`}>
              {isSwitching ? (
                <TabSkeleton tab={activeTab} />
              ) : (
                <>
                  <TabsContent value="adventure">
                    <StagiaireQuizAdventure />
                  </TabsContent>
                  <TabsContent value="mes-quizzes">
                    <StagiaireQuizList />
                  </TabsContent>
                </>
              )}
            </div>
          </Tabs>
        )}
      </div>
    </Layout>
  );
}
