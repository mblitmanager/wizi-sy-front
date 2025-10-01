import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Gift, Share2, ChevronRight, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import image from "../../assets/aopia parrainage.png";
import { useUser } from "@/hooks/useAuth";

const API_URL = import.meta.env.VITE_API_URL || "https://wizi-learn.com/api";

interface FormData {
  civilite: string;
  prenom: string;
  nom: string;
  telephone: string;
  statut: string;
  parrain_id: string;
  lien_parrainage: string;
  motif?: string;
  date_demande?: string;
  date_inscription?: string;
}

const ParrainageSection = () => {
  const [formData, setFormData] = useState<FormData>({
    civilite: "M",
    prenom: "",
    nom: "",
    telephone: "",
    statut: "1",
    parrain_id: "",
    lien_parrainage: "",
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  // Pré-remplir le parrain_id avec l'ID de l'utilisateur connecté
  useEffect(() => {
    if (user?.user?.id) {
      setFormData((prev) => ({
        ...prev,
        parrain_id: user.user.id.toString(),
      }));
    }
  }, [user]);

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
      // Préparer les données avec le motif par défaut
      const payload = {
        ...formData,
        date_inscription: new Date().toISOString().split("T")[0],
        motif: "Soumission d'une demande d'inscription par parrainage",
        date_demande: new Date().toISOString(),
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
        telephone: "",
        statut: "1",
        parrain_id: user?.user?.id?.toString() || "",
        lien_parrainage: "",
      });

      setErrors({});
      setIsSuccess(true);

      toast({
        title: "Succès",
        description: "Inscription du filleul réussie !",
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

  return (
    <section className="mb-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        {/* Left Column - Content */}
        <div className="flex-1 order-2 lg:order-1">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4 lg:hidden">
              <img
                src={image}
                alt="Parrainage"
                className="w-16 h-16 object-contain rounded-lg"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Programme de parrainage
                </h1>
                <p className="text-sm text-gray-600">
                  Gagnez{" "}
                  <span className="text-orange-600 font-bold">
                    50€ par filleul
                  </span>
                </p>
              </div>
            </div>

            <h1 className="hidden lg:block text-3xl font-bold text-gray-800 mb-3">
              Programme de parrainage
            </h1>
            <p className="hidden lg:block text-lg text-gray-600 mb-6">
              Parrainez vos amis et gagnez{" "}
              <span className="text-orange-600 font-bold">50€</span> pour chaque
              inscription valide.
            </p>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 mb-6 border border-yellow-100">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Gift className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Plus vous parrainez, plus vous gagnez des cartes cadeaux.
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Section Informations du Parrain */}
          <div className="mb-6">
            <Card className="border border-blue-200 rounded-xl shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Votre profil de parrain
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nom du parrain</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {user?.user?.name || "Non disponible"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email du parrain</p>
                    <p className="text-lg font-semibold text-orange-600">
                      {user?.user?.email || "Non disponible"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulaire d'inscription des filleuls */}
          <div className="mb-8">
            <Card className="border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <UserPlus className="h-5 w-5 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Inscrire un filleul
                  </h3>
                </div>

                {/* Message de succès */}
                {isSuccess && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
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
                          Filleul inscrit avec succès !
                        </h3>
                        <div className="mt-2 text-sm text-green-700">
                          <p>
                            Le filleul a été inscrit avec succès. Vous recevrez
                            50€ une fois son inscription validée.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
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
                              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
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
                          className={`block w-full px-4 py-3 rounded-md border shadow-sm focus:ring-orange-500 focus:border-orange-500 ${
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
                          className={`block w-full px-4 py-3 rounded-md border shadow-sm focus:ring-orange-500 focus:border-orange-500 ${
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

                    {/* Téléphone uniquement */}
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
                        className={`block w-full px-4 py-3 rounded-md border shadow-sm focus:ring-orange-500 focus:border-orange-500 ${
                          errors.telephone
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        required
                        placeholder="Ex: +33 1 23 45 67 89"
                      />
                      {errors.telephone && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.telephone[0]}
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
                      className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition ${
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
                          Inscription en cours...
                        </>
                      ) : (
                        "Inscrire le filleul"
                      )}
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* How It Works Section */}
          <Card className="border border-gray-200 rounded-xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-100 p-2 rounded-lg">
                  <ChevronRight className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Comment ça marche ?
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-full flex-shrink-0">
                    <span className="text-orange-600 font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">
                      Remplissez le formulaire
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Inscrivez vos filleuls avec leurs informations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-full flex-shrink-0">
                    <span className="text-orange-600 font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">
                      Validation de l'inscription
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Nous contactons le filleul pour finaliser l'inscription.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-full flex-shrink-0">
                    <span className="text-orange-600 font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">
                      Inscription confirmée
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Le filleul complète son processus d'inscription.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-full flex-shrink-0">
                    <span className="text-orange-600 font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">
                      Vous gagnez 50€
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Pour chaque inscription validée, vous recevez 50€.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Image (Desktop only) */}
        <div className="hidden lg:block flex-1 order-1 lg:order-2">
          <div className="sticky top-6">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-50 rounded-2xl p-8 border border-yellow-200 shadow-sm">
              <img
                src={image}
                alt="Programme de parrainage"
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParrainageSection;
