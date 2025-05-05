import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import FormationCatalogue from "@/components/profile/FormationCatalogue";
import StatsSummary from "@/components/profile/StatsSummary";
import { quizService } from "@/services/quizServiceA";
import { rankingService } from "@/services/rankingService";
import { User } from "@/types/index";
import { QuizResult, Category, UserProgress } from "@/types/quiz";
import { useToast } from "@/hooks/use-toast";
import { userService } from "@/services/userServiceA";
import { formationService } from "@/services/formationServiceA";
import { Stagiaire } from "@/types/stagiaire";
import { Layout } from "@/components/layout/Layout";

const mapStagiaireToUser = (stagiaire: Stagiaire): User => ({
  id: stagiaire.id.toString(),
  name: stagiaire.prenom,
  email: "",
  role: "stagiaire",
  level: 1,
  points: 0,
});

const ProfilePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabFromUrl = searchParams.get("tab") || "overview";

  const [user, setUser] = useState<User | null>(null);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(activeTabFromUrl);
  const [rankings, setRankings] = useState<any[]>([]);
  const { toast } = useToast();
  const [formations, setFormations] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);

        const [
          profileData,
          quizResults,
          categoriesData,
          progressData,
          rankingsData,
          formationsData,
        ] = await Promise.all([
          userService.getProfile(),
          quizService.getUserResults(),
          quizService.getQuizCategories(),
          rankingService.getUserProgress(),
          rankingService.getGlobalRanking(),
          formationService.getFormationsByStagiaire(),
        ]);

        if (profileData?.stagiaire) {
          const user = mapStagiaireToUser(profileData.stagiaire);
          setUser(user);
        }

        setResults(quizResults || []);

        if (Array.isArray(categoriesData)) {
          const colors = [
            "#4F46E5",
            "#10B981",
            "#F59E0B",
            "#EF4444",
            "#8B5CF6",
            "#EC4899",
          ];
          const colorClasses = [
            "category-blue-500",
            "category-green-500",
            "category-yellow-500",
            "category-red-500",
            "category-purple-500",
            "category-pink-500",
          ];

          const categoriesWithColors = categoriesData.map((name, index) => ({
            id: name?.toString() || `category-${index}`,
            name: name?.toString() || `Category ${index}`,
            description: `Quizzes dans la catégorie ${name || index}`,
            color: colors[index % colors.length],
            colorClass: colorClasses[index % colorClasses.length],
            quizCount: 0,
          }));

          setCategories(categoriesWithColors);
        }
        console.log("progressData:", progressData.total);
        if (progressData?.total) {
          const userProgressData: UserProgress = {
            totalScore: progressData.total.points || 0,
            completedQuizzes: progressData.total.completed_quizzes || 0,
            averageScore: progressData.total.average_score || 0,
          };

          setUserProgress(userProgressData);
        }

        setRankings(rankingsData || []);
        setFormations(formationsData?.data || []);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données utilisateur",
          variant: "destructive",
        });
        setError("Une erreur est survenue.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [toast]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          Chargement...
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div>Error: {error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 pb-20 md:pb-4 max-w-7xl">
        {user && <ProfileHeader user={user} />}
        <div className="mt-16 space-y-12">
          {userProgress && <StatsSummary userProgress={userProgress} />}
          <FormationCatalogue formations={formations} />
        </div>
        <ProfileTabs
          user={user}
          results={results}
          categories={categories}
          userProgress={userProgress}
          isLoading={isLoading}
          rankings={rankings}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
        />
      </div>
    </Layout>
  );
};

export default ProfilePage;
