import { Formation } from "@/types/stagiaire";
import mp3 from "../../assets/mp3.png";
import mp4 from "../../assets/mp4.png";
import { Link, useNavigate } from "react-router-dom";
import { CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowRight, Clock } from "lucide-react";
import {
  CATEGORIES,
  FORMATIONMETADATA,
  VOIR_LES_DETAILS,
} from "@/utils/constants";
import nomedia from "../../assets/nomedia.png";
import DOMPurify from "dompurify";
import { FormationCardData } from "@/types/Formation";
import { useState } from "react";

const stripHtml = (html: string) => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

const VITE_API_URL_IMG = import.meta.env.VITE_API_URL_MEDIA;

const FormationCard = ({ formation }: { formation: FormationCardData }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const categoryColors: Record<CATEGORIES, string> = {
    [CATEGORIES.BUREAUTIQUE]: "border-[#3D9BE9]",
    [CATEGORIES.LANGUES]: "border-[#A55E6E]",
    [CATEGORIES.INTERNET]: "border-[#FFC533]",
    [CATEGORIES.CREATION]: "border-[#9392BE]",
    [CATEGORIES.IA]: "border-[#ABDA96]",
  };

  const getCategorySuffix = (category: string) => {
    switch (category) {
      case CATEGORIES.BUREAUTIQUE:
        return "bureautique";
      case CATEGORIES.LANGUES:
        return "langues";
      case CATEGORIES.INTERNET:
        return "internet";
      case CATEGORIES.CREATION:
        return "creation";
      case CATEGORIES.IA:
        return "ia";
      default:
        return "default";
    }
  };

  const getImageSource = () => {
    const url = formation.image_url?.toLowerCase() || "";

    if (url.endsWith(".mp4")) return mp4;
    if (url.endsWith(".mp3")) return mp3;
    if (formation.image_url)
      return `${VITE_API_URL_IMG}/${formation.image_url}`;
    return nomedia;
  };

  const image = getImageSource();

  const getCategoryFromFormation = (f: unknown): string => {
    if (!f || typeof f !== "object") return "";
    const obj = f as Record<string, unknown>;
    const formationField = obj["formation"] as
      | Record<string, unknown>
      | undefined;
    if (formationField && typeof formationField["categorie"] === "string")
      return formationField["categorie"] as string;
    const nested =
      formationField &&
      (formationField["formation"] as Record<string, unknown> | undefined);
    if (nested && typeof nested["categorie"] === "string")
      return nested["categorie"] as string;
    if (typeof obj["categorie"] === "string") return obj["categorie"] as string;
    return "";
  };

  const categoryString: string = getCategoryFromFormation(formation);
  const suffix = getCategorySuffix(categoryString);
  const categoryBorderClass =
    categoryColors[categoryString as CATEGORIES] || "border-gray-200";
  const categoryBadgeClass =
    suffix !== "default" ? `badge-${suffix}` : "bg-gray-200/20 text-gray-600";

  return (
    <Link
      to={`/catalogue-formation/${formation.id}`}
      className={`group p-4 border-t-4 rounded-lg  ${categoryBorderClass} shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full overflow-hidden hover:translate-y-[-2px]`}>
      {/* Image container - CORRIGÉ */}
      <div className="flex flex-col items-center justify-center mb-3 gap-3">
        {/* Cercle parfait pour l'image */}
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 shadow-md flex-shrink-0">
          {imageError ? (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-full">
              <span className="text-gray-400 text-xs">Image</span>
            </div>
          ) : (
            <img
              src={image}
              alt={formation.titre}
              className="w-full h-full object-cover object-center"
              loading="lazy"
              onError={() => setImageError(true)}
              style={{
                objectFit: "cover",
                objectPosition: "center",
                width: "100%",
                height: "100%",
                display: "block",
              }}
            />
          )}
        </div>

        <h3 className="text-base font-semibold text-orange-600 line-clamp-2 leading-snug text-center">
          {formation.titre}
        </h3>
      </div>

      {/* Content container */}
      <div className="flex flex-col flex-grow space-y-2">
        {/* Category badge */}
        <div className="flex justify-between items-start">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${categoryBadgeClass}`}>
            {categoryString}
          </span>

          {/* Certification badge */}
          {/* {formation.certification && (
            <span className="text-l font-medium px-2 py-1 rounded-full bg-orange-50 text-orange-500">
              {formation.certification}
            </span>
          )} */}
        </div>

        {/* Description */}
        <div
          className="text-sm text-gray-600 line-clamp-2 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(formation.description || ""),
          }}
        />

        {/* Metadata */}
        <div className="mt-auto pt-2">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="w-3 h-3" />
              <span>{formation.duree}h</span>
            </div>

            {/* <span
              className={
                suffix !== "default"
                  ? `inline-block text-xl font-extrabold drop-shadow-lg px-2 py-0.5 rounded price-badge-${suffix}`
                  : "text-xl text-orange-500 font-extrabold drop-shadow-lg"
              }>
              {Number(formation.tarif) > 0
                ? `${Math.round(Number(formation.tarif)).toLocaleString(
                    "fr-FR"
                  )} €`
                : "À la demande"}
            </span> */}
          </div>
        </div>
      </div>

      {/* Button */}
      <CardFooter className="p-0 pt-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button
          className={`w-full h-8 text-xs flex items-center justify-center gap-1 ${
            suffix !== "default" ? `btn-cat-${suffix}` : "bg-black"
          } hover:opacity-90 text-white transition-colors duration-200`}
          onClick={() => navigate(`/catalogue-formation/${formation.id}`)}>
          {VOIR_LES_DETAILS}
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Link>
  );
};

export default FormationCard;
