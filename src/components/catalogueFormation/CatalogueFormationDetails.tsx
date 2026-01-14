import { useNavigate, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActionTooltip } from "../ui/action-tooltip";
import { toast } from "sonner";
import { Loader2, AlertTriangle, X, CheckCircle, Share2 } from "lucide-react";
import { catalogueFormationApi } from "@/services/api";
import { inscrireAFormation } from "@/services/inscriptionApi";
import {
  BUREAUTIQUE,
  CATALOGUE_FORMATION_DETAILS,
  CATEGORIES,
  CREATION,
  FORMATIONMETADATA,
  INTERNET,
  LANGUES,
  IA,
  RETOUR,
} from "@/utils/constants";
import HeaderSection from "../features/HeaderSection";
import SkeletonCard from "../ui/SkeletonCard";
import { Layout } from "../layout/Layout";
import { stripHtmlTags } from "@/utils/UtilsFunction";
import DownloadPdfButton from "../FeatureHomePage/DownloadPdfButton";
import { Button } from "@/components/ui/button";

interface CatalogueFormationDetailsType {
  catalogueFormation: {
    id: number;
    titre: string;
    description: string;
    prerequis?: string;
    tarif?: string;
    certification?: string;
    duree?: string;
    image_url?: string;
    imageUrl?: string;
    objectifs?: string;
    programme?: string;
    modalites?: string;
    modalites_accompagnement?: string;
    moyens_pedagogiques?: string;
    modalites_suivi?: string;
    evaluation?: string;
    lieu?: string;
    niveau?: string;
    public_cible?: string;
    nombre_participants?: number | null;
    cursus_pdf?: string | null;
    cursusPdfUrl?: string | null;
    formation?: {
      titre: string;
      description: string;
      categorie?: CATEGORIES;
      image_url?: string;
      image?: string;
    };
  };
}

// Composant Modal pour le succès de l'inscription
interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  formationTitle: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  message,
  formationTitle,
}) => {
  const navigate = useNavigate();
  if (!isOpen) return null;
  const handleClick = () => {
    // Fermer le modal d'abord
    onClose();
    // Puis rediriger vers le catalogue
    navigate("/catalogue");
  };
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
              Demande d'inscription envoyée avec succès !
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
          <p className="text-gray-700 mb-3">
            Votre demande d'inscription a été envoyée pour la formation :{" "}
          </p>
          <p className="font-semibold text-gray-900 mb-4 text-center bg-gray-50 py-2 px-4 rounded-lg">
            {formationTitle}
          </p>
          <div className="bg-wizi-muted/60 border border-wizi-accent/30 rounded-lg p-4">
            <p className="text-wizi-muted text-sm text-center">{message}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleClick}
            className="flex-1 bg-gray-900 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
            Continuer à explorer
          </button>
        </div>
      </div>
    </div>
  );
};

