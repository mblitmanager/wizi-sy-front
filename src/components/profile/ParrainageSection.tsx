import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UserPlus,
  Gift,
  Share2,
  ChevronRight,
  User,
  X,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import image from "../../assets/plan.png";
import { useUser } from "@/hooks/useAuth";
import { FORMATIONMETADATA } from "@/utils/constants";

import { isAxiosError } from "axios";
import { api } from "@/lib/api";

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

// Composant Modal pour le succès de l'inscription
interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  filleulName: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  filleulName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-wizi-muted p-2 rounded-full">
              <CheckCircle className="w-6 h-6 text-wizi-muted" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Filleul inscrit avec succès !
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-700 mb-3">Vous avez inscrit avec succès :</p>
          <p className="font-semibold text-gray-900 mb-4 text-center bg-gray-50 py-2 px-4 rounded-lg">
            {filleulName}
          </p>
          <div className="bg-wizi-muted border border-wizi-accent rounded-lg p-4">
            <p className="text-wizi-muted text-sm text-center">
              Vous recevrez 50 {FORMATIONMETADATA.euros} en carte cadeau une
              fois son inscription validée.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-900 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
};

interface ParrainageSectionProps {
  /** Appelé après l'inscription réussie d'un filleul. */
  onParrainageSuccess?: () => void;
}

