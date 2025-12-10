import { useState, useMemo, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Trophy,
  LayoutList,
  Search,
  Star,
  Crown,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LeaderboardEntry } from "@/types/quiz";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PodiumDisplay } from "./PodiumDisplay";
import { RankingListItem } from "./RankingListItem";
import { FormateursTable } from "./FormateursTable";
import { StagiaireDetailsModal } from "./StagiaireDetailsModal";

export interface GlobalRankingProps {
  ranking?: LeaderboardEntry[];
  loading?: boolean;
  currentUserId?: string;
  period?: 'week' | 'month' | 'all';
  onPeriodChange?: (period: 'week' | 'month' | 'all') => void;
}

type SortKey =
  | "rang"
  | "name"
  | "quizCount"
  | "averageScore"
  | "score"
  | "formation"
  | "formateur";
type SortOrder = "asc" | "desc";

export function GlobalRanking({
  ranking = [],
  loading = false,
  currentUserId,
  period = 'all',
  onPeriodChange,
}: GlobalRankingProps) {
  const [sortKey, setSortKey] = useState<SortKey>("rang");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [search, setSearch] = useState("");
  const [showPodium, setShowPodium] = useState(true);
  const [formationFilter, setFormationFilter] = useState<string>("");
  const [formateurFilter, setFormateurFilter] = useState<string>("");
  const [selectedStagiaire, setSelectedStagiaire] = useState<LeaderboardEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Harmoniser avec filtres chronologiques : reset des filtres quand la période change
    setSearch("");
    setFormationFilter("");
    setFormateurFilter("");
  }, [period]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const formatName = (prenom: string, nom: string): string => {
    if (!prenom && !nom) return "";
    const initial = nom?.trim()?.charAt(0);
    const suffix = initial ? ` ${initial.toUpperCase()}.` : "";
    return `${prenom || ""}${suffix}`.trim();
  };

  const getRankBadgeColor = (rang: number): string => {
    switch (rang) {
      case 1: return 'bg-gradient-to-br from-yellow-400 to-yellow-600';
      case 2: return 'bg-gradient-to-br from-gray-300 to-gray-400';
      case 3: return 'bg-gradient-to-br from-orange-400 to-orange-600';
      case 4: return 'bg-gradient-to-br from-gray-400 to-gray-500';
      case 5: return 'bg-gradient-to-br from-blue-400 to-blue-600';
      default: return 'bg-gradient-to-br from-gray-200 to-gray-300';
    }
  };

  const getRankBadgeText = (rang: number): string => {
    return rang.toString();
  };

  const formationOptions = useMemo(() => {
    const options = new Map<string, string>();
    ranking.forEach((entry) => {
      entry.formateurs?.forEach((formateur) => {
        formateur.formations?.forEach((formation) => {
          const id = formation.id?.toString();
          if (id && !options.has(id)) {
            options.set(id, formation.titre || `Formation ${id}`);
          }
        });
      });
    });
    return Array.from(options.entries()).map(([id, label]) => ({ id, label }));
  }, [ranking]);

  const formateurOptions = useMemo(() => {
    const options = new Map<string, string>();
    ranking.forEach((entry) => {
      entry.formateurs?.forEach((formateur) => {
        const id = formateur.id?.toString();
        if (id && !options.has(id)) {
          options.set(id, formatName(formateur.prenom, formateur.nom));
        }
      });
    });
    return Array.from(options.entries()).map(([id, label]) => ({ id, label }));
  }, [ranking]);

  const filteredRanking = useMemo(() => {
    const needle = search.toLowerCase();
    return ranking.filter((entry: LeaderboardEntry) => {
      const matchesSearch =
        (entry.name?.toLowerCase().includes(needle) ||
          entry.firstname?.toLowerCase().includes(needle)) ?? false;

      const matchesFormation =
        !formationFilter ||
        entry.formateurs?.some((formateur) =>
          formateur.formations?.some(
            (formation) => formation.id?.toString() === formationFilter
          )
        );

      const matchesFormateur =
        !formateurFilter ||
        entry.formateurs?.some(
          (formateur) => formateur.id?.toString() === formateurFilter
        );

      return matchesSearch && matchesFormation && matchesFormateur;
    });
  }, [ranking, search, formationFilter, formateurFilter]);

  const sortedRanking = useMemo(() => {
    const getSortValue = (entry: LeaderboardEntry) => {
      switch (sortKey) {
        case "name":
          return formatName(entry.firstname, entry.name).toLowerCase();
        case "formation":
          return (
            entry.formateurs?.flatMap((f) => f.formations || [])[0]?.titre ||
            ""
          ).toLowerCase();
        case "formateur":
          return (
            entry.formateurs?.[0]
              ? formatName(
                entry.formateurs[0].prenom,
                entry.formateurs[0].nom
              ).toLowerCase()
              : ""
          );
        default:
          return (entry as any)[sortKey];
      }
    };

    return [...filteredRanking].sort((a: any, b: any) => {
      const aValue = getSortValue(a);
      const bValue = getSortValue(b);

      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;

      const rankA = a.rang ?? Number.POSITIVE_INFINITY;
      const rankB = b.rang ?? Number.POSITIVE_INFINITY;
      return rankA - rankB;
    });
  }, [filteredRanking, sortKey, sortOrder]);

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

  // Liste sans les 3 premiers (si podium affiché)
  const listRanking = showPodium ? sortedRanking.slice(3) : sortedRanking;

  return (
    <div
      className="mb-4 bg-white dark:bg-gray-900 rounded-lg ring-1 ring-gray-50 dark:ring-gray-800 overflow-hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      {/* Header */}
      <div className="p-4 sm:p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <Trophy className="h-6 w-6 text-yellow-500" />
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

            <div className="flex items-center space-x-2">
              <Switch
                id="podium-switch"
                checked={showPodium}
                onCheckedChange={setShowPodium}
              />
              <Label htmlFor="podium-switch">Afficher le podium</Label>
            </div>
          </div>

          {/* Filtres compacts - Ligne 1 : Période + Recherche */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Filtres temporels */}
            {onPeriodChange && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onPeriodChange('week')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition ${period === 'week'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                    }`}>
                  Semaine
                </button>
                <button
                  onClick={() => onPeriodChange('month')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition ${period === 'month'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                    }`}>
                  Mois
                </button>
                <button
                  onClick={() => onPeriodChange('all')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition ${period === 'all'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                    }`}>
                  Tout
                </button>
              </div>
            )}

            {/* Recherche */}
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 w-full text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* Ligne 2 : Formation + Formateur + Tri */}
          <div className="flex flex-wrap gap-2 items-center">
            <select
              value={formationFilter}
              onChange={(e) => setFormationFilter(e.target.value)}
              className="px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            >
              <option value="">Toutes formations</option>
              {formationOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>

            <select
              value={formateurFilter}
              onChange={(e) => setFormateurFilter(e.target.value)}
              className="px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            >
              <option value="">Tous formateurs</option>
              {formateurOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>

            <div className="hidden sm:block w-px h-5 bg-gray-300 dark:bg-gray-600"></div>

            {/* <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            >
              <option value="rang">Rang</option>
              <option value="score">Points</option>
              <option value="quizCount">Quiz</option>
              <option value="name">Nom</option>
            </select> */}

            {/* <button
              type="button"
              onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              title={sortOrder === "asc" ? "Croissant" : "Décroissant"}
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button> */}

            {(search || formationFilter || formateurFilter || sortKey !== 'rang') && (
              <>
                <div className="hidden sm:block w-px h-5 bg-gray-300 dark:bg-gray-600"></div>
                <button
                  onClick={() => {
                    setSearch('');
                    setFormationFilter('');
                    setFormateurFilter('');
                    setSortKey('rang');
                    setSortOrder('asc');
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Réinit.
                </button>
              </>
            )}
          </div>

        </div>
      </div>

      {/* Podium */}
      {showPodium && podium.length > 0 && (
        <div className="px-4 pt-6 pb-4">
          <PodiumDisplay
            rankings={podium}
            currentUserId={currentUserId}
            onStagiaireClick={(stagiaire) => {
              setSelectedStagiaire(stagiaire);
              setIsModalOpen(true);
            }}
          />
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

            {/* Mobile View - simplified with RankingListItem */}
            <div className="sm:hidden space-y-2">
              {listRanking.slice(0, 10).map((entry, index) => {
                const isCurrentUser = entry.id?.toString() === currentUserId;

                return (
                  <RankingListItem
                    key={entry.id || index}
                    ranking={entry}
                    isCurrentUser={isCurrentUser}
                    isSmallScreen={true}
                    onClick={() => {
                      setSelectedStagiaire(entry);
                      setIsModalOpen(true);
                    }}
                  />
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
                          onClick={() => {
                            setSelectedStagiaire(entry);
                            setIsModalOpen(true);
                          }}
                          className={`cursor-pointer ${isCurrentUser
                            ? "bg-green-50 dark:bg-green-900/20"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`flex items-center justify-center h-12 w-12 rounded-full ${getRankBadgeColor(entry.rang)} text-white font-bold shadow-lg text-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl`}>
                              {getRankBadgeText(entry.rang || globalIndex)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                <AvatarImage
                                  src={`${import.meta.env.VITE_API_URL_MEDIA ?? ""
                                    }${"/" + entry.image}`}
                                />
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                  {entry.name?.charAt(0) || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900 dark:text-white">
                                  {formatName(
                                    entry.firstname || "",
                                    entry.name || ""
                                  )}
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
                            <FormateursTable
                              formateurs={entry.formateurs || []}
                            />
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
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="font-bold text-yellow-600 dark:text-yellow-500 text-lg">
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

      {/* Modal détails stagiaire */}
      <StagiaireDetailsModal
        stagiaire={selectedStagiaire}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
