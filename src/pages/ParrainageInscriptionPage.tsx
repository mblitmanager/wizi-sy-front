import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

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
    statut: "en_attente",
    parrain_id: "",
  });

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
      const response = await fetch(`${API_URL}/parrainage/registerFilleul`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          // Formatage des dates si nécessaire
          date_naissance: formData.date_naissance,
          date_debut_formation: formData.date_debut_formation || null,
          date_inscription: new Date().toISOString().split("T")[0],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors); // stocke erreurs par champ
        }
        throw new Error(data.message || "Erreur lors de l'inscription");
      }

      toast({
        title: "Succès",
        description: "Inscription réussie!",
      });
      // Redirection vers la page de connexion
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Inscription par parrainage
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Complétez le formulaire pour finaliser votre inscription
          </p>
        </div>

        {/* Section Parrain */}
        {parrainData && (
          <div className="bg-white shadow rounded-lg p-6 mb-8 border-l-4 border-blue-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Votre parrain
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Nom complet</p>
                <p className="text-lg font-semibold text-gray-800">
                  {parrainData.user.name} {parrainData.stagiaire.prenom}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-lg font-semibold text-gray-800">
                  {parrainData.user.email}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Téléphone</p>
                <p className="text-lg font-semibold text-gray-800">
                  {parrainData.stagiaire.telephone || "Non renseigné"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Adresse</p>
                <p className="text-lg font-semibold text-gray-800">
                  {parrainData.stagiaire.adresse || "Non renseignée"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Formulaire Parrainé */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Vos informations
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Civilité
                </label>
                <select
                  id="civilite"
                  name="civilite"
                  value={formData.civilite}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.code_postal ? "border-red-500" : "border-gray-300"
                  }`}>
                  {" "}
                  <option value="M">Monsieur</option>
                  <option value="Mme">Madame</option>
                </select>
                {errors.code_postal && (
                  <p className="mt-1 text-red-600 text-sm">
                    {errors.code_postal[0]}
                  </p>
                )}
              </div>

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
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
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
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

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
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
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
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Date de naissance */}
              <div>
                <label
                  htmlFor="date_naissance"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Date de naissance
                </label>
                <input
                  type="date"
                  id="date_naissance"
                  name="date_naissance"
                  value={formData.date_naissance}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Date début formation */}
              <div>
                <label
                  htmlFor="date_debut_formation"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Date de début de formation (optionnel)
                </label>
                <input
                  type="date"
                  id="date_debut_formation"
                  name="date_debut_formation"
                  value={formData.date_debut_formation}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Adresse */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label
                  htmlFor="adresse"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <input
                  type="text"
                  id="adresse"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="code_postal"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Code postal
                </label>
                <input
                  type="text"
                  id="code_postal"
                  name="code_postal"
                  value={formData.code_postal}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="ville"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Ville
                </label>
                <input
                  type="text"
                  id="ville"
                  name="ville"
                  value={formData.ville}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Statut (caché car valeur par défaut) */}
            <input type="hidden" name="statut" value={formData.statut} />

            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out">
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
