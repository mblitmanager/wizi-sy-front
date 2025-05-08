import { useState, useMemo } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, Award, User } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LeaderboardEntry } from "@/types/quiz";

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

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const filteredRanking = useMemo(() => {
    return ranking.filter((entry: any) =>
      entry.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [ranking, search]);

  const sortedRanking = useMemo(() => {
    return [...filteredRanking].sort((a: any, b: any) => {
      let aValue = a[sortKey];
      let bValue = b[sortKey];
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

  // Calcul des totaux à partir du classement global
  const totalPoints = sortedRanking.reduce((sum, entry) => sum + (entry.score || 0), 0);
  const totalQuizzes = sortedRanking.reduce((sum, entry) => sum + (entry.quizCount || 0), 0);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chargement du classement...</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-md bg-gray-100 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div className="flex-1">
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>
                <div className="h-5 w-10 bg-gray-200 rounded" />
              </div>
            ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-lg">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Classement global
        </h2>
        <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-700">
          <span className="font-semibold">Total points : </span>
          <span>{totalPoints}</span>
          <span className="font-semibold ml-6">Total quiz joués : </span>
          <span>{totalQuizzes}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Empty State */}
        {sortedRanking.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500">Aucun classement disponible</p>
          </div>
        ) : (
          <div className="space-y-3 sm:hidden">
            {/* Mobile List View */}
            {sortedRanking.map((entry, index) => {
              const isCurrentUser = entry.id?.toString() === currentUserId;
              return (
                <div
                  key={entry.id || index}
                  className={`p-3 rounded-lg shadow-sm border ${
                    isCurrentUser
                      ? "bg-blue-100 border-blue-200"
                      : "bg-white border-gray-200"
                  }`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">
                        {entry.rang || index + 1}.
                      </span>
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage
                          src={entry.image}
                          alt={entry.name || "User"}
                        />
                        <AvatarFallback>
                          {entry.name
                            ? entry.name.substring(0, 2).toUpperCase()
                            : "UN"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium">
                            {entry.name || "Unknown"}
                          </span>
                          {isCurrentUser && (
                            <User className="h-3 w-3 ml-1 text-blue-500" />
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {entry.quizCount} quiz •{" "}
                          {Math.round(entry.averageScore)}%
                        </div>
                      </div>
                    </div>
                    <div className="font-semibold text-primary">
                      {entry.score} pts
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Desktop Table (hidden on mobile) */}
        <div className="hidden sm:block">
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-gradient-to-r from-blue-100 to-blue-50">
                  <th
                    className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer"
                    onClick={() => handleSort("rang")}>
                    Rang{" "}
                    {sortKey === "rang" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th
                    className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer"
                    onClick={() => handleSort("name")}>
                    Stagiaire{" "}
                    {sortKey === "name" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th
                    className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer"
                    onClick={() => handleSort("quizCount")}>
                    Quiz{" "}
                    {sortKey === "quizCount" &&
                      (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th
                    className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer"
                    onClick={() => handleSort("averageScore")}>
                    Score moyen{" "}
                    {sortKey === "averageScore" &&
                      (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th
                    className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer"
                    onClick={() => handleSort("score")}>
                    Points{" "}
                    {sortKey === "score" && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedRanking.map((entry, index) => {
                  const isCurrentUser = entry.id?.toString() === currentUserId;
                  return (
                    <tr
                      key={entry.id || index}
                      className={`hover:bg-blue-50 transition-colors duration-300 ${
                        isCurrentUser ? "bg-blue-100" : "bg-white"
                      } ${index < 3 ? "font-semibold" : ""}`}>
                      <td className="px-4 py-3">
                        {index < 3 ? (
                          <Trophy
                            className={`inline h-5 w-5 mr-2 align-middle ${
                              index === 0
                                ? "text-yellow-500"
                                : index === 1
                                ? "text-gray-400"
                                : "text-amber-700"
                            }`}
                          />
                        ) : null}
                        {entry.rang || index + 1}
                      </td>
                      <td className="px-4 py-3 flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={entry.image}
                            alt={entry.name || "User"}
                          />
                          <AvatarFallback>
                            {entry.name
                              ? entry.name.substring(0, 2).toUpperCase()
                              : "UN"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center">
                          <span className="text-gray-700 font-medium">
                            {entry.name || "Unknown"}
                          </span>
                          {isCurrentUser && (
                            <User className="h-4 w-4 ml-2 text-blue-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {entry.quizCount}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {Math.round(entry.averageScore)}%
                      </td>
                      <td className="px-4 py-3 text-primary font-semibold">
                        {entry.score}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
