import { useState, useMemo } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, Award, User, ArrowUpDown, ArrowUp, ArrowDown, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LeaderboardEntry } from "@/types/quiz";
import React from "react";

export interface GlobalRankingProps {
  ranking?: LeaderboardEntry[];
  loading?: boolean;
  currentUserId?: string;
  onRefresh?: () => void;
}

type SortKey = "rang" | "name" | "quizCount" | "averageScore" | "score";
type SortOrder = "asc" | "desc";

export function GlobalRanking({
  ranking = [],
  loading = false,
  currentUserId,
  onRefresh
}: GlobalRankingProps) {
  const [sortKey, setSortKey] = useState<SortKey>("rang");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

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

  // Calculate totals from the ranking
  const totalPoints = sortedRanking.reduce((sum, entry) => sum + (entry.score || 0), 0);
  const totalQuizzes = sortedRanking.reduce((sum, entry) => sum + (entry.quizCount || 0), 0);

  const handleRowClick = (userId: string) => {
    if (selectedUserId === userId) {
      setSelectedUserId(null); // Deselect if already selected
    } else {
      setSelectedUserId(userId); // Select the user
    }
  };

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) return <ArrowUpDown className="h-4 w-4 ml-1 inline" />;
    return sortOrder === "asc" ? 
      <ArrowUp className="h-4 w-4 ml-1 inline text-blue-500" /> : 
      <ArrowDown className="h-4 w-4 ml-1 inline text-blue-500" />;
  };

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
        {/* Search and Actions */}
        <div className="mb-4 flex flex-wrap gap-2 justify-between items-center">
          {/* Search Box */}
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 flex-1 focus:ring focus:ring-blue-200"
          />
          
          {/* Refresh Button */}
          {onRefresh && (
            <Button 
              variant="outline" 
              onClick={onRefresh}
              className="flex items-center gap-1"
              size="sm"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Actualiser</span>
            </Button>
          )}
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
              const isSelected = entry.id?.toString() === selectedUserId;
              return (
                <div
                  key={entry.id || index}
                  className={`p-3 rounded-lg shadow-sm border transition-all duration-200 cursor-pointer ${
                    isCurrentUser
                      ? "bg-blue-100 border-blue-200"
                      : isSelected
                      ? "bg-blue-50 border-blue-100"
                      : "bg-white border-gray-200"
                  }`}
                  onClick={() => handleRowClick(entry.id?.toString() || "")}
                >
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
                  
                  {/* Details section that shows when selected */}
                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-gray-100 text-sm space-y-1">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-gray-500">Rang:</div>
                        <div className="font-medium">{entry.rang || index + 1}</div>
                        
                        <div className="text-gray-500">Points:</div>
                        <div className="font-medium">{entry.score} pts</div>
                        
                        <div className="text-gray-500">Quiz complétés:</div>
                        <div className="font-medium">{entry.quizCount}</div>
                        
                        <div className="text-gray-500">Score moyen:</div>
                        <div className="font-medium">{Math.round(entry.averageScore)}%</div>
                      </div>
                    </div>
                  )}
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
                    className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => handleSort("rang")}
                  >
                    Rang {getSortIcon("rang")}
                  </th>
                  <th
                    className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => handleSort("name")}
                  >
                    Stagiaire {getSortIcon("name")}
                  </th>
                  <th
                    className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => handleSort("quizCount")}
                  >
                    Quiz {getSortIcon("quizCount")}
                  </th>
                  <th
                    className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => handleSort("averageScore")}
                  >
                    Score moyen {getSortIcon("averageScore")}
                  </th>
                  <th
                    className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => handleSort("score")}
                  >
                    Points {getSortIcon("score")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedRanking.map((entry, index) => {
                  const isCurrentUser = entry.id?.toString() === currentUserId;
                  const isSelected = entry.id?.toString() === selectedUserId;
                  return (
                    <React.Fragment key={entry.id || index}>
                      <tr
                        className={`hover:bg-blue-50 transition-colors duration-300 cursor-pointer ${
                          isCurrentUser ? "bg-blue-100" : 
                          isSelected ? "bg-blue-50" : "bg-white"
                        } ${index < 3 ? "font-semibold" : ""}`}
                        onClick={() => handleRowClick(entry.id?.toString() || "")}
                      >
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
                      
                      {/* Detail row that expands when clicked */}
                      {isSelected && (
                        <tr className="bg-blue-50 border-t border-b border-blue-100">
                          <td colSpan={5} className="px-6 py-3">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">Classement</p>
                                <p className="font-semibold">{entry.rang || index + 1}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Score total</p>
                                <p className="font-semibold">{entry.score} points</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Quiz complétés</p>
                                <p className="font-semibold">{entry.quizCount}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Score moyen</p>
                                <p className="font-semibold">{Math.round(entry.averageScore)}%</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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