const ParrainageSection = ({ onParrainageSuccess }: ParrainageSectionProps) => {
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

  // États pour le modal de succès
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [filleulName, setFilleulName] = useState("");

  // Pré-remplir le parrain_id avec l'ID de l'utilisateur connecté
  useEffect(() => {
    if (user?.user?.id) {
      setFormData((prev) => ({
        ...prev,
        parrain_id: user.user.id.toString(),
      }));
    }
  }, [user]);
  // console.log("User in ParrainageSection:", user);

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

      try {
        await api.post("/parrainage/register-filleul", payload);
      } catch (err) {
        const data = isAxiosError(err) ? err.response?.data : undefined;
        if (data?.errors) {
          setErrors(data.errors);
          throw new Error("Veuillez corriger les erreurs dans le formulaire");
        }
        throw new Error(data?.message || "Erreur lors de l'inscription");
      }

      // Stocker le nom du filleul pour le modal
      const fullName = `${formData.prenom} ${formData.nom}`;
      setFilleulName(fullName);

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

      // Afficher le modal de succès
      setShowSuccessModal(true);
      onParrainageSuccess?.();

      toast({
        title: "Succès",
        description: "Inscription du filleul réussie !",
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "Une erreur est survenue";

      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setFilleulName("");
  };
  // console.log("Rendering ParrainageSection with user:", user);
  return (
    <>
      <section className="mx-auto h-full max-w-7xl px-1 sm:px-2 lg:px-4">
        <div className="flex h-full flex-col gap-4 lg:flex-row">
          {/* Left Column - Content */}
          <div className="order-2 flex min-w-0 flex-1 flex-col overflow-hidden lg:order-1">
            {/* Header Section */}
            <div className="mb-3">
              <div className="flex items-center gap-3 mb-2 lg:hidden">
                <img
                  src={image}
                  alt="Parrainage"
                    className="h-12 w-12 rounded-lg object-contain"
                />
                <div>
                  <h1 className="text-xl font-bold text-[#173f46]">
                    Programme de parrainage
                  </h1>
                  <p className="text-sm text-gray-600">
                    Gagnez{" "}
                    <span className="text-orange-600 font-bold">
                      50 € par filleul
                    </span>
                  </p>
                </div>
              </div>

              <h1 className="hidden text-2xl font-bold text-[#173f46] lg:block">
                Programme de parrainage
              </h1>
              <p className="hidden text-sm text-[#526b70] lg:block">
                Parrainez vos collègues et gagnez{" "}
                <span className="text-orange-600 font-bold">50 €</span> pour
                chaque inscription valide.
              </p>

              <div className="rounded-xl border border-[#e9c66c] bg-[#fff4d8] p-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-[#f6c454] p-2">
                    <Gift className="h-5 w-5 text-[#173f46]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#173f46]">
                      Plus vous parrainez, plus vous gagnez des cartes cadeaux.
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Section Informations du Parrain */}
            <div className="mb-3">
              <Card className="rounded-xl border border-[#d3e2de] bg-[#eaf2f0] shadow-none">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-white p-2">
                      <User className="h-4 w-4 text-[#173f46]" />
                    </div>
                    <h3 className="text-sm font-semibold text-[#173f46]">
                      Votre profil de parrain
                    </h3>
                  </div>

                  {/* Nouvelle structure pour éviter le troncage */}
                  <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {/* Prénom */}
                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
                      <div className="w-full sm:w-32 flex-shrink-0">
                        <p className="text-xs font-medium text-[#6b7773]">
                          Prénom
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-semibold text-[#173f46]">
                          {user?.stagiaire?.prenom || ""}
                        </p>
                      </div>
                    </div>

                    {/* Nom */}
                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
                      <div className="w-full sm:w-32 flex-shrink-0">
                        <p className="text-xs font-medium text-[#6b7773]">
                          Nom
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-semibold text-[#173f46]">
                          {user?.user?.name?.toLocaleUpperCase() || ""}
                        </p>
                      </div>
                    </div>

                    {/* Email - Structure améliorée */}
                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
                      <div className="w-full sm:w-32 flex-shrink-0">
                        <p className="text-xs font-medium text-[#6b7773]">
                          Email
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-semibold text-[#b47700]">
                          {user?.user?.email || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Formulaire d'inscription des filleuls */}
            <div className="mb-3 min-h-0 flex-1 overflow-hidden">
              <Card className="h-full overflow-hidden rounded-xl border border-[#d3e2de] bg-[#fbfaf6] shadow-sm">
                <CardContent className="h-full overflow-hidden p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-lg bg-[#fff1d2] p-2">
                      <UserPlus className="h-4 w-4 text-[#b47700]" />
                    </div>
                    <h3 className="text-base font-semibold text-[#173f46]">
                      Inscrire un filleul
                    </h3>
                  </div>

                  {/* Ancien message de succès (maintenant désactivé car on utilise le modal) */}
                  {/* {isSuccess && (
                    <div className="mb-6 p-4 bg-wizi-muted/40 border border-wizi-accent/30 rounded-lg">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <svg
                                  className="h-5 w-5 text-wizi-muted"
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
                                <h3 className="text-sm font-medium text-wizi-muted">
                                  Filleul inscrit avec succès !
                                </h3>
                                <div className="mt-2 text-sm text-wizi-muted">
                                  <p>
                                    Le filleul a été inscrit avec succès. Vous recevrez
                                    50€ en carte cadeau une fois son inscription
                                    validée.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                  )} */}

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      type="hidden"
                      name="parrain_id"
                      value={formData.parrain_id}
                    />

                    <div className="grid grid-cols-1 gap-3">
                      {/* Civilité */}
                      <div>
                        <label
                          htmlFor="civilite"
                          className="mb-1 block text-xs font-semibold text-[#526b70]">
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
                              <span className="ml-2 text-xs text-[#526b70]">
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
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {/* Prénom */}
                        <div>
                          <label
                            htmlFor="prenom"
                            className="mb-1 block text-xs font-semibold text-[#526b70]">
                            Prénom
                          </label>
                          <input
                            type="text"
                            id="prenom"
                            name="prenom"
                            value={formData.prenom}
                            onChange={handleChange}
                            className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:ring-orange-500 ${
                              errors.prenom
                                ? "border-red-300"
                                : "border-gray-300"
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
                            className="mb-1 block text-xs font-semibold text-[#526b70]">
                            Nom
                          </label>
                          <input
                            type="text"
                            id="nom"
                            name="nom"
                            value={formData.nom}
                            onChange={handleChange}
                            className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:ring-orange-500 ${
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
                          className="mb-1 block text-xs font-semibold text-[#526b70]">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          id="telephone"
                          name="telephone"
                          value={formData.telephone}
                          onChange={handleChange}
                          className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:ring-orange-500 ${
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
                    <input
                      type="hidden"
                      name="statut"
                      value={formData.statut}
                    />

                    <div className="pt-1">
                      <button
                        type="submit"
                        disabled={submitting}
                        className={`flex w-full items-center justify-center rounded-lg border border-transparent bg-[#173f46] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#245963] focus:outline-none focus:ring-2 focus:ring-orange-500 ${
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
            <Card className="hidden rounded-xl border border-[#d3e2de] bg-[#eaf2f0] shadow-none xl:block">
              <CardContent className="p-3">
                <div className="mb-3 flex items-center gap-3">
                  <div className="bg-wizi-muted p-2 rounded-lg">
                    <ChevronRight className="h-5 w-5 text-wizi-muted" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#173f46]">
                    Comment ça marche ?
                  </h3>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                      <span className="text-xs font-bold text-[#b47700]">
                        1
                      </span>
                    </div>
                    <div>
                      <h4 className="mb-1 text-xs font-semibold text-[#173f46]">
                        Remplissez le formulaire
                      </h4>
                      <p className="text-[11px] leading-4 text-[#6b7773]">
                        Inscrivez la personne avec ses informations.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                      <span className="text-xs font-bold text-[#b47700]">
                        2
                      </span>
                    </div>
                    <div>
                      <h4 className="mb-1 text-xs font-semibold text-[#173f46]">
                        Contact commercial
                      </h4>
                      <p className="text-[11px] leading-4 text-[#6b7773]">
                        Un commercial le contacte pour ses choix de formation.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                      <span className="text-xs font-bold text-[#b47700]">
                        3
                      </span>
                    </div>
                    <div>
                      <h4 className="mb-1 text-xs font-semibold text-[#173f46]">
                        Validation des formations
                      </h4>
                      <p className="text-[11px] leading-4 text-[#6b7773]">
                        Le commercial valide les formations choisies.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                      <span className="text-xs font-bold text-[#b47700]">
                        4
                      </span>
                    </div>
                    <div>
                      <h4 className="mb-1 text-xs font-semibold text-[#173f46]">
                        Récompense de 50 €
                      </h4>
                      <p className="text-[11px] leading-4 text-[#6b7773]">
                        Vous recevez 50 € en carte cadeau pour chaque
                        inscription validée.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Image (Desktop only) */}
          <div className="order-1 hidden w-[36%] lg:block lg:order-2">
            <div className="h-full">
              <div className="flex h-full flex-col justify-center rounded-2xl border border-[#d3e2de] bg-[#eaf2f0] p-5 shadow-sm">
                <img
                  src={image}
                  alt="Programme de parrainage"
                  className="h-auto max-h-[42vh] w-full rounded-lg object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de succès */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        filleulName={filleulName}
      />
    </>
  );
};

export default ParrainageSection;
