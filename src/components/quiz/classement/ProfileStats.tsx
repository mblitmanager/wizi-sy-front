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
          <span className="text-muted-foreground">
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
    <div className="container mx-auto mb-4 p-3 sm:p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm border dark:border-gray-800">
      {/* Titre */}
      <div className="mb-3 text-center md:text-left">
        <h3 className="text-base md:text-lg font-semibold text-gray-700 dark:text-yellow-400">
          Mes statistiques
        </h3>
      </div>

      {/* Grille de statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            label: "Score total",
            icon: <TrendingUp size={20} className="text-yellow-500" />,
            value: stats.totalScore || 0,
          },
          {
            label: "Quiz complétés",
            icon: <CheckCircle size={20} className="text-green-500" />,
            value: stats.totalQuizzes || 0,
          },
          {
            label: "Score moyen",
            icon: <BarChart2 size={20} className="text-blue-500" />,
            value: stats.averageScore
              ? `${Math.round(stats.averageScore)}%`
              : "0%",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md shadow-sm">
            <div className="flex items-center justify-center w-8 h-8">
              {stat.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {stat.label}
              </span>
              <span className="text-sm font-semibold text-gray-800 dark:text-white">
                {stat.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
