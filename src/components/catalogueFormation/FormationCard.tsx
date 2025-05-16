import { Formation } from "@/types/stagiaire";
import mp3 from "../../assets/mp3.png";
import mp4 from "../../assets/mp4.png";
import { Link, useNavigate } from "react-router-dom";
import { CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { VOIR_LES_DETAILS } from "@/utils/langue-type";
import nomedia from "../../assets/nomedia.png";
const stripHtml = (html: string) => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

const VITE_API_URL_IMG = import.meta.env.VITE_API_URL_IMG;

const FormationCard = ({ formation }: { formation: Formation }) => {
  const navigate = useNavigate();

  // Déterminer l'image à afficher
  const url = formation.catalogue_formation.imageUrl?.toLowerCase() || "";
  let image = nomedia;
  if (url.endsWith(".mp4")) {
    image = mp4;
  } else if (url.endsWith(".mp3")) {
    image = mp3;
  } else if (formation.catalogue_formation.imageUrl) {
    image = `${VITE_API_URL_IMG}/${formation.catalogue_formation.imageUrl}`;
  }

  return (
    <div className="group p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden hover:border-blue-100">
      {/* Image container with better aspect ratio and overflow hidden */}
      <div className="relative rounded-lg overflow-hidden mb-4 h-48 bg-gray-50 flex items-center justify-center">
        <img
          src={image}
          alt={formation.catalogue_formation.titre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Overlay effect on hover */}
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      {/* Content container with better spacing */}
      <div className="flex flex-col flex-grow">
        {/* Title with better typography */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {formation.catalogue_formation.titre}
        </h3>

        {/* Certification badge */}
        {formation.catalogue_formation.certification && (
          <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full mb-3 self-start">
            {formation.catalogue_formation.certification}
          </span>
        )}

        {/* Description with better readability */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {stripHtml(formation.catalogue_formation.description || "")}
        </p>

        {/* Prerequisites with icon */}
        {formation.catalogue_formation.prerequis && (
          <div className="flex items-start gap-2 text-sm text-gray-600 mb-4">
            <svg
              className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="line-clamp-2">
              {formation.catalogue_formation.prerequis}
            </span>
          </div>
        )}

        {/* Metadata with better layout */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                {formation.duree}h
              </span>
            </div>

            <span className="text-lg font-bold text-yellow-c">
              {formation.catalogue_formation.tarif} €
            </span>
          </div>
        </div>
      </div>

      {/* Button with better styling */}
      <CardFooter className="p-0 pt-4 mt-4">
        <Button
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          onClick={() =>
            navigate(`/catalogue_formation/${formation.catalogue_formation.id}`)
          }>
          {VOIR_LES_DETAILS}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </div>
  );
};

export default FormationCard;
