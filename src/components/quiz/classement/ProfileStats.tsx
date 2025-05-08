import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface ProfileStatsProps {
  profile: any;
  stats: any;
  loading?: boolean;
}

export function ProfileStats({ profile, stats, loading = false }: ProfileStatsProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chargement des statistiques...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-md" />
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
    <Card>
      <CardHeader>
        <CardTitle className="text-[#FEB823]">Mes statistiques</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="p-4 bg-[#3D9BE9] rounded-t-lg">
              <CardTitle className="text-sm font-medium text-white">
                Score total
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 bg-[#EAF5FE] rounded-b-lg">
              <div className="text-2xl font-bold text-[#3D9BE9]">
                {stats.totalScore || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-4 bg-[#A55E6E] rounded-t-lg">
              <CardTitle className="text-sm font-medium text-white">
                Quiz joués
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 bg-[#F8F0F2] rounded-b-lg">
              <div className="text-2xl font-bold text-[#A55E6E]">
                {stats.totalQuizzes || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-4 bg-[#FFC533] rounded-t-lg">
              <CardTitle className="text-sm font-medium text-black">
                Score moyen
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 bg-[#FFF8E1] rounded-b-lg">
              <div className="text-2xl font-bold text-[#FFC533]">
                {stats.averageScore ? Math.round(stats.averageScore) : 0}%
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
