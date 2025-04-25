import { Formation } from "@/types/stagiaire";

const stripHtml = (html: string) => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

const VITE_API_URL_IMG = import.meta.env.VITE_API_URL_IMG;

const FormationCard = ({ formation }: { formation: Formation }) => (
  <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
    <img
      src={`${VITE_API_URL_IMG}/${formation.catalogue_formation.image_url}`}
      alt={formation.titre}
      className="h-40 w-full object-cover rounded-lg mb-4"
      loading="lazy"
    />
    <h3 className="text-xl font-bold text-gray-800 mb-2">
      {formation.catalogue_formation.titre}
    </h3>
    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
      {stripHtml(formation.description)}
    </p>
    <h4 className="font-bold text-gray-700 mb-4 line-clamp-3">
      {formation.catalogue_formation.certification}
    </h4>
    <p className="text-gray-600 mb-4 line-clamp-3">
      {formation.catalogue_formation.prerequis}
    </p>
    <div className="flex justify-between items-center text-sm text-gray-700 mb-4">
      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
        Durée : {formation.duree}h
      </span>
      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md">
        {formation.catalogue_formation.tarif} €
      </span>
    </div>
    <button className="mt-auto px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200">
      Voir la formation
    </button>
  </div>
);

export default FormationCard;
