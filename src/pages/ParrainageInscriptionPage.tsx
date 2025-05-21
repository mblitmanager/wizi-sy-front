import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import image from "../assets/aopia-parrainage2.png";

// ParrainageInscriptionPage.tsx

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

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
    adresse: "",
    code_postal: "",
    ville: "",
    date_naissance: "",
    date_debut_formation: "",
    statut: "1",
    parrain_id: "",
  });

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
          date_naissance: formData.date_naissance,
          date_debut_formation: formData.date_debut_formation || null,
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
        adresse: "",
        code_postal: "",
        ville: "",
        date_naissance: "",
        date_debut_formation: "",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Colonne Illustration */}
        <div className="hidden lg:flex flex-col items-center justify-center p-8 h-full">
          {" "}
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={image}
              alt="Parrainage Illustration"
              className="w-full h-full max-h-[765px] object-contain animate-float" /* Ajout de h-full et max-h */
              style={{ objectPosition: "center" }}
            />
          </div>
        </div>
        {/* Colonne Formulaire */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* En-tête */}
          <div className="bg-blue-custom-300 p-6 text-white">
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
                viewBox="0 0 20 20"
              >
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
                      className="px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
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
                    className="h-6 w-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Civilité */}
              <div>
                <label
                  htmlFor="civilite"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Civilité
                </label>
                <select
                  id="civilite"
                  name="civilite"
                  value={formData.civilite}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.civilite ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  {" "}
                  <option value="M">Monsieur</option>
                  <option value="Mme">Madame</option>
                </select>
                {errors.civilite && (
                  <p className="mt-1 text-red-600 text-sm">
                    {errors.civilite[0]}
                  </p>
                )}
              </div>

              {/* Prénom */}
              <div>
                <label
                  htmlFor="prenom"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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
                  <p className="mt-1 text-red-600 text-sm">{errors.email[0]}</p>
                )}
              </div>

              {/* Téléphone */}
              <div>
                <label
                  htmlFor="telephone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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

              {/* Date de naissance */}
              <div>
                <label
                  htmlFor="date_naissance"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date de naissance
                </label>
                <input
                  type="date"
                  id="date_naissance"
                  name="date_naissance"
                  value={formData.date_naissance}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.date_naissance ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.date_naissance && (
                  <p className="mt-1 text-red-600 text-sm">
                    {errors.date_naissance[0]}
                  </p>
                )}
              </div>

              {/* Date début formation */}
              <div>
                <label
                  htmlFor="date_debut_formation"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date de début de formation (optionnel)
                </label>
                <input
                  type="date"
                  id="date_debut_formation"
                  name="date_debut_formation"
                  value={formData.date_debut_formation}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.date_debut_formation
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.date_debut_formation && (
                  <p className="mt-1 text-red-600 text-sm">
                    {errors.date_debut_formation[0]}
                  </p>
                )}
              </div>
            </div>

            {/* Adresse */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label
                  htmlFor="adresse"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Adresse
                </label>
                <input
                  type="text"
                  id="adresse"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.adresse ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.adresse && (
                  <p className="mt-1 text-red-600 text-sm">
                    {errors.adresse[0]}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="code_postal"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Code postal
                </label>
                <input
                  type="text"
                  id="code_postal"
                  name="code_postal"
                  value={formData.code_postal}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.code_postal ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.code_postal && (
                  <p className="mt-1 text-red-600 text-sm">
                    {errors.code_postal[0]}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="ville"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ville
                </label>
                <input
                  type="text"
                  id="ville"
                  name="ville"
                  value={formData.ville}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.ville ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.ville && (
                  <p className="mt-1 text-red-600 text-sm">{errors.ville[0]}</p>
                )}
              </div>
            </div>

            {/* Statut (caché car valeur par défaut) */}
            <input type="hidden" name="statut" value={formData.statut} />

            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
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
