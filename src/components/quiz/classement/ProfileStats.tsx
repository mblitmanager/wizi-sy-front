import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, CheckCircle, TrendingUp, Trophy } from "lucide-react";

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
          <span className="text-muted-foreground text-center">
            Chargement des statistiques...
          </span>
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
    <div className="container mx-auto mb-4 p-3 sm:p-4 bg-gradient-to-br from-yellow-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-lg border dark:border-gray-800">
      {/* Titre */}
      <div className="mb-3 text-center md:text-left">
        <h3 className="text-2xl font-extrabold text-brown-shade dark:text-yellow-400 flex items-center gap-2 justify-center md:justify-start">
          <Trophy size={32} className="mr-1" />
          Mes statistiques
        </h3>
      </div>

      {/* Grille de statistiques */}
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Score total",
            icon: (
              <TrendingUp
                size={32}
                className="text-yellow-500 animate-bounce"
              />
            ), // icône animée
            value: stats.totalScore || 0,
            bg: "bg-yellow-100 dark:bg-yellow-900",
          },
          {
            label: "Quiz complétés",
            icon: (
              <CheckCircle size={32} className="text-green-500 animate-pulse" />
            ), // icône animée
            value: stats.totalQuizzes || 0,
            bg: "bg-green-100 dark:bg-green-900",
          },
          {
            label: "Score moyen",
            icon: (
              <BarChart2
                size={32}
                className="text-blue-500 animate-spin-slow"
              />
            ), // icône animée
            value: stats.averageScore
              ? `${Math.round(stats.averageScore)}%`
              : "0%",
            bg: "bg-blue-100 dark:bg-blue-900",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className={`flex flex-col items-center gap-1 sm:gap-2 p-3 sm:p-4 rounded-xl shadow-md border-2 border-transparent hover:border-orange-300 transition-all duration-200 ${stat.bg}`}
            style={{ minHeight: 90 }}>
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mb-0.5 sm:mb-1">
              {stat.icon}
            </div>
            <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-300 font-medium uppercase tracking-wide">
              {stat.label}
            </span>
            <span className="text-lg sm:text-2xl font-extrabold text-gray-800 dark:text-white">
              {stat.value}
            </span>
          </div>
        ))}
      </div>
      {/* Message motivation */}
      <div className="mt-5 text-center">
        <span className="inline-block bg-orange-100 dark:bg-yellow-900 text-orange-700 dark:text-yellow-300 px-4 py-2 rounded-full font-semibold shadow-sm animate-bounce-slow">
          Continue comme ça, chaque quiz te rapproche du sommet ! 🚀
        </span>
      </div>
    </div>
  );
}