export default function CatalogueFormationDetails() {
  const { id } = useParams();

  const [details, setDetails] = useState<CatalogueFormationDetailsType | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inscriptionLoading, setInscriptionLoading] = useState(false);
  const [inscriptionSuccess, setInscriptionSuccess] = useState<string | null>(
    null
  );
  const [inscriptionError, setInscriptionError] = useState<string | null>(null);

  // États pour le modal de succès
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const getCategoryColor = useCallback((category?: CATEGORIES): string => {
    switch (category) {
      case CATEGORIES.BUREAUTIQUE:
        return "#3D9BE9";
      case CATEGORIES.LANGUES:
        return "#A55E6E";
      case CATEGORIES.INTERNET:
        return "#FFC533";
      case CATEGORIES.CREATION:
        return "#9392BE";
      case CATEGORIES.IA:
        return "#ABDA96";
      default:
        return "#E0E0E0";
    }
  }, []);

  const getCategoryFromFormation = (f: CatalogueFormationDetailsType["catalogueFormation"]): string => {
    if (!f) return "";
    return f.formation?.categorie || (f as any).categorie || "";
  };

  const getCategoryBadgeText = (f: CatalogueFormationDetailsType["catalogueFormation"]): string => {
    const cat = getCategoryFromFormation(f);
    return cat ? `Catégorie : ${cat}` : "Catégorie : Non spécifiée";
  };

  const fetchFormationDetails = useCallback(async () => {
    if (!id) return;

    try {
      const response = await catalogueFormationApi.getFormationDetails(id);
      
      // Handle Node backend structure where data is wrapped in catalogueFormation
      let formationData = response;
      let pdfUrlResponse = null;

      if (response && response.catalogueFormation) {
        formationData = response.catalogueFormation;
        pdfUrlResponse = response.cursusPdfUrl;
      }

      const wrappedData: CatalogueFormationDetailsType = {
        catalogueFormation: {
          ...formationData,
          // Ensure we have a valid PDF URL
          cursusPdfUrl: pdfUrlResponse || formationData.cursusPdfUrl || 
                        (formationData.cursus_pdf ? `${import.meta.env.VITE_API_URL_IMG}/${formationData.cursus_pdf}` : null)
        },
      };
      setDetails(wrappedData);
    } catch (err) {
      console.error("Error fetching details:", err);
      setError("Une erreur s'est produite lors du chargement des données.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchFormationDetails();
  }, [fetchFormationDetails]);

  const handleInscription = async () => {
    if (!details) return;

    setInscriptionLoading(true);
    setInscriptionSuccess(null);
    setInscriptionError(null);

    try {
      const response = await inscrireAFormation(details.catalogueFormation.id);

      // Afficher le modal de succès avec le message de l'API
      setSuccessMessage(
        response.message ||
          "Inscription réussie, mails et notification envoyés."
      );
      setShowSuccessModal(true);
      setInscriptionSuccess("Inscription réussie !");
    } catch (e) {
      setInscriptionError("Erreur lors de l'inscription. Veuillez réessayer.");
    } finally {
      setInscriptionLoading(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setSuccessMessage("");
  };

  const handleShare = () => {
    if (!details) return;
    
    const formation = details.catalogueFormation;
    const shareData = {
      title: formation.titre,
      text: `Découvrez la formation "${formation.titre}" sur Wizi Learn!\n\n${stripHtmlTags(formation.description || "").substring(0, 150)}...`,
      url: window.location.origin + `/catalogue-formation/${formation.id}`,
    };

    if (navigator.share) {
      navigator.share(shareData).catch((err) => {
        console.error("Error sharing:", err);
      });
    } else {
      navigator.clipboard.writeText(shareData.url);
      toast.success("Lien de la formation copié !");
    }
  };

  const getFullUrl = (url: string | undefined, type: 'media' | 'img' = 'media') => {
    if (!url) return "";
    if (url.startsWith('http')) return url;
    
    // Some URLs might already have storage/ prefix
    const baseUrl = type === 'img' ? import.meta.env.VITE_API_URL_IMG : import.meta.env.VITE_API_URL_MEDIA;
    
    if (url.startsWith('storage/')) {
        // VITE_API_URL_IMG often includes /storage, so avoid double storage
        if (type === 'img') {
            return `${import.meta.env.VITE_API_URL_MEDIA}/${url}`;
        }
    }
    
    return `${baseUrl}/${url}`;
  };

  const renderMediaElement = () => {
    const formation = details?.catalogueFormation;
    const url = formation?.image_url || formation?.formation?.image_url || formation?.formation?.image || "";

    if (!url) {
        return (
            <div className="h-full w-full bg-gray-100 flex items-center justify-center rounded-lg">
                <AlertTriangle className="w-12 h-12 text-gray-300" />
            </div>
        );
    }

    if (url.endsWith(".mp4")) {
      return (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover md:col-span-1 rounded-lg">
          <source
            src={getFullUrl(url, 'img')}
            type="video/mp4"
          />
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>
      );
    }

    if (url.endsWith(".mp3")) {
      return (
        <audio controls className="w-full md:col-span-1 rounded-lg">
          <source
            src={getFullUrl(url, 'media')}
            type="audio/mp3"
          />
          Votre navigateur ne supporte pas la lecture d'audios.
        </audio>
      );
    }

    return (
      <img
        src={getFullUrl(url, 'media')}
        alt={details?.catalogueFormation.titre}
        className="h-full w-full object-contain md:col-span-1 rounded-lg"
        onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder-formation.png";
        }}
      />
    );
  };

  if (loading) return <SkeletonCard />;
  if (error) return <ErrorDisplay message={error} />;
  if (!details) return <NoDataAvailable />;

  const currentCategory = getCategoryFromFormation(details.catalogueFormation) as unknown as CATEGORIES;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="relative inline-block text-3xl md:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 drop-shadow-md">
            <span className="relative z-10 text-orange-400">
              {details.catalogueFormation.titre}
            </span>
            {/* petite barre décorative en dessous */}
            <span className="absolute left-1/2 -bottom-2 h-1 w-16 -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400"></span>
          </h2>
          <div className="flex items-center gap-2">
            <ActionTooltip label="Partager cette formation">
              <Button
                variant="outline"
                size="icon"
                className="border-orange-200 text-orange-600 hover:bg-orange-50"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </ActionTooltip>
            <Button onClick={() => window.history.back()}>{RETOUR}</Button>
          </div>
        </div>

        {details.catalogueFormation.formation && (
          <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-yellow-50 to-white dark:from-gray-900 dark:to-gray-800 shadow-md mb-2">
            <div
              className="text-gray-700 dark:text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  details.catalogueFormation.formation.description || ""
                ),
              }}
            />
          </div>
        )}

        <Card className="overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* HERO / Media column (left on desktop) */}
            <div className="relative md:col-span-1 h-64 md:h-auto">
              {/* media element fills the hero */}
              <div className="absolute inset-0">
                {renderMediaElement()}
                {/* dark overlay for readability */}
                {/* <div className="absolute inset-0 bg-black/25" /> */}
              </div>

              {/* Price badge - overlayed bottom-left */}
              <div className="absolute left-4 bottom-4">
              </div>

              {/* Category chip - overlayed top-left */}
              <div className="absolute left-4 top-4">
                {(() => {
                  const catString = getCategoryFromFormation(details.catalogueFormation);
                  const suffix = catString ? catString.toLowerCase() : "";
                  return (
                    <span
                      className={`inline-block text-sm font-medium px-3 py-1 rounded ${
                        suffix ? `badge-${suffix}` : "bg-gray-200"
                      }`}>
                      {getCategoryBadgeText(details.catalogueFormation)}
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Details column */}
            <FormationDetailsContent
              formation={details.catalogueFormation}
              category={currentCategory}
              onInscription={handleInscription}
              inscriptionLoading={inscriptionLoading}
              inscriptionSuccess={inscriptionSuccess}
              inscriptionError={inscriptionError}
              getCategoryColor={getCategoryColor}
            />
          </div>
        </Card>
      </div>

      {/* Modal de succès */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        message={successMessage}
        formationTitle={details.catalogueFormation.titre}
      />
    </Layout>
  );
}

// Composants supplémentaires pour mieux organiser le code
const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center text-red-500 gap-2">
    <AlertTriangle className="w-5 h-5" />
    {message}
  </div>
);

const NoDataAvailable = () => (
  <div>Aucune donnée disponible pour cette formation.</div>
);

// const FormationInfoSection = ({
//   title,
//   description,
// }: {
//   title: string;
//   description: string;
// }) => (
//   <div className="mt-12 mb-12 text-center">
//     <h2 className="relative inline-block text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-wizi-accent drop-shadow-md">
//       <span className="relative z-10 text-orange-400">{title}</span>
//       {/* petite barre décorative en dessous */}
//       <span className="absolute left-1/2 -bottom-2 h-1 w-16 -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-400 to-wizi-accent"></span>
//     </h2>
//     <div className="mt-6 p-5 rounded-2xl bg-wizi-muted dark:from-gray-900 dark:to-gray-800 shadow-md">
//       <div className="text-gray-700 dark:text-gray-300 leading-relaxed"
//         dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description || "") }}
//       />
//     </div>
//   </div>
// );

interface FormationDetailsContentProps {
  formation: CatalogueFormationDetailsType["catalogueFormation"];
  category?: CATEGORIES;
  onInscription: () => void;
  inscriptionLoading: boolean;
  inscriptionSuccess: string | null;
  inscriptionError: string | null;
  getCategoryColor: (category?: CATEGORIES) => string;
}

const FormationDetailsContent = ({
  formation,
  category,
  onInscription,
  inscriptionLoading,
  inscriptionSuccess,
  inscriptionError,
  getCategoryColor,
}: FormationDetailsContentProps) => {
  const rawCat = category as unknown as string | undefined;
  const suffix = rawCat ? rawCat.toLowerCase() : "";

  return (
    <div className="md:col-span-2 p-6 space-y-4">
      <CardHeader className="p-0 space-y-1">
        {/* <CardTitle className="text-2xl font-bold text-orange-400">
          {formation.formation.titre}
        </CardTitle> */}
        <CardDescription className="text-gray-700">
          {formation.prerequis ? (
            <span>
              <strong>Pré-requis</strong> : {formation.prerequis}
            </span>
          ) : (
            "Aucun pré-requis"
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 text-gray-700 dark:text-gray-300 space-y-2">
        <div
          className="text-gray-700 dark:text-gray-300 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(formation.description || ""),
          }}
        />

        {/* Info tiles row - mirror Flutter info tiles with category color */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="text-xs text-gray-500">Durée</div>
            <div
              className="font-semibold"
              style={{ color: getCategoryColor(category) }}>
              {formation.duree || "-"} heures
            </div>
          </div>

          {/* <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="text-xs text-gray-500">Certification</div>
            <div
              className="font-semibold"
              style={{ color: getCategoryColor(category) }}>
              {formation.certification || "-"}
            </div>
          </div> */}
        </div>
      </CardContent>

      <div className="space-y-4">
        {/* Afficher le PDF du cursus si fourni (backend doit exposer cursusPdfUrl) */}
        {formation.cursusPdfUrl ? (
          <a
            href={formation.cursusPdfUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block text-sm text-blue-600 underline">
            Télécharger le programme / cursus (PDF)
          </a>
        ) : (
          <DownloadPdfButton formationId={formation.id} />
        )}
        {/* Objectifs et programme (si présents) */}
        {formation.objectifs && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Objectifs</h3>
            <div
              className="mt-2 text-gray-700"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(formation.objectifs || ""),
              }}
            />
          </div>
        )}

        {formation.programme && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Programme</h3>
            <div
              className="mt-2 text-gray-700"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(formation.programme || ""),
              }}
            />
          </div>
        )}

        {/* Détails supplémentaires : modalités, moyens, évaluation, lieu, niveau, public */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {formation.modalites && (
            <div className="p-3 rounded-lg bg-gray-50">
              <strong>Modalités</strong>
              <div
                className="text-sm mt-1"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(formation.modalites || ""),
                }}
              />
            </div>
          )}

          {formation.modalites_accompagnement && (
            <div className="p-3 rounded-lg bg-gray-50">
              <strong>Modalités d'accompagnement</strong>
              <div
                className="text-sm mt-1"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    formation.modalites_accompagnement || ""
                  ),
                }}
              />
            </div>
          )}

          {formation.moyens_pedagogiques && (
            <div className="p-3 rounded-lg bg-gray-50">
              <strong>Moyens pédagogiques</strong>
              <div
                className="text-sm mt-1"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    formation.moyens_pedagogiques || ""
                  ),
                }}
              />
            </div>
          )}

          {formation.evaluation && (
            <div className="p-3 rounded-lg bg-gray-50">
              <strong>Évaluation</strong>
              <div
                className="text-sm mt-1"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(formation.evaluation || ""),
                }}
              />
            </div>
          )}

          {formation.lieu && (
            <div className="p-3 rounded-lg bg-gray-50">
              <strong>Lieu</strong>
              <div className="text-sm mt-1">{formation.lieu}</div>
            </div>
          )}

          {formation.niveau && (
            <div className="p-3 rounded-lg bg-gray-50">
              <strong>Niveau</strong>
              <div className="text-sm mt-1">{formation.niveau}</div>
            </div>
          )}

          {formation.public_cible && (
            <div className="p-3 rounded-lg bg-gray-50">
              <strong>Public cible</strong>
              <div className="text-sm mt-1">{formation.public_cible}</div>
            </div>
          )}

          {formation.nombre_participants !== undefined &&
            formation.nombre_participants !== null && (
              <div className="p-3 rounded-lg bg-gray-50">
                <strong>Nombre participants</strong>
                <div className="text-sm mt-1">
                  {formation.nombre_participants}
                </div>
              </div>
            )}
        </div>

        <InscriptionSection
          onInscription={onInscription}
          loading={inscriptionLoading}
          success={inscriptionSuccess}
          error={inscriptionError}
          category={category}
        />
      </div>
    </div>
  );
};

