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
import {
  BUREAUTIQUE,
  CATALOGUE_FORMATION_DETAILS,
  CREATION,
  INTERNET,
  LANGUES,
  RETOUR,
} from "@/utils/langue-type";
import HeaderSection from "../features/HeaderSection";
import SkeletonCard from "../ui/SkeletonCard";
import { Layout } from "../layout/Layout";
import { stripHtmlTags } from "@/utils/UtilsFunction";

export default function CatalogueFormationDetails() {
  const { id } = useParams();
  interface CatalogueFormationDetailsType {
    catalogueFormation: {
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
        categorie?: string;
      };
    };
  }

  const [details, setDetails] = useState<CatalogueFormationDetailsType | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCategoryColor = useCallback((category?: string): string => {
    switch (category) {
      case BUREAUTIQUE:
        return "#3D9BE9";
      case LANGUES:
        return "#A55E6E";
      case INTERNET:
        return "#FFC533";
      case CREATION:
        return "#9392BE";
      default:
        return "#E0E0E0";
    }
  }, []);

  useEffect(() => {
    if (id) {
      // Use the correct method based on what's available in the API
      catalogueFormationApi
        .getFormationDetails(id)
        .then((response) => {
          setDetails(response as CatalogueFormationDetailsType);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching details:", err);
          setError("Une erreur s'est produite lors du chargement des données.");
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <SkeletonCard />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center text-red-500 gap-2">
        <AlertTriangle className="w-5 h-5" />
        {error}
      </div>
    );
  }

  if (!details) {
    return <div>Aucune donnée disponible pour cette formation.</div>;
  }

  // Déterminer le type de média (image, vidéo ou audio)
  const url = details.catalogueFormation.image_url || "";
  let mediaElement;
  if (url.endsWith(".mp4")) {
    mediaElement = (
      <video
        controls
        className="h-full w-full object-cover md:col-span-1 rounded-lg"
      >
        <source
          src={`${import.meta.env.VITE_API_URL_IMG}/${url}`}
          type="video/mp4"
        />
        Votre navigateur ne supporte pas la lecture de vidéos.
      </video>
    );
  } else if (url.endsWith(".mp3")) {
    mediaElement = (
      <audio controls className="w-full md:col-span-1 rounded-lg">
        <source
          src={`${import.meta.env.VITE_API_URL_IMG}/${url}`}
          type="audio/mp3"
        />
        Votre navigateur ne supporte pas la lecture d'audios.
      </audio>
    );
  } else {
    mediaElement = (
      <img
        src={`${import.meta.env.VITE_API_URL_IMG}/${url}`}
        alt={details.catalogueFormation.titre}
        className="h-full w-full object-cover md:col-span-1 rounded-lg"
      />
    );
  }

  console.log(details);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <HeaderSection
          titre={CATALOGUE_FORMATION_DETAILS}
          buttonText={RETOUR}
        />

        {/* Bloc secondaire : infos pédagogiques de la formation liée */}
        {details.catalogueFormation.formation && (
          <div className="mt-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Domaine de formation :{" "}
              {details.catalogueFormation.formation.titre}
            </h2>
            <Card className="p-6">
              <p className="text-gray-500 dark:text-gray-500 mb-2">
                {stripHtmlTags(
                  details.catalogueFormation.formation.description
                )}
              </p>
            </Card>
          </div>
        )}
        <Card className="overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Affichage du média (image, vidéo ou audio) */}
            {mediaElement}
            <div className="md:col-span-2 p-6 space-y-4">
              <CardHeader className="p-0 space-y-1">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {details.catalogueFormation.titre}
                </CardTitle>
                <CardDescription className="text-gray-700">
                  {details.catalogueFormation.prerequis
                    ? `Pré-requis : ${details.catalogueFormation.prerequis}`
                    : "Aucun pré-requis"}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0 text-gray-700 dark:text-gray-300 space-y-2">
                <p className="text-base leading-relaxed">
                  {details.catalogueFormation.description.replace(
                    /<[^>]*>/g,
                    ""
                  )}
                </p>

                <ul className="text-sm space-y-1">
                  <li className="text-gray-500">
                    <strong>Durée :</strong> {details.catalogueFormation.duree}{" "}
                    heures
                  </li>
                  <li className="text-gray-500">
                    <strong>Tarif :</strong> {details.catalogueFormation.tarif}{" "}
                    € HT
                  </li>
                  <li className="text-gray-500">
                    <strong>Certification :</strong>{" "}
                    {details.catalogueFormation.certification}
                  </li>
                </ul>
              </CardContent>

              <div className="pt-4">
                <Badge
                  variant="outline"
                  className="text-sm"
                  style={{
                    backgroundColor: getCategoryColor(
                      details.catalogueFormation.formation?.categorie
                    ),
                    color: "#fff", // Couleur du texte pour un bon contraste
                  }}
                >
                  Catégorie :{" "}
                  {details.catalogueFormation.formation?.categorie ||
                    "Non spécifiée"}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
