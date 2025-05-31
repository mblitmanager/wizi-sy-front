import { stripHtmlTags } from "@/utils/UtilsFunction";
import { Badge } from "@mui/material";
import { BookAIcon } from "lucide-react";
import React from "react";
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
  Langues: "bg-[#A55E6E] text-white border-2 border-[#A55E6E]",
  Internet: "bg-[#FFC533] text-black",
  Création: "bg-[#9392BE] text-white",
  default: "bg-gray-100 text-gray-800",
};

const FormationCatalogue: React.FC<FormationCatalogueProps> = ({
  formations,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      {/* <h2 className="text-xl font-semibold font-montserrat mb-4">
        Catalogue des formations
      </h2> */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {formations && formations.length > 0 ? (
          formations.map((formation) => {
            const categoryColor =
              CATEGORY_COLORS[formation?.categorie || "default"];
            return (
              // <Link
              //   to={`/catalogue_formation/${formation?.id || ""}`}
              //   key={formation?.id || Math.random().toString()}
              //   className={`border rounded-lg p-4 hover:bg-gray-50 transition-colors border-t-4 ${categoryColor}`}>
              //   <Badge color="secondary">
              //     {formation?.categorie || "Sans catégorie"}
              //   </Badge>
              //   <h3 className="font-medium font-nunito">
              //     {formation?.titre || "Sans titre"}
              //   </h3>
              //   <p className="text-sm text-muted-foreground mt-1">
              //     {stripHtmlTags(
              //       formation?.description || "Pas de description"
              //     )}
              //   </p>
              // </Link>
              <div
                className="relative cursor-pointer dark:text-white"
                key={formation?.id || Math.random().toString()}>
                <span
                  className={`absolute top-0 left-0 w-full h-full mt-1 ml-1 ${categoryColor} rounded-lg dark:bg-gray-200}`}></span>
                <div
                  className={`relative p-6 bg-white dark:bg-gray-800 border-2 border-${categoryColor} dark:border-gray-300 rounded-lg hover:scale-105 transition duration-500`}>
                  <div className="flex items-center">
                    <span className="text-xl">
                      <BookAIcon className="w-6 h-6 text-primary" />{" "}
                    </span>
                    <h3 className="my-2 ml-3 text-lg font-bold text-gray-800 dark:text-white">
                      {(formation?.titre || "Sans titre")
                        .toLowerCase()
                        .replace(/\b\w/g, (char) => char.toUpperCase())}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {stripHtmlTags(
                      formation?.description || "Pas de description"
                    )}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            Aucune formation disponible
          </div>
        )}
      </div>
    </div>
  );
};

export default FormationCatalogue;
