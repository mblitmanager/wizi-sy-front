import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Award, BarChart3, ChevronRight, GraduationCap, Gift } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import ProfileHeader, { ProfileInfoCard } from "@/components/profile/ProfileHeader";
import UserStats from "@/components/profile/UserStats";
import ContactSection from "@/components/FeatureHomePage/ContactSection";
import AdCatalogueBlock from "@/components/FeatureHomePage/AdCatalogueBlock";
import VideoUploader from "@/components/common/VideoUploader";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/useAuth";
import { useCatalogueFormations } from "@/hooks/queries/useCatalogueQueries";
import { useUserAchievements, useUserProgress } from "@/hooks/queries/useProfileQueries";
import FormateurService from "@/services/FormateurService";
import type { Contact } from "@/types/contact";

const QUICK_LINKS = [
  { to: "/profile/badges", icon: Award, title: "Mes badges", text: "Vos succès débloqués" },
  { to: "/profile/formations", icon: GraduationCap, title: "Mes formations", text: "Vos parcours en cours" },
  { to: "/profile/statistiques", icon: BarChart3, title: "Mes statistiques", text: "Résultats détaillés" },
  { to: "/suivi-parrainage", icon: Gift, title: "Mes parrainages", text: "Suivi de vos filleuls" },
];

function UserStatsSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-live="polite">
      <span className="sr-only">Chargement des statistiques…</span>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-36 rounded-2xl" />
    </div>
  );
}

const ProfilePage = () => {
  const { user, role } = useUser();
  const isTrainer = role === "formateur";
  const isStagiaire = role === "stagiaire";
  const isAdmin = role === "admin" || !!user?.is_admin;

  const { data: userProgress = null, isLoading: progressLoading } = useUserProgress();
  const { data: achievements = [], isLoading: achievementsLoading } = useUserAchievements();
  const { data: catalogue = [] } = useCatalogueFormations();

  const { data: trainees, isLoading: traineesLoading } = useQuery<Contact[]>({
    queryKey: ["contacts", "trainees"],
    queryFn: () => FormateurService.getTraineesAsContacts(),
    enabled: isTrainer,
  });

  return (
    <Layout>
      <div className="space-y-6">
        <ProfileHeader
          user={user}
          userProgress={userProgress}
          achievements={achievements}
          achievementsLoading={achievementsLoading}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-6">
            {isStagiaire &&
              (progressLoading || achievementsLoading ? (
                <UserStatsSkeleton />
              ) : (
                <UserStats user={user} userProgress={userProgress} achievements={achievements} />
              ))}

            {isStagiaire && (
              <section aria-labelledby="quick-links-title">
                <h2 id="quick-links-title" className="mb-3 text-base font-semibold text-foreground">
                  Accès rapides
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {QUICK_LINKS.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/25 hover:bg-accent/40"
                    >
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                        <link.icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-foreground">{link.title}</span>
                        <span className="block text-xs text-muted-foreground">{link.text}</span>
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {isAdmin && (
              <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-sm)]">
                <h2 className="mb-3 text-base font-semibold text-foreground">Uploader une vidéo</h2>
                <VideoUploader />
              </section>
            )}

            {isTrainer && <ContactSection contacts={trainees} loading={traineesLoading} title="Mes Apprenants" />}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <ProfileInfoCard user={user} />
          </aside>
        </div>

        {!isTrainer && (
          <section className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-sm)] md:p-6">
            <ContactSection />
          </section>
        )}

        {!isTrainer && catalogue.length > 0 && <AdCatalogueBlock formations={catalogue.slice(0, 4)} />}
      </div>
    </Layout>
  );
};

export default ProfilePage;
