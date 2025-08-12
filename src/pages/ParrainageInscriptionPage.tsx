import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import image from "../assets/aopia-parrainage2.png";
import { useFormations } from "@/use-case/hooks/catalogue/useCatalogue";

interface FormData {
  civilite: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  catalogue_formation_id: string;
  statut: string;
  parrain_id: string;
  lien_parrainage: string;
  motif?: string;
  date_demande?: string;
}

interface ParrainData {
  user: {
    id: number;
    name: string;
    email: string;
    stagiaire: {
      id: number;
      prenom: string;
    };
  };
  stagiaire: {
    id: number;
    prenom: string;
  };
}

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const ParrainageInscriptionPage = () => {
  const { token } = useParams();
  const { toast } = useToast();
  const [parrainData, setParrainData] = useState<ParrainData | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    civilite: "M",
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    catalogue_formation_id: "",
    statut: "1",
    parrain_id: "",
    lien_parrainage: token || "",
  });

  const { data: formationsResponse } = useFormations();
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchParrainData = async () => {
      try {
        console.log("Token from URL:", token);

        if (!token) {
          throw new Error("Token de parrainage manquant");
        }

        console.log("Fetching parrain data...");
        const response = await fetch(`${API_URL}/parrainage/get-data/${token}`);

        console.log("Response status:", response.status);
        const data = await response.json();
        console.log("API response data:", data);

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Erreur lors de la récupération des données du parrain"
          );
        }

        if (data.success && data.parrain) {
          console.log("Parrain data received:", data.parrain);

          // Transformez la structure pour correspondre à votre interface
          const formattedParrainData = {
            user: {
              id: data.parrain.user.id,
              name: data.parrain.user.name,
              email: data.parrain.user.email,
              stagiaire: {
                id: data.parrain.stagiaire.id,
                prenom: data.parrain.stagiaire.prenom,
              },
            },
            stagiaire: {
              id: data.parrain.stagiaire.id,
              prenom: data.parrain.stagiaire.prenom,
            },
          };

          setParrainData(formattedParrainData);
          setFormData((prev) => ({
            ...prev,
            parrain_id: data.parrain.user.id.toString(), // Convertir en string si nécessaire
            lien_parrainage: token,
          }));
        } else {
          throw new Error(data.message || "Lien de parrainage invalide");
        }
      } catch (error: any) {
        console.error("Error fetching parrain data:", error);
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
  }, [token, toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        date_inscription: new Date().toISOString().split("T")[0],
        motif: "Soumission d'une demande d'inscription par parrainage",
        date_demande: new Date().toISOString(),
        lien_parrainage: token,
      };

      const response = await fetch(`${API_URL}/parrainage/register-filleul`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
          throw new Error("Veuillez corriger les erreurs dans le formulaire");
        }
        throw new Error(data.message || "Erreur lors de l'inscription");
      }

      // Réinitialisation du formulaire après succès
      setFormData({
        civilite: "M",
        prenom: "",
        nom: "",
        email: "",
        telephone: "",
        catalogue_formation_id: "",
        statut: "1",
        parrain_id: formData.parrain_id,
        lien_parrainage: token || "",
      });

      setErrors({});
      setIsSuccess(true);

      toast({
        title: "Succès",
        description: "Inscription réussie!",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredFormations = formationsResponse?.filter((formation: any) =>
    formation.titre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!parrainData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Erreur</h2>
          <p className="text-gray-700 mb-4">
            Le lien de parrainage est invalide ou a expiré.
          </p>
          <p className="text-gray-600">
            Veuillez contacter votre parrain pour obtenir un nouveau lien.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Colonne Illustration */}
            <div className="hidden lg:block bg-gradient-to-br from-yellow-100 to-amber-100 p-8">
              <div className="h-full flex flex-col justify-center items-center">
                <img
                  src={image}
                  alt="Parrainage Illustration"
                  className="max-h-[600px] w-auto object-contain animate-float"
                />
                <div className="mt-8 text-center">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Programme de Parrainage
                  </h2>
                  <p className="mt-2 text-gray-600">
                    Rejoignez notre communauté avec l'aide de votre parrain et
                    bénéficiez d'avantages exclusifs.
                  </p>
                </div>
              </div>
            </div>

            {/* Colonne Formulaire */}
            <div className="p-6 sm:p-8 lg:p-10">
              {/* En-tête */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                  Inscription par parrainage
                </h1>
                <p className="mt-2 text-gray-600">
                  Complétez vos informations pour finaliser votre inscription
                </p>
              </div>

              {/* Message de succès */}
              {isSuccess && (
                <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-green-400"
                        fill="currentColor"
                        viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">
                        Inscription réussie !
                      </h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>
                          Félicitations, votre inscription est confirmée. Un
                          email de confirmation vous a été envoyé.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Section Parrain */}
              <div className="mb-8 p-6 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="flex items-center">
                  <div className="bg-white p-2 rounded-full shadow-sm mr-4">
                    <svg
                      className="h-6 w-6 text-indigo-600"
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
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      Votre parrain
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {parrainData.stagiaire.prenom} {parrainData.user.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Formulaire */}
              {!isSuccess && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <input
                    type="hidden"
                    name="parrain_id"
                    value={formData.parrain_id}
                  />
                  <input
                    type="hidden"
                    name="lien_parrainage"
                    value={formData.lien_parrainage}
                  />

                  <div className="grid grid-cols-1 gap-6">
                    {/* Civilité */}
                    <div>
                      <label
                        htmlFor="civilite"
                        className="block text-sm font-medium text-gray-700 mb-2">
                        Civilité
                      </label>
                      <div className="flex space-x-4">
                        {[
                          { value: "M", label: "Monsieur" },
                          { value: "Mme", label: "Madame" },
                        ].map((option) => (
                          <label
                            key={option.value}
                            className="inline-flex items-center">
                            <input
                              type="radio"
                              name="civilite"
                              value={option.value}
                              checked={formData.civilite === option.value}
                              onChange={handleChange}
                              className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                            />
                            <span className="ml-2 text-gray-700">
                              {option.label}
                            </span>
                          </label>
                        ))}
                      </div>
                      {errors.civilite && (
                        <p className="mt-2 text-sm text-red-600">
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
                          className="block text-sm font-medium text-gray-700 mb-2">
                          Prénom
                        </label>
                        <input
                          type="text"
                          id="prenom"
                          name="prenom"
                          value={formData.prenom}
                          onChange={handleChange}
                          className={`block w-full px-4 py-3 rounded-md border shadow-sm focus:ring-yellow-500 focus:border-yellow-500 ${
                            errors.prenom ? "border-red-300" : "border-gray-300"
                          }`}
                          required
                        />
                        {errors.prenom && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.prenom[0]}
                          </p>
                        )}
                      </div>

                      {/* Nom */}
                      <div>
                        <label
                          htmlFor="nom"
                          className="block text-sm font-medium text-gray-700 mb-2">
                          Nom
                        </label>
                        <input
                          type="text"
                          id="nom"
                          name="nom"
                          value={formData.nom}
                          onChange={handleChange}
                          className={`block w-full px-4 py-3 rounded-md border shadow-sm focus:ring-yellow-500 focus:border-yellow-500 ${
                            errors.nom ? "border-red-300" : "border-gray-300"
                          }`}
                          required
                        />
                        {errors.nom && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.nom[0]}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Email et Téléphone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Email */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`block w-full px-4 py-3 rounded-md border shadow-sm focus:ring-yellow-500 focus:border-yellow-500 ${
                            errors.email ? "border-red-300" : "border-gray-300"
                          }`}
                          required
                        />
                        {errors.email && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.email[0]}
                          </p>
                        )}
                      </div>

                      {/* Téléphone */}
                      <div>
                        <label
                          htmlFor="telephone"
                          className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          id="telephone"
                          name="telephone"
                          value={formData.telephone}
                          onChange={handleChange}
                          className={`block w-full px-4 py-3 rounded-md border shadow-sm focus:ring-yellow-500 focus:border-yellow-500 ${
                            errors.telephone
                              ? "border-red-300"
                              : "border-gray-300"
                          }`}
                          required
                        />
                        {errors.telephone && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.telephone[0]}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Catalogue de formations */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Choisissez une formation
                      </label>

                      {/* Barre de recherche */}
                      <div className="mb-4">
                        <input
                          type="text"
                          placeholder="Rechercher une formation..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="block w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                        />
                      </div>

                      {/* Liste des formations */}
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="max-h-60 overflow-y-auto">
                          {filteredFormations?.length > 0 ? (
                            <div className="divide-y divide-gray-200">
                              {filteredFormations.map((formation: any) => (
                                <div
                                  key={formation.id}
                                  className={`block p-4 hover:bg-amber-50 cursor-pointer transition-colors ${
                                    formData.catalogue_formation_id ===
                                    formation.id
                                      ? "bg-amber-50"
                                      : ""
                                  }`}>
                                  <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                      type="radio"
                                      name="catalogue_formation_id"
                                      value={formation.id}
                                      checked={
                                        formData.catalogue_formation_id ===
                                        formation.id
                                      }
                                      onChange={() => {
                                        setFormData((prev) => ({
                                          ...prev,
                                          catalogue_formation_id: formation.id,
                                        }));
                                      }}
                                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                                      required
                                    />
                                    <span className="text-sm font-medium text-gray-900">
                                      {formation.titre}
                                    </span>
                                  </label>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 text-center text-gray-500">
                              Aucune formation trouvée
                            </div>
                          )}
                        </div>
                      </div>
                      {errors.catalogue_formation_id && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.catalogue_formation_id[0]}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Statut (caché) */}
                  <input type="hidden" name="statut" value={formData.statut} />

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition ${
                        submitting ? "opacity-75 cursor-not-allowed" : ""
                      }`}>
                      {submitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          En cours...
                        </>
                      ) : (
                        "Finaliser mon inscription"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParrainageInscriptionPage;
