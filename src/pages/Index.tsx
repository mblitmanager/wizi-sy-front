import { lazy, Suspense, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { Layout } from "@/components/layout/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { PageLoader, SectionSkeleton } from "@/components/common/PageLoader";
import { HowToPlay } from "@/components/FeatureHomePage/HowToPlay";
import { WelcomeBanner } from "@/components/FeatureHomePage/WelcomeBanner";
import { StreakModal } from "@/components/FeatureHomePage/StreakModal";
import { AppDownloadCard } from "@/components/FeatureHomePage/AppDownloadCard";
import { useUser } from "@/hooks/useAuth";
import { useStreakModal } from "@/hooks/useStreakModal";
import { useSuggestedFormations } from "@/hooks/queries/useCatalogueQueries";
import { api } from "@/lib/api";
import { checkAndAnnounceAchievements } from "@/services/achievementsApi";
import { ROLE_HOME } from "@/utils/roles";
import type { User } from "@/types";

dayjs.extend(utc);
dayjs.extend(timezone);

// Sections secondaires chargées après le contenu principal
const ContactsSection = lazy(() => import("@/components/FeatureHomePage/ContactSection"));
const AdCatalogueBlock = lazy(() => import("@/components/FeatureHomePage/AdCatalogueBlock"));
const LandingPage = lazy(() => import("./LandingPage"));

const ACHIEVEMENTS_CHECK_KEY = "lastAchievementsCheckDate";

const parisNow = () => dayjs().tz("Europe/Paris");

function streakFromUser(user: User | null): number {
  const stagiaire = user?.stagiaire as unknown as Record<string, unknown> | undefined;
  const value = stagiaire?.login_streak ?? stagiaire?.loginStreak;
  return typeof value === "number" ? value : 0;
}

/** Série de connexions : lue sur le profil en cache, puis confirmée par /stagiaire/profile. */
function useLoginStreak(user: User | null) {
  const { data } = useQuery({
    queryKey: ["stagiaire", "profile", "login-streak"],
    queryFn: async () => {
      const res = await api.get("/stagiaire/profile");
      const value = res.data?.stagiaire?.login_streak ?? res.data?.login_streak;
      return typeof value === "number" ? value : null;
    },
    enabled: !!user,
  });
  return data ?? streakFromUser(user);
}

/** Tâches de fond déclenchées une fois à l'arrivée sur l'accueil. */
function useHomeSideEffects() {
  useEffect(() => {
    const today = parisNow().format("YYYY-MM-DD");
    if (localStorage.getItem(ACHIEVEMENTS_CHECK_KEY) !== today) {
      checkAndAnnounceAchievements().then(() => localStorage.setItem(ACHIEVEMENTS_CHECK_KEY, today));
    }

    const now = parisNow();
    if (now.hour() === 9 && now.minute() < 10) {
      api.post("/notify-daily-formation").catch(() => undefined);
    }
  }, []);
}

function StagiaireHome({ user }: { user: User }) {
  const loginStreak = useLoginStreak(user);
  const { showStreakModal, hideStreakFor7Days, setHideStreakFor7Days, closeStreakModal } =
    useStreakModal(user, loginStreak);
  const { suggestions, isLoading: isLoadingFormations } = useSuggestedFormations();

  useHomeSideEffects();

  return (
    <div className="px-2 md:px-6 pb-28 sm:pb-16">
      <WelcomeBanner />

      <StreakModal
        isOpen={showStreakModal}
        onClose={closeStreakModal}
        loginStreak={loginStreak}
        hideFor7Days={hideStreakFor7Days}
        onHideFor7DaysChange={setHideStreakFor7Days}
      />

      <HowToPlay />

      <AppDownloadCard />

      {isLoadingFormations ? (
        <div className="mt-6">
          <SectionSkeleton count={3} className="h-56" />
        </div>
      ) : (
        suggestions.length > 0 && (
          <Card className="border-yellow-100 mt-6">
            <CardContent className="p-3 md:p-6">
              <h2 className="mb-2 md:mb-3 text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600">
                Boostez vos compétences dès aujourd'hui !
              </h2>
              <div className="px-2 py-6 md:py-3 bg-white rounded-xl">
                <Suspense fallback={<SectionSkeleton count={3} className="h-56" />}>
                  <AdCatalogueBlock formations={suggestions.slice(0, 6)} />
                </Suspense>
              </div>
            </CardContent>
          </Card>
        )
      )}

      <Card className="bg-white md:p-4 rounded-lg mt-6">
        <CardContent className="p-3 md:p-6">
          <Suspense fallback={<SectionSkeleton count={4} />}>
            <ContactsSection showFormations={false} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

/** Accueil : page d'atterrissage pour les visiteurs, tableau de bord pour les stagiaires. */
export function Index() {
  const { token } = useUser();

  if (!token) {
    return (
      <Suspense fallback={<PageLoader />}>
        <LandingPage />
      </Suspense>
    );
  }

  return (
    <ProtectedRoute>
      <RoleHome />
    </ProtectedRoute>
  );
}

function RoleHome() {
  const { user, role } = useUser();

  // Les autres rôles ont leur propre tableau de bord : pas de flash de l'accueil stagiaire
  if (role !== "stagiaire") {
    return <Navigate to={ROLE_HOME[role]} replace />;
  }

  return (
    <Layout>
      <StagiaireHome user={user!} />
    </Layout>
  );
}
