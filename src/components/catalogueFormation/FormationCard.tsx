import { Formation } from "@/types/stagiaire";
import mp3 from "../../assets/mp3.png";
import mp4 from "../../assets/mp4.png";
import { Link, useNavigate } from "react-router-dom";
import { CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowRight, Clock } from "lucide-react";
import { VOIR_LES_DETAILS } from "@/utils/langue-type";
import nomedia from "../../assets/nomedia.png";
const stripHtml = (html: string) => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

const VITE_API_URL_IMG = import.meta.env.VITE_API_URL_MEDIA;

const FormationCard = ({ formation }: { formation: any }) => {
  const navigate = useNavigate();

  // Couleurs par catégorie
  const categoryColors: Record<string, string> = {
    Bureautique: "border-[#3D9BE9]",
    Langues: "border-[#A55E6E]",
    Internet: "border-[#FFC533]",
    Création: "border-[#9392BE]",
  };

  const categoryColor =
    categoryColors[formation.formation.categorie] ||
    "bg-gray-50/10 border-gray-200";

  // Get image URL
  const url = formation.image_url?.toLowerCase() || "";
  let image = nomedia;
  if (url.endsWith(".mp4")) {
    image = mp4;
  } else if (url.endsWith(".mp3")) {
    image = mp3;
  } else if (formation.image_url) {
    image = `${VITE_API_URL_IMG}/${formation.image_url}`;
  }

  return (
    <div
      className={`group p-4 border-t-4 rounded-lg border-t ${categoryColor} shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full overflow-hidden hover:translate-y-[-2px]`}>
      {/* Image container - plus compact */}
      <div className="relative rounded-md overflow-hidden mb-3 h-36 bg-gray-100 flex items-center justify-center">
        <img
          src={image}
          alt={formation.titre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      {/* Content container - plus compact */}
      <div className="flex flex-col flex-grow space-y-2">
        {/* Title - plus petit */}
        <h3 className="text-base font-semibold text-orange-400 line-clamp-2 leading-snug">
          {formation.titre}
        </h3>

        {/* Category badge - couleur dynamique */}
        <div className="flex justify-between items-start">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              formation.formation.categorie === "Bureautique"
                ? "bg-[#3D9BE9]/20 text-[#3D9BE9]"
                : formation.formation.categorie === "Langues"
                ? "bg-[#A55E6E]/20 text-[#A55E6E]"
                : formation.formation.categorie === "Internet"
                ? "bg-[#FFC533]/20 text-[#FFC533]"
                : "bg-[#9392BE]/20 text-[#9392BE]"
            }`}>
            {formation.formation.categorie}
          </span>

          {/* Certification badge - plus petit */}
          {formation.certification && (
            <span className="text-l font-medium px-2 py-1 rounded-full bg-orange-50 text-orange-500">
              {formation.certification}
            </span>
          )}
        </div>

        {/* Description - plus compacte */}
        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
          {stripHtml(formation.description || "")}
        </p>

        {/* Metadata - plus compact */}
        <div className="mt-auto pt-2">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="w-3 h-3" />
              <span>{formation.duree}h</span>
            </div>

            <span className="font-bold text-gray-800">{formation.tarif} €</span>
          </div>
        </div>
      </div>

      {/* Button - plus petit et stylisé */}
      <CardFooter className="p-0 pt-3 mt-2">
        <Button
          className="w-full h-8 text-xs flex items-center justify-center gap-1 bg-[#8B5C2A]  hover:bg-[#FFC533] text-white transition-colors duration-200"
          onClick={() => navigate(`/catalogue-formation/${formation.id}`)}>
          {VOIR_LES_DETAILS}
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </div>
  );
};

export default FormationCard;
