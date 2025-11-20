import { stripHtmlTags } from "@/utils/UtilsFunction";
import { Badge } from "@mui/material";
import { BookAIcon, FolderOpenIcon, Clock, User } from "lucide-react";
import React, { useState } from "react";

type FormationItem = {
  id?: string | number;
  formation?: {
    titre?: string;
    categorie?: string;
    description?: string;
    image?: string | null;
    duree?: string;
  } | null;
  catalogue?: {
    titre?: string;
    categorie?: string;
    description?: string;
    image_url?: string | null;
    duree?: string;
  } | null;
  titre?: string;
  categorie?: string;
  description?: string;
  image?: string | null;
  duree?: string;
  formateur?: {
    image?: string | null;
    nom?: string | null;
    prenom?: string | null;
    email?: string | null;
  } | null;
};

interface FormationCatalogueProps {
  formations: FormationItem[];
  isLoading?: boolean;
}

const CATEGORY_COLORS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  Bureautique: {
    bg: "bg-[#3D9BE9]",
    text: "text-white",
    border: "border-[#3D9BE9]",
  },
  Langues: {
    bg: "bg-[#A55E6E]",
    text: "text-white",
    border: "border-[#A55E6E]",
  },
  Internet: {
    bg: "bg-[#FFC533]",
    text: "text-gray-900",
    border: "border-[#FFC533]",
  },
  Création: {
    bg: "bg-[#9392BE]",
    text: "text-white",
    border: "border-[#9392BE]",
  },
  IA: {
    bg: "bg-[#ABDA96]",
    text: "text-gray-900",
    border: "border-[#ABDA96]",
  },
  default: {
    bg: "bg-gray-100",
    text: "text-gray-800",
    border: "border-gray-200",
  },
};

// Composant Skeleton pour le chargement
const FormationCardSkeleton: React.FC = () => {
  return (
    <div className="group cursor-pointer transition-all duration-300">
      <div className="relative p-6 bg-white dark:bg-gray-800 border-l-4 border-gray-300 dark:border-gray-600 rounded-r-lg h-full flex flex-col shadow-sm">
        {/* En-tête avec badge et icône */}
        <div className="flex justify-between items-start mb-4">
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>

        {/* Titre */}
        <div className="space-y-2 mb-3">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
        </div>

        {/* Durée */}
        <div className="flex items-center mb-3">
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded mr-2 animate-pulse"></div>
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>

        {/* Formateur */}
        <div className="flex items-center mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="h-6 w-6 bg-gray-200 dark:bg-gray-600 rounded-full mr-2 animate-pulse"></div>
          <div className="space-y-1 flex-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-24"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-32"></div>
          </div>
        </div>

        {/* Description */}
        <div className="flex-grow mb-4 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
        </div>

        {/* Bouton */}
        <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
      </div>
    </div>
  );
};

const FormationCatalogue: React.FC<FormationCatalogueProps> = ({
  formations,
  isLoading = false,
}) => {
  const [expanded, setExpanded] = useState<string | number | null>(null);
  const [showAll, setShowAll] = useState<boolean>(false);

  const uniqueFormations = React.useMemo(() => {
    if (!Array.isArray(formations)) return [];
    return Array.from(new Map(formations.map((f) => [f.id, f])).values());
  }, [formations]);

  const visibleFormations = showAll
    ? uniqueFormations
    : uniqueFormations.slice(0, 3);

  const hasFormations = uniqueFormations.length > 0;

  // 🔄 Affichage du skeleton pendant le chargement
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {/* Affiche 3 cartes de skeleton pendant le chargement */}
          {[...Array(3)].map((_, index) => (
            <FormationCardSkeleton key={index} />
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <div className="h-9 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {hasFormations ? (
          visibleFormations.map((formation, index) => {
            const titre =
              formation.catalogue?.titre ||
              formation.formation?.titre ||
              formation.titre ||
              "Sans titre";
            const categorie =
              formation.catalogue?.categorie ||
              formation.formation?.categorie ||
              formation.categorie ||
              "default";
            const description =
              formation.catalogue?.description ||
              formation.formation?.description ||
              formation.description ||
              "";
            const duree =
              formation.catalogue?.duree ||
              formation.formation?.duree ||
              formation.duree ||
              "";
            const formateur = formation.formateur || null;

            const categoryStyle =
              CATEGORY_COLORS[categorie] || CATEGORY_COLORS["default"];
            const desc = stripHtmlTags(description);
            const isExpanded = expanded === formation.id;
            const shouldShowMore = desc.length > 100;

            return (
              <div
                key={formation.id || index}
                className="group cursor-pointer transition-all duration-300 hover:shadow-lg">
                <div
                  className={`relative p-6 bg-white dark:bg-gray-800 border-l-4 rounded-r-lg h-full flex flex-col shadow-sm hover:shadow-md ${categoryStyle.border}`}>
                  <div className="flex justify-between items-start mb-4">
                    <Badge
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryStyle.bg} ${categoryStyle.text} border ${categoryStyle.border}`}>
                      {categorie}
                    </Badge>
                    <div
                      className={`p-2 rounded-lg ${categoryStyle.bg} ${categoryStyle.text}`}>
                      <BookAIcon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 leading-tight">
                    {titre}
                  </h3>

                  {duree && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{duree}</span>
                    </div>
                  )}

                  {formateur && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <User className="w-4 h-4 mr-2" />
                      {formateur.image && (
                        <img
                          src={formateur.image}
                          alt={formateur.nom || "Formateur"}
                          className="w-6 h-6 rounded-full object-cover border border-gray-300 mr-2"
                        />
                      )}
                      <div>
                        <span className="font-medium">
                          {formateur.prenom} {formateur.nom?.toUpperCase()}
                        </span>
                        {formateur.email && (
                          <div className="text-xs text-gray-500 truncate">
                            {formateur.email}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex-grow mb-4">
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {isExpanded
                        ? desc
                        : desc.length > 100
                        ? desc.slice(0, 100) + "..."
                        : desc}
                    </p>
                  </div>

                  {shouldShowMore && (
                    <button
                      type="button"
                      className="mt-auto w-full py-2 px-4 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpanded(isExpanded ? null : formation.id);
                      }}>
                      {isExpanded ? "Réduire" : "Lire la suite"}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <FolderOpenIcon className="mx-auto h-16 w-16" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Aucune formation disponible
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Essayez de modifier vos critères de recherche ou contactez-nous
              pour plus d'informations.
            </p>
          </div>
        )}
      </div>

      {hasFormations && uniqueFormations.length > 3 && (
        <div className="flex justify-center mt-8">
          <button
            type="button"
            className="px-6 py-3 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            onClick={() => setShowAll((v) => !v)}>
            {showAll
              ? "Voir moins de formations"
              : `Voir toutes les formations (${uniqueFormations.length})`}
          </button>
        </div>
      )}
    </div>
  );
};

export default FormationCatalogue;
