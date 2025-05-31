import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import image from "../assets/aopia-parrainage2.png";
import { useFormations } from "@/use-case/hooks/catalogue/useCatalogue";

// ParrainageInscriptionPage.tsx

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const ParrainageInscriptionPage = () => {
  const { token } = useParams();
  const { toast } = useToast();
  const [parrainData, setParrainData] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    civilite: "M",
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    // adresse: "",
    // code_postal: "",
    // ville: "",
    // date_naissance: "",
    // date_debut_formation: "",
    catalogue_formation_id: "",
    statut: "1",
    parrain_id: "",
  });

  const { data: formationsResponse } = useFormations();
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchParrainData = async () => {
      try {
        const response = await fetch(`${API_URL}/parrainage/get-data/${token}`);
        const data = await response.json();

        if (data.success) {
          setParrainData(data.parrain);
          setFormData((prev) => ({
            ...prev,
            parrain_id: data.parrain.user.id,
          }));
        } else {
          throw new Error(data.message || "Lien invalide");
        }
      } catch (error) {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchParrainData();
  }, [token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: string, date: Date | null) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        [name]: date.toISOString().split("T")[0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/parrainage/register-filleul`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          // date_naissance: formData.date_naissance,
          // date_debut_formation: formData.date_debut_formation || null,
          date_inscription: new Date().toISOString().split("T")[0],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        }
        throw new Error(data.message || "Erreur lors de l'inscription");
      }

      // Réinitialiser le formulaire après succès
      setFormData({
        civilite: "M",
        prenom: "",
        nom: "",
        email: "",
        telephone: "",
        // adresse: "",
        // code_postal: "",
        // ville: "",
        // date_naissance: "",
        // date_debut_formation: "",
        catalogue_formation_id: "",
        statut: "1",
        parrain_id: formData.parrain_id,
      });

      // Réinitialiser les erreurs
      setErrors({});

      // Afficher le message de succès
      setIsSuccess(true);

      toast({
        title: "Succès",
        description: "Inscription réussie!",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch overflow-hidden min-h-screen ">
        {/* Colonne Illustration */}
        <div className="hidden lg:flex flex-col items-center justify-center">
          {" "}
          <div className="relative w-full  flex items-center justify-center">
            <img
              src={image}
              alt="Parrainage Illustration"
              className="w-full object-contain animate-float" /* Ajout de h-full et max-h */
              style={{ objectPosition: "center", height: "880px" }}
            />
          </div>
        </div>
        {/* Colonne Formulaire */}
        <div className="flex flex-col justify-center mx-auto rounded-lg shadow-lg p-6 lg:p-8">
          {/* En-tête */}
          <div className="py-6 text-yellow-shade">
            <h1 className="text-2xl font-bold">Inscription par parrainage</h1>
            <p className="opacity-90">
              Complétez vos informations pour finaliser votre inscription
            </p>
          </div>

          {/* Message de succès */}
          {isSuccess && (
            <div className="m-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
              <svg
                className="h-5 w-5 text-green-500 mt-0.5 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-green-800">
                  Inscription réussie !
                </h3>
                <div className="mt-1 text-sm text-green-700">
                  <p>
                    Félicitations, votre inscription est confirmée. Un email de
                    confirmation vous a été envoyé.
                  </p>
                </div>
                <div className="mt-4">
                  <div className="-mx-2 -my-1.5 flex">
                    <button
                      type="button"
                      onClick={() => setIsSuccess(false)}
                      className="px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                      Fermer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section Parrain */}
          {parrainData && (
            <div className="mx-3 mt-3 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <div className="flex items-center mb-3">
                <div className="bg-white p-2 rounded-full shadow-sm mr-3">
                  <svg
                    className="h-6 w-6 text-yellow-shade-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Votre parrain
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </p>
                  <p className="font-medium text-gray-800">
                    {parrainData.user.name} {parrainData.stagiaire.prenom}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </p>
                  <p className="font-medium text-gray-800">
                    {parrainData.user.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6 px-3 mb-3">
            <input
              type="hidden"
              name="parrain_id"
              value={formData.parrain_id}
            />

            <div className="grid grid-cols-1 gap-6">
              {/* Civilité */}
              <div>
                <label
                  htmlFor="civilite"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Civilité
                </label>
                <select
                  id="civilite"
                  name="civilite"
                  value={formData.civilite}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.civilite ? "border-red-500" : "border-gray-300"
                  }`}>
                  <option value="M">Monsieur</option>
                  <option value="Mme">Madame</option>
                </select>
                {errors.civilite && (
                  <p className="mt-1 text-red-600 text-sm">
                    {errors.civilite[0]}
                  </p>
                )}
              </div>

              {/* Nom et Prénom */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Prénom */}
                <div>
                  <label
                    htmlFor="prenom"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                      errors.prenom ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.prenom && (
                    <p className="mt-1 text-red-600 text-sm">
                      {errors.prenom[0]}
                    </p>
                  )}
                </div>

                {/* Nom */}
                <div>
                  <label
                    htmlFor="nom"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500
                      ${errors.nom ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.nom && (
                    <p className="mt-1 text-red-600 text-sm">{errors.nom[0]}</p>
                  )}
                </div>
              </div>

              {/* Email et Téléphone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-red-600 text-sm">
                      {errors.email[0]}
                    </p>
                  )}
                </div>

                {/* Téléphone */}
                <div>
                  <label
                    htmlFor="telephone"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                      errors.telephone ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.telephone && (
                    <p className="mt-1 text-red-600 text-sm">
                      {errors.telephone[0]}
                    </p>
                  )}
                </div>
              </div>

              {/* Formation Radio Buttons */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catalogue de formations
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                  {formationsResponse?.map((formation: any) => (
                    <div
                      key={formation.id}
                      className={`relative flex items-center p-2.5 sm:p-3 rounded-lg border cursor-pointer transition-all ${
                        formData.catalogue_formation_id === formation.id
                          ? "border-amber-500 bg-amber-50 shadow-sm"
                          : "border-gray-200 hover:border-amber-300 hover:bg-amber-50/50"
                      }`}
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          catalogue_formation_id: formation.id,
                        }));
                      }}>
                      <input
                        type="radio"
                        id={`formation-${formation.id}`}
                        name="catalogue_formation_id"
                        value={formation.id}
                        checked={
                          formData.catalogue_formation_id === formation.id
                        }
                        onChange={handleChange}
                        className="sr-only"
                        aria-label={`Sélectionner la formation ${formation.titre}`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <div
                            className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center mr-2.5 sm:mr-3 ${
                              formData.catalogue_formation_id === formation.id
                                ? "border-amber-500"
                                : "border-gray-300"
                            }`}>
                            {formData.catalogue_formation_id ===
                              formation.id && (
                              <div className="w-2 h-2 rounded-full bg-amber-500" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 break-words">
                              {formation.titre}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.catalogue_formation_id && (
                  <p className="mt-1 text-red-600 text-sm">
                    {errors.catalogue_formation_id[0]}
                  </p>
                )}
              </div>
            </div>

            {/* Statut (caché car valeur par défaut) */}
            <input type="hidden" name="statut" value={formData.statut} />

            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-shade hover:bg-yellow-shade-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-shade transition duration-150 ease-in-out">
                Finaliser mon inscription
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ParrainageInscriptionPage;
