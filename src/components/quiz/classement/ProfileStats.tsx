import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, CheckCircle, TrendingUp } from "lucide-react";

export interface ProfileStatsProps {
  profile: any;
  stats: any;
  loading?: boolean;
}

export function ProfileStats({
  profile,
  stats,
  loading = false,
}: ProfileStatsProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chargement des statistiques...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-100 animate-pulse rounded-md"
                />
              ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Statistiques de l'utilisateur</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            Aucune statistique disponible
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto mb-10 p-4 sm:p-6 border rounded-2xl bg-white shadow-xl dark:bg-gray-900 dark:border-gray-800">
      {/* Titre */}
      <div className="mb-4 text-center md:text-left">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white">
          Mes statistiques
        </h2>
      </div>

      {/* Grille de statistiques */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
        {/* Score total */}
        <div className="p-3 sm:p-4 md:p-5 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 text-white shadow-lg hover:scale-[1.02] transition-transform duration-300">
          <div className="flex flex-col items-center">
            <TrendingUp size={24} className="mb-1 sm:mb-2" />
            <p className="uppercase text-xs sm:text-sm opacity-80">
              Score total
            </p>
            <p className="text-2xl sm:text-3xl font-semibold mt-1">
              {stats.totalScore || 0}
            </p>
          </div>
        </div>

        {/* Quiz complétés */}
        <div className="p-3 sm:p-4 md:p-5 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 text-white shadow-lg hover:scale-[1.02] transition-transform duration-300">
          <div className="flex flex-col items-center">
            <CheckCircle size={24} className="mb-1 sm:mb-2" />
            <p className="uppercase text-xs sm:text-sm opacity-80">
              Quiz complétés
            </p>
            <p className="text-2xl sm:text-3xl font-semibold mt-1">
              {stats.completedQuizzes || 0} / {stats.totalQuizzes || 0}
            </p>
          </div>
        </div>

        {/* Score moyen */}
        <div className="p-3 sm:p-4 md:p-5 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 text-white shadow-lg hover:scale-[1.02] transition-transform duration-300">
          <div className="flex flex-col items-center">
            <BarChart2 size={24} className="mb-1 sm:mb-2" />
            <p className="uppercase text-xs sm:text-sm opacity-80">
              Score moyen
            </p>
            <p className="text-2xl sm:text-3xl font-semibold mt-1">
              {stats.averageScore ? Math.round(stats.averageScore) : 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
