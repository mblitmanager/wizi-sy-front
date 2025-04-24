import { useEffect, useState } from "react";
import { catalogueFormationApi } from "@/services/api";
import { progressAPI } from "@/api";
import { stagiaireAPI } from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HeaderSection from "@/components/features/HeaderSection";
import LoadingCustom from "@/components/catalogueFormation/LoadingCustom";
import { CatalogueFormationResponse } from "@/types/stagiaire";
const VITE_API_URL_IMG = import.meta.env.VITE_API_URL_IMG;

const FormationsPage = () => {
  const [formationsDisponibles, setFormationsDisponibles] = useState([]);
  const [mesFormations, setMesFormations] =
    useState<CatalogueFormationResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async (page = 1) => {
    setIsLoading(true); // Active le loading

    try {
      const progress = await progressAPI.getUserProgress();
      const stagiaireId = progress?.stagiaire?.id;

      if (stagiaireId) {
        try {
          const response = await stagiaireAPI.getCatalogueFormations(
            stagiaireId
          );
          const catalogueResponse: CatalogueFormationResponse = response.data;
          setMesFormations(catalogueResponse);
        } catch (catalogueError) {
          console.error("Erreur formations stagiaire:", catalogueError);
        }
      }

      try {
        const catalogueResponse =
          await catalogueFormationApi.getAllCatalogueFormation(page);
        const { data, last_page } = catalogueResponse.data as {
          data: any[];
          last_page: number;
        };
        setFormationsDisponibles(data);
        setLastPage(last_page);
      } catch (catalogueListError) {
        console.error("Erreur catalogue global:", catalogueListError);
      }
    } catch (error) {
      console.error("Erreur générale de récupération:", error);
    } finally {
      setIsLoading(false); // Désactive le loading une fois tout terminé
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
    }
  };

  const stripHtml = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div className="container mx-auto p-4 pb-20 md:pb-4">
      <HeaderSection titre="Formations" buttonText="Retour" />

      <Tabs defaultValue="available" className="w-full">
        <TabsList className="w-full justify-start mb-6">
          <TabsTrigger value="available">Formations disponibles</TabsTrigger>
          <TabsTrigger value="completed">Mes Formations</TabsTrigger>
        </TabsList>

        {/* Formations disponibles */}
        <TabsContent value="available">
          {isLoading ? (
            <LoadingCustom />
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {formationsDisponibles.map((formation: any) => (
                <div
                  key={formation.id}
                  className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
                  <img
                    src={`${VITE_API_URL_IMG}/${formation.image_url}`}
                    alt={formation.titre}
                    className="h-40 w-full object-cover rounded-lg mb-4"
                  />

                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {formation.titre.trim()}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {stripHtml(formation.description)}
                  </p>

                  <h4 className="font-bold text-gray-700 mb-4 line-clamp-3">
                    {formation.certification}
                  </h4>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {formation.prerequis}
                  </p>

                  <div className="flex justify-between items-center text-sm text-gray-700 mb-4">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
                      Durée : {formation.duree}h
                    </span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md">
                      {formation.tarif} €
                    </span>
                  </div>

                  <button className="mt-auto px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200">
                    Voir la formation
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-6">
            <button
              className="px-3 py-1 border rounded"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}>
              Précédent
            </button>

            {[...Array(lastPage)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === index + 1 ? "bg-blue-500 text-white" : ""
                }`}>
                {index + 1}
              </button>
            ))}

            <button
              className="px-3 py-1 border rounded"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === lastPage}>
              Suivant
            </button>
          </div>
        </TabsContent>

        {/* Formations du stagiaire */}
        <TabsContent value="completed">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mesFormations?.formations?.map((formation: any) => (
              <div
                key={formation.id}
                className="p-4 border rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold">{formation.titre}</h3>
                <p className="text-sm text-gray-600">{formation.description}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormationsPage;
