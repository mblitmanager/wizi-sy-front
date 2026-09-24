import { Layout } from "@/components/layout/Layout";
import { useUser } from "@/hooks/useAuth";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Achievement, useUserAchievements } from "@/hooks/queries/useProfileQueries";

const ProfileBadgesPage = () => {
  const { user } = useUser();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Les deux listes sont chargées en parallèle ; les badges obtenus partagent le cache du profil
  const { data: userAchievements = [], isLoading: userLoading } = useUserAchievements();
  const { data: allAchievements = [], isLoading: allLoading } = useQuery({
    queryKey: ["stagiaire", "achievements", "all"],
    queryFn: async (): Promise<Achievement[]> => {
      const res = await api.get("/stagiaire/achievements/all");
      const list = res.data?.achievements ?? res.data;
      return Array.isArray(list) ? list : [];
    },
    enabled: !!user,
    staleTime: 30 * 60 * 1000,
  });
  const loading = userLoading || allLoading;

  const unlockedIds = useMemo(
    () => new Set(userAchievements.map((a) => a.id)),
    [userAchievements]
  );

  const availableTypes = useMemo(() => {
    const set = new Set<string>();
    allAchievements.forEach((a) => {
      if ((a.type || "").trim()) set.add(a.type);
    });
    return Array.from(set).sort();
  }, [allAchievements]);

  const filteredAchievements = useMemo(() => {
    const source = selectedType
      ? allAchievements.filter((a) => a.type === selectedType)
      : allAchievements.slice();
    source.sort((a, b) => {
      const au = unlockedIds.has(a.id);
      const bu = unlockedIds.has(b.id);
      if (au !== bu) return au ? -1 : 1;
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
    return source;
  }, [allAchievements, selectedType, unlockedIds]);

  const AchievementBadge = ({
    a,
    unlocked,
  }: {
    a: Achievement;
    unlocked: boolean;
  }) => {
    return (
      <div
        className={`p-4 rounded-xl border shadow-sm flex flex-col items-center text-center transition-all duration-300 ${unlocked
            ? "bg-white dark:bg-gray-800 border-amber-200 hover:shadow-md"
            : "bg-gray-50 dark:bg-gray-700 opacity-70"
          }`}
        style={!unlocked ? { filter: "grayscale(100%)" } : undefined}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-amber-100 text-amber-700 mb-3">
          <span className="text-2xl">🏅</span>
        </div>
        <div className="font-semibold text-sm mb-1 dark:text-white">
          {a.name}
        </div>
        {a.description && (
          <div className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
            {a.description}
          </div>
        )}
        {a.level && (
          <div className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded-full text-gray-700 dark:text-gray-300">
            {a.level}
          </div>
        )}
        {unlocked && a.unlockedAt && (
          <div className="text-xs text-amber-600 dark:text-amber-400 mt-2">
            Débloqué le {new Date(a.unlockedAt).toLocaleDateString()}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        {/* Header avec navigation */}
        <div className="mb-6">
          <Link
            to="/profile"
            className="inline-flex items-center text-sm text-amber-600 hover:text-amber-700 mb-4">
            ← Retour au profil
          </Link>
          <h1 className="text-2xl font-bold font-montserrat dark:text-white">
            Mes Badges
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {userAchievements.length}{" "}
            badge{userAchievements.length <= 1 ? "" : "s"} débloqué
            {userAchievements.length <= 1 ? "" : "s"} sur{" "}
            {allAchievements.length}

          </p>
        </div>

        {/* Filtres par type */}
        {/* {availableTypes.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedType(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedType === null
                  ? "bg-amber-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}>
              Tous
            </button>
            {availableTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === type
                    ? "bg-amber-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}>
                {type}
              </button>
            ))}
          </div>
        )} */}

        {/* Grille des badges */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse">
                <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600 mx-auto mb-3"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredAchievements.map((a) => (
              <AchievementBadge
                key={a.id}
                a={a}
                unlocked={unlockedIds.has(a.id)}
              />
            ))}
          </div>
        )}

        {!loading && filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold dark:text-white mb-2">
              Aucun badge trouvé
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Aucun badge ne correspond aux filtres sélectionnés.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProfileBadgesPage;
