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
import { FormationCardData } from "@/types/Formation";
const stripHtml = (html: string) => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

const VITE_API_URL_IMG = import.meta.env.VITE_API_URL_MEDIA;

const FormationCard = ({ formation }: { formation: FormationCardData }) => {
  const navigate = useNavigate();
  const categoryColors: Record<CATEGORIES, string> = {
    [CATEGORIES.BUREAUTIQUE]: "border-[#3D9BE9]",
    [CATEGORIES.LANGUES]: "border-[#A55E6E]",
    [CATEGORIES.INTERNET]: "border-[#FFC533]",
    [CATEGORIES.CREATION]: "border-[#9392BE]",
    [CATEGORIES.IA]: "border-[#ABDA96]",
  };

  const getCategoryColor = (category: string) => {
    return (
      categoryColors[category as CATEGORIES] || "bg-gray-50/10 border-gray-200"
    );
  };

  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case CATEGORIES.BUREAUTIQUE:
        return "bg-[#3D9BE9]/20 text-[#3D9BE9]";
      case CATEGORIES.LANGUES:
        return "bg-[#A55E6E]/20 text-[#A55E6E]";
      case CATEGORIES.INTERNET:
        return "bg-[#FFC533]/20 text-[#FFC533]";
      case CATEGORIES.CREATION:
        return "bg-[#9392BE]/20 text-[#9392BE]";
      case CATEGORIES.IA:
        return "bg-[#ABDA96]/20 text-[#ABDA96]";
      default:
        return "bg-gray-200/20 text-gray-600";
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
  const categoryColor = getCategoryColor(formation.formation.categorie);
  const categoryBadgeStyle = getCategoryBadgeStyle(
    formation.formation.categorie
  );

  return (
    <Link
      to={`/catalogue-formation/${formation.id}`}
      className={`group p-4 border-t-4 rounded-lg  ${categoryColor} shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full overflow-hidden hover:translate-y-[-2px]`}>
      {/* Image container */}
      <div className="relative rounded-md overflow-hidden mb-3 h-36 bg-gray-100 flex items-center justify-center">
        <img
          src={image}
          alt={formation.titre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      {/* Content container */}
      <div className="flex flex-col flex-grow space-y-2">
        {/* Title */}
        <h3 className="text-base font-semibold text-orange- line-clamp-2 leading-snug">
          {formation.titre}
        </h3>

        {/* Category badge */}
        <div className="flex justify-between items-start">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${categoryBadgeStyle}`}>
            {formation.formation.categorie}
          </span>

          {/* Certification badge */}
          {formation.certification && (
            <span className="text-l font-medium px-2 py-1 rounded-full bg-orange-50 text-orange-500">
              {formation.certification}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {stripHtml(formation.description || "")}
        </p>

        {/* Metadata */}
        <div className="mt-auto pt-2">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="w-3 h-3" />
              <span>{formation.duree}h</span>
            </div>

            <span className="text-xl text-orange-500 font-extrabold drop-shadow-lg">
              {formation.tarif
                ? `${Math.round(Number(formation.tarif))
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ${
                    FORMATIONMETADATA.euros
                  }`
                : "-"}
            </span>
          </div>
        </div>
      </div>

      {/* Button */}
      <CardFooter className="p-0 pt-3 mt-2">
        <Button
          className="w-full h-8 text-xs flex items-center justify-center gap-1 bg-black hover:bg-[#8B5C2A] text-white transition-colors duration-200"
          onClick={() => navigate(`/catalogue-formation/${formation.id}`)}>
          {VOIR_LES_DETAILS}
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Link>
  );
};

export default FormationCard;
