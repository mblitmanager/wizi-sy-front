import { useState, useMemo } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Trophy,
  Medal,
  Award,
  User,
  LayoutList,
  Search,
  ChevronUp,
  ChevronDown,
  Users,
  Star,
  Crown,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LeaderboardEntry } from "@/types/quiz";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export interface GlobalRankingProps {
  ranking?: LeaderboardEntry[];
  loading?: boolean;
  currentUserId?: string;
}

type SortKey = "rang" | "name" | "quizCount" | "averageScore" | "score";
type SortOrder = "asc" | "desc";

export function GlobalRanking({
  ranking = [],
  loading = false,
  currentUserId,
}: GlobalRankingProps) {
  const [sortKey, setSortKey] = useState<SortKey>("rang");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [search, setSearch] = useState("");
  const [showPodium, setShowPodium] = useState(true);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const filteredRanking = useMemo(() => {
    return ranking.filter((entry: LeaderboardEntry) =>
      entry.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [ranking, search]);

  const sortedRanking = useMemo(() => {
    return [...filteredRanking].sort((a: any, b: any) => {
      let aValue = (a as any)[sortKey];
      let bValue = (b as any)[sortKey];

      if (sortKey === "name") {
        aValue = aValue?.toLowerCase() || "";
        bValue = bValue?.toLowerCase() || "";
      }

      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredRanking, sortKey, sortOrder]);

  // Calcul des totaux
  const totalPoints = sortedRanking.reduce(
    (sum, entry) => sum + (entry.score || 0),
    0
  );
  const totalQuizzes = sortedRanking.reduce(
    (sum, entry) => sum + (entry.quizCount || 0),
    0
  );
  const maxScore = Math.max(
    ...sortedRanking.map((entry) => entry.score || 0),
    1
  );

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ChevronUp className="h-4 w-4 opacity-0" />;
    return sortOrder === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  // Composant pour afficher les formateurs du podium
  const FormateursPodium = ({ entry }: { entry: any }) => {
    console.log("Formateurs ", entry);
    if (!entry.formateurs || entry.formateurs.length === 0) {
      return null;
    }
    return (
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-3 w-3 text-blue-500" />
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Formateur :
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {entry.formateurs.map((formateur: any, index: number) => (
            <div
              key={formateur.id}
              className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full border border-blue-200 dark:border-blue-800">
              <div className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-300">
                  {index + 1}
                </span>
              </div>
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                {formateur.prenom} {formateur.nom.toUpperCase()}
              </span>
              {index === 0 && <Crown className="h-3 w-3 text-wizi-accent" />}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="border rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutList className="h-6 w-6" />
            <span>Classement</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-md bg-gray-100 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  <div className="h-3 w-1/2 bg-gray-200 rounded" />
                </div>
                <div className="h-5 w-10 bg-gray-200 rounded" />
              </div>
            ))}
        </CardContent>
      </Card>
    );
  }

  // Podium top 3
  const podium = sortedRanking.slice(0, 3);
  const podiumOrder = [1, 0, 2];
  const podiumColors = [
    "#C0C0C0", // argent
    "#FFD700", // or
    "#CD7F32", // bronze
  ];

  const podiumIcons = [
    <Medal key="silver" className="h-5 w-5 text-gray-400" />,
    <Trophy key="gold" className="h-6 w-6 text-wizi-accent" />,
    <Award key="bronze" className="h-5 w-5 text-orange-600" />,
  ];

  // Liste sans les 3 premiers (affichés uniquement dans le podium)
  const listRanking = showPodium ? sortedRanking.slice(3) : sortedRanking;

  return (
    <div
      className="mb-4 bg-white dark:bg-gray-900 rounded-lg ring-1 ring-gray-50 dark:ring-gray-800 overflow-hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      {/* Header */}
      <div className="p-4 sm:p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <Trophy className="h-6 w-6 text-wizi-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Classement Général
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Découvrez les meilleurs stagiaires et leurs formateurs
              </p>
            </div>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un stagiaire..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="podium-switch"
              checked={showPodium}
              onCheckedChange={setShowPodium}
            />
            <Label htmlFor="podium-switch">Afficher le podium</Label>
          </div>
        </div>
      </div>

      {/* Podium */}
      {showPodium && podium.length > 0 && (
        <div className="px-4 pt-6 pb-4">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-wizi-accent to-orange-500 rounded-full">
              <Crown className="h-5 w-5 text-white" />
              <span className="text-white font-bold text-lg">PODIUM</span>
              <Crown className="h-5 w-5 text-white" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {podiumOrder.map((pos, i) => {
              const entry = podium[pos];
              if (!entry) return null;

              const isCurrentUser = entry.id?.toString() === currentUserId;
              const heightClass = i === 1 ? "h-32" : "h-24";
              const rankLabels = ["2ème", "1er", "3ème"];
              const rankColors = [
                "from-gray-400 to-gray-300",
                "from-wizi-accent to-orange-300",
                "from-orange-500 to-orange-400",
              ];

              return (
                <div
                  key={i}
                  className={`flex flex-col items-center ${
                    i === 1 ? "order-first md:order-none -mt-4" : ""
                  }`}>
                  {/* Badge de rang */}
                  <div
                    className={`flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-gradient-to-r ${rankColors[i]} text-white font-bold text-sm`}>
                    {podiumIcons[i]}
                    {rankLabels[i]}
                  </div>

                  {/* Carte du stagiaire */}
                  <div
                    className={`w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 ${
                      i === 1
                        ? "border-wizi-accent"
                        : i === 0
                        ? "border-gray-300"
                        : "border-orange-400"
                    } overflow-hidden`}>
                    <div className="p-4">
                      {/* Avatar et nom */}
                      <div className="flex flex-col items-center text-center mb-3">
                        <div className="relative">
                          <Avatar className="h-16 w-16 border-2 border-white shadow-lg">
                            <AvatarImage
                              src={`${
                                import.meta.env.VITE_API_URL_MEDIA ?? ""
                              }${"/" + entry.image}`}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                              {entry.name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          {isCurrentUser && (
                            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
                              <User className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                        <h3
                          className={`mt-2 font-bold ${
                            isCurrentUser
                              ? "text-green-600"
                              : "text-gray-800 dark:text-white"
                          }`}>
                          {entry.firstname || ""}{" "}
                          {entry.name.toUpperCase() || ""}
                        </h3>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-4 w-4 text-wizi-accent" />
                          <span className="font-bold text-orange-600">
                            {entry.score} pts
                          </span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {entry.quizCount}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">
                            Quiz
                          </div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {entry.averageScore?.toFixed(1)} pts/quiz
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">
                            Moyenne
                          </div>
                        </div>
                      </div>

                      {/* Formateurs */}
                      <FormateursPodium entry={entry} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reste du classement */}
      <div className="p-4">
        {listRanking.length > 0 && (
          <>
            <div className="flex items-center gap-2 mb-4">
              <LayoutList className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Classement complet
              </h3>
              <Badge variant="secondary" className="ml-2">
                {listRanking.length} stagiaires
              </Badge>
            </div>

            {/* Mobile View - simplified */}
            <div className="sm:hidden space-y-2">
              {listRanking.slice(0, 10).map((entry, index) => {
                const isCurrentUser = entry.id?.toString() === currentUserId;
                const globalIndex = showPodium ? index + 4 : index + 1; // Après le podium

                return (
                  <div
                    key={entry.id || index}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      isCurrentUser
                        ? "border-green-300 bg-green-50 dark:bg-green-900/10"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    }`}>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
                        {globalIndex}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {entry.firstname || ""} {entry.name || ""}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {entry.quizCount} quiz
                          {/* • {entry.averageScore?.toFixed(1)} avg */}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-orange-600">
                      {entry.score} pts
                    </div>
                  </div>
                );
              })}
              {listRanking.length > 10 && (
                <div className="text-center text-xs text-gray-500">
                  Afficher les {listRanking.length - 10} suivants...
                </div>
              )}
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block">
              <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Rang
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Stagiaire
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Formateur
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Quiz
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Points
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {listRanking.map((entry, index) => {
                      const isCurrentUser =
                        entry.id?.toString() === currentUserId;
                      const globalIndex = showPodium ? index + 4 : index + 1;

                      return (
                        <tr
                          key={entry.id || index}
                          className={
                            isCurrentUser
                              ? "bg-green-50 dark:bg-green-900/20"
                              : "hover:bg-gray-50 dark:hover:bg-gray-800"
                          }>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                              {globalIndex}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                <AvatarImage
                                  src={`${
                                    import.meta.env.VITE_API_URL_MEDIA ?? ""
                                  }${"/" + entry.image}`}
                                />
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                  {entry.name?.charAt(0) || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900 dark:text-white">
                                  {entry.firstname || ""}{" "}
                                  {entry.name.toLocaleUpperCase() || ""}
                                </span>
                                {isCurrentUser && (
                                  <Badge
                                    variant="default"
                                    className="bg-green-500">
                                    Vous
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {entry.formateurs && entry.formateurs.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {entry.formateurs.map((formateur: any) => (
                                  <Badge
                                    key={formateur.id}
                                    variant="secondary"
                                    className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                                    {formateur.prenom}{" "}
                                    {formateur.nom.toUpperCase()}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-400 dark:text-gray-500 text-sm">
                                Aucun formateur
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                            <div className="text-center">
                              <div className="font-semibold">
                                {entry.quizCount}
                              </div>
                              <div className="text-xs text-gray-500">
                                complétés
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-wizi-accent" />
                              <span className="font-bold text-orange-600 dark:text-orange-400">
                                {entry.score}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                pts
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
