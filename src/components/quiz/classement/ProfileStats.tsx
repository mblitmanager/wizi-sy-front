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
    <div className="container mx-auto mb-4 sm:p-4 bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-800">
      {/* Titre */}
      <div className="mb-4 text-center md:text-left">
        <h3 className="text-lg md:text-xl font-semibold  dark:text-yellow-400">
          Mes statistiques
        </h3>
      </div>
      <hr />
      {/* Grille de statistiques */}
      <div className="flex flex-wrap justify-between gap-4 sm:gap-6">
        {[
          {
            label: "Score total",
            icon: <TrendingUp size={24} className="text-yellow-500" />,
            value: stats.totalScore || 0,
            suffix: "",
          },
          {
            label: "Quiz complétés",
            icon: <CheckCircle size={24} className="text-green-500" />,
            value: stats.totalQuizzes || 0,
            suffix: "",
          },
          {
            label: "Score moyen",
            icon: <BarChart2 size={24} className="text-blue-500" />,
            value: stats.averageScore
              ? `${Math.round(stats.averageScore)}%`
              : "0%",
            suffix: "",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-2  border-gray-200 dark:border-gray-700 w-full sm:w-auto">
            <div className="text-2xl flex items-center justify-center">
              {stat.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </span>
              <span className="text-lg font-bold text-gray-800 dark:text-white">
                {stat.value}
                {stat.suffix}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
