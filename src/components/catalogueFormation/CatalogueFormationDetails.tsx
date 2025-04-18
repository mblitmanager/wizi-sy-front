import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
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

export default function CatalogueFormationDetails() {
  const { id } = useParams();
  interface CatalogueFormationDetailsType {
    titre: string;
    prerequis?: string;
    description: string;
    categorie?: string;
    imageUrl?: string;
  }

  const [details, setDetails] = useState<CatalogueFormationDetailsType | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      catalogueFormationApi
        .getCatalogueFometionById(Number(id))
        .then((response) => {
          setDetails(response.data as CatalogueFormationDetailsType);
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
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Chargement en cours...
      </div>
    );
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

  const imageUrl = details.imageUrl
    ? `${import.meta.env.VITE_API_URL_IMG}/${details.imageUrl}`
    : "/default-image.jpg";

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <img
            src={imageUrl}
            alt={details.titre}
            className="h-full w-full object-cover md:col-span-1"
          />
          <div className="md:col-span-2 p-6 space-y-4">
            <CardHeader className="p-0 space-y-1">
              <CardTitle className="text-2xl font-bold">
                {details.titre}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {details.prerequis
                  ? `Pré-requis : ${details.prerequis}`
                  : "Aucun pré-requis"}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0 text-gray-700 dark:text-gray-300">
              <p className="text-base leading-relaxed">{details.description}</p>
            </CardContent>

            <div className="pt-4">
              <Badge variant="outline" className="text-sm">
                Catégorie : {details.categorie || "Non spécifiée"}
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
