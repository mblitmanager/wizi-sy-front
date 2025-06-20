import { stripHtmlTags } from "@/utils/UtilsFunction";
import { Badge } from "@mui/material";
import { BookAIcon, FolderOpenIcon } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

interface FormationCatalogueProps {
  formations: any[];
}
// Color map for categories
const CATEGORY_COLORS: Record<string, string> = {
  Math: "bg-blue-100 text-blue-800",
  Science: "bg-green-100 text-green-800",
  History: "bg-yellow-100 text-yellow-800",
  Bureautique: "bg-[#3D9BE9] text-white",
  Langues: "bg-[#A55E6E] text-white border-[#A55E6E]",
  Internet: "bg-[#FFC533] text-black",
  Création: "bg-[#9392BE] text-white",
  default: "bg-gray-100 text-gray-800",
};

const FormationCatalogue: React.FC<FormationCatalogueProps> = ({
  formations,
}) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  // Fonction pour formater le titre (supprimer "formation" sous toutes ses formes)
  const formatTitle = (title: string) => {
    if (!title) return "Sans titre";
    return title
      .replace(/formations?/gi, "")
      .trim()
      .replace(/\s{2,}/g, " ") // Supprime les espaces multiples
      .replace(/^\w/, (c) => c.toUpperCase()); // Première lettre en majuscule
  };

  // Fonction pour tronquer le texte
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "Pas de description";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {formations && formations.length > 0 ? (
          formations.map((formation) => {
            const categoryColor =
              CATEGORY_COLORS[formation?.categorie || "default"];
            const desc = stripHtmlTags(
              formation?.description || "Pas de description"
            );
            const isExpanded = expanded === formation.id;
            const shouldShowMore = desc.length > 50;

            return (
              <div
                className="relative group cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
                key={formation?.id || Math.random().toString()}
              >
                <span
                  className={`absolute top-0 left-0 w-full h-full mt-1.5 ml-1.5 ${categoryColor} rounded-lg dark:bg-gray-700 transition-all duration-300 group-hover:mt-1 group-hover:ml-1`}
                ></span>
                <div
                  className={`relative p-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg h-full flex flex-col`}
                >
                  <div className="flex items-start mb-4">
                    <div className={`p-2 rounded-lg ${categoryColor} mr-3`}>
                      <BookAIcon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white line-clamp-2">
                      {formatTitle(formation?.titre || "Sans titre")}
                    </h3>
                  </div>

                  <div className="flex-grow">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {isExpanded ? desc : truncateText(desc, 50)}
                    </p>
                  </div>

                  {shouldShowMore && (
                    <button
                      className="mt-auto w-full py-2 px-4 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpanded(isExpanded ? null : formation.id);
                      }}
                      type="button"
                    >
                      {isExpanded ? "Réduire" : "Lire la suite"}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              <FolderOpenIcon className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Aucune formation disponible
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default FormationCatalogue;
