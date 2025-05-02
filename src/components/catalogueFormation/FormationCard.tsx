import { Formation } from "@/types/stagiaire";
import mp3 from "../../assets/mp3.png";
import mp4 from "../../assets/mp4.png";
import { Link, useNavigate } from "react-router-dom";
import { CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { VOIR_LES_DETAILS } from "@/utils/langue-type";

const stripHtml = (html: string) => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

const VITE_API_URL_IMG = import.meta.env.VITE_API_URL_IMG;

const FormationCard = ({ formation }: { formation: Formation }) => {
  const navigate = useNavigate();
  // Déterminer l'image à afficher
  const url = formation.catalogue_formation.image_url?.toLowerCase() || "";
  let image = "/default-image.jpg"; // Image par défaut
  if (url.endsWith(".mp4")) {
    image = mp4; // Image par défaut pour les vidéos
  } else if (url.endsWith(".mp3")) {
    image = mp3; // Image par défaut pour les audios
  } else if (formation.catalogue_formation.image_url) {
    image = `${VITE_API_URL_IMG}/${formation.catalogue_formation.image_url}`;
  }

  return (
    <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
      {/* Image */}
      <img
        src={image}
        alt={formation.catalogue_formation.titre}
        className="h-40 w-full object-contain rounded-lg mb-4"
        loading="lazy"
      />

      {/* Titre */}
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        {formation.catalogue_formation.titre}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
        {stripHtml(formation.description)}
      </p>

      {/* Certification */}
      <h4 className="font-bold text-gray-700 mb-4 line-clamp-3">
        {formation.catalogue_formation.certification}
      </h4>

      {/* Pré-requis */}
      <p className="text-gray-600 mb-4 line-clamp-3">
        {formation.catalogue_formation.prerequis}
      </p>

      {/* Informations supplémentaires */}
      <div className="flex justify-between items-center text-sm text-gray-700 mb-4">
        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
          Durée : {formation.duree}h
        </span>
        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md">
          {formation.catalogue_formation.tarif} €
        </span>
      </div>

      {/* Bouton */}
      {/* <Link
        to={`/formations/${formation.catalogue_formation.id}`}
        className="mt-auto px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200">
        Voir la formation
      </Link> */}
      <CardFooter className="p-4 pt-0 mt-auto">
        <Button
          className="w-full flex items-center justify-center gap-2"
          onClick={() =>
            navigate(`/catalogue_formation/${formation.catalogue_formation.id}`)
          }>
          {VOIR_LES_DETAILS} <ArrowRight className="w-4 h-4" />
        </Button>
      </CardFooter>
    </div>
  );
};

export default FormationCard;