const FormationMetadata = ({
  duree,
  tarif,
  certification,
}: {
  duree?: string;
  tarif?: string;
  certification?: string;
}) => (
  <ul className="text-sm space-y-1">
    <li className="text-gray-500">
      <strong>{FORMATIONMETADATA.duree} :</strong> {duree}{" "}
      {FORMATIONMETADATA.heures}
    </li>
    {/* <li className="text-gray-500">
      <strong>{FORMATIONMETADATA.tarif} :</strong>{" "}
      <span className="text-xl text-orange-500 font-extrabold drop-shadow-lg">
        {tarif
          ? `${Number(tarif)
              .toLocaleString("fr-FR", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
              .replace(/\u202F/g, " ")} ${FORMATIONMETADATA.euros}`
          : "-"}
      </span>
    </li> */}
    {/* <li className="text-gray-500">
      <strong>Certification :</strong> {certification}
    </li> */}
  </ul>
);

const InscriptionSection = ({
  onInscription,
  loading,
  success,
  error,
  category,
}: {
  onInscription: () => void;
  loading: boolean;
  success: string | null;
  error: string | null;
  category?: CATEGORIES;
}) => (
  <div className="pt-2">
    <Button
      onClick={onInscription}
      disabled={loading}
      className="w-full md:w-auto bg-black">
      {loading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Inscription en cours...
        </span>
      ) : (
        "S'inscrire à la formation"
      )}
    </Button>
  {success && <div className="text-wizi-muted mt-2 text-sm">{success}</div>}
    {error && <div className="text-red-600 mt-2 text-sm">{error}</div>}
  </div>
);
