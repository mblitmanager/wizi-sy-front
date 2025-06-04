import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertTriangle } from "lucide-react";
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
    formation?: {
      titre: string;
      description: string;
      categorie?: CATEGORIES;
    };
  };
}

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
      default:
        return "#E0E0E0";
    }
  }, []);

  const getCategoryBadgeText = (category?: CATEGORIES): string => {
    return category ? `Catégorie : ${category}` : "Catégorie : Non spécifiée";
  };

  const fetchFormationDetails = useCallback(async () => {
    if (!id) return;

    try {
      const response = await catalogueFormationApi.getFormationDetails(id);
      setDetails(response as CatalogueFormationDetailsType);
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
      await inscrireAFormation(details.catalogueFormation.id);
      setInscriptionSuccess("Inscription réussie !");
    } catch (e) {
      setInscriptionError("Erreur lors de l'inscription. Veuillez réessayer.");
    } finally {
      setInscriptionLoading(false);
    }
  };

  const renderMediaElement = () => {
    const url = details?.catalogueFormation.image_url || "";

    if (url.endsWith(".mp4")) {
      return (
        <video
          controls
          className="h-full w-full object-cover md:col-span-1 rounded-lg">
          <source
            src={`${import.meta.env.VITE_API_URL_IMG}/${url}`}
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
            src={`${import.meta.env.VITE_API_URL_MEDIA}/${url}`}
            type="audio/mp3"
          />
          Votre navigateur ne supporte pas la lecture d'audios.
        </audio>
      );
    }

    return (
      <img
        src={`${import.meta.env.VITE_API_URL_MEDIA}/${url}`}
        alt={details?.catalogueFormation.titre}
        className="h-full w-full object-contain md:col-span-1 rounded-lg"
      />
    );
  };

  if (loading) return <SkeletonCard />;
  if (error) return <ErrorDisplay message={error} />;
  if (!details) return <NoDataAvailable />;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <HeaderSection
          titre={CATALOGUE_FORMATION_DETAILS}
          buttonText={RETOUR}
        />

        {details.catalogueFormation.formation && (
          <FormationInfoSection
            title={details.catalogueFormation.formation.titre}
            description={details.catalogueFormation.formation.description}
          />
        )}

        <Card className="overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {renderMediaElement()}

            <FormationDetailsContent
              formation={details.catalogueFormation}
              category={details.catalogueFormation.formation?.categorie}
              onInscription={handleInscription}
              inscriptionLoading={inscriptionLoading}
              inscriptionSuccess={inscriptionSuccess}
              inscriptionError={inscriptionError}
              getCategoryColor={getCategoryColor}
              getCategoryBadgeText={getCategoryBadgeText}
            />
          </div>
        </Card>
      </div>
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

const FormationInfoSection = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="mt-8 mb-8">
    <h2 className="text-2xl font-semibold mb-4 text-brown-shade">{title}</h2>
    <div className="p-3 border-b-2 border-yellow-shade">
      <p className="text-gray-800 dark:text-gray-500 mb-2">
        {stripHtmlTags(description)}
      </p>
    </div>
  </div>
);

interface FormationDetailsContentProps {
  formation: CatalogueFormationDetailsType["catalogueFormation"];
  category?: CATEGORIES;
  onInscription: () => void;
  inscriptionLoading: boolean;
  inscriptionSuccess: string | null;
  inscriptionError: string | null;
  getCategoryColor: (category?: CATEGORIES) => string;
  getCategoryBadgeText: (category?: CATEGORIES) => string;
}

const FormationDetailsContent = ({
  formation,
  category,
  onInscription,
  inscriptionLoading,
  inscriptionSuccess,
  inscriptionError,
  getCategoryColor,
  getCategoryBadgeText,
}: FormationDetailsContentProps) => (
  <div className="md:col-span-2 p-6 space-y-4">
    <CardHeader className="p-0 space-y-1">
      <CardTitle className="text-2xl font-bold text-orange-400">
        {formation.titre}
      </CardTitle>
      <CardDescription className="text-gray-700">
        {formation.prerequis
          ? `Pré-requis : ${formation.prerequis}`
          : "Aucun pré-requis"}
      </CardDescription>
    </CardHeader>

    <CardContent className="p-0 text-gray-700 dark:text-gray-300 space-y-2">
      <p className="text-base leading-relaxed">
        {formation.description.replace(/<[^>]*>/g, "")}
      </p>

      <FormationMetadata
        duree={formation.duree}
        tarif={formation.tarif}
        certification={formation.certification}
      />
    </CardContent>

    <div className="pt-4">
      <Badge
        variant="outline"
        className="text-sm"
        style={{
          backgroundColor: getCategoryColor(category),
          color: "#fff",
        }}>
        {getCategoryBadgeText(category)}
      </Badge>
    </div>

    <DownloadPdfButton formationId={formation.id} />

    <InscriptionSection
      onInscription={onInscription}
      loading={inscriptionLoading}
      success={inscriptionSuccess}
      error={inscriptionError}
    />
  </div>
);

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
    <li className="text-gray-500">
      <strong>{FORMATIONMETADATA.tarif} :</strong>{" "}
      <span className="text-xl text-orange-500 font-extrabold drop-shadow-lg">
        {tarif} {FORMATIONMETADATA.euros}
      </span>
    </li>
    <li className="text-gray-500">
      <strong>Certification :</strong> {certification}
    </li>
  </ul>
);

const InscriptionSection = ({
  onInscription,
  loading,
  success,
  error,
}: {
  onInscription: () => void;
  loading: boolean;
  success: string | null;
  error: string | null;
}) => (
  <div className="pt-2">
    <Button
      onClick={onInscription}
      disabled={loading}
      className="w-full md:w-auto bg-brown-shade">
      {loading ? "Inscription en cours..." : "S'inscrire à la formation"}
    </Button>
    {success && <div className="text-green-600 mt-2 text-sm">{success}</div>}
    {error && <div className="text-red-600 mt-2 text-sm">{error}</div>}
  </div>
);
