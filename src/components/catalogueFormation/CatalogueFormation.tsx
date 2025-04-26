import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, BookOpen } from "lucide-react";
import { CatalogueFormationResponse, Formation } from "@/types/stagiaire";
import {
  CATALOGUE_FORMATION,
  EN_COURS,
  VOIR_LES_DETAILS,
} from "@/utils/langue-type";
const VITE_API_URL_IMG = import.meta.env.VITE_API_URL_IMG;

export default function CatalogueFormation({
  catalogueData,
}: {
  catalogueData: CatalogueFormationResponse;
}) {
  const navigate = useNavigate();

  return (
    <div className="mb-8 p-4 bg-background rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">{CATALOGUE_FORMATION}</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {catalogueData.stagiaire.formations.map((formation: Formation) => {
          return Array.isArray(formation.catalogue_formation)
            ? formation.catalogue_formation.map((catalogue) => {
                const progress = Math.floor(Math.random() * 100); // Remplacer par une vraie donnée
                const isInProgress = progress > 0;
                const image = catalogue.image_url
                  ? `${VITE_API_URL_IMG}/${catalogue.image_url}`
                  : "/default-image.jpg";

                return (
                  <Card
                    key={`${formation.id}-${catalogue.id}`}
                    className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                    <div className="relative h-40">
                      <img
                        src={image}
                        alt={catalogue.titre}
                        className="w-full h-full object-cover"
                      />
                      {isInProgress && (
                        <div className="absolute top-2 left-2">
                          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                            {EN_COURS}
                          </span>
                        </div>
                      )}
                    </div>

                    <CardHeader className="p-4">
                      <CardTitle className="text-xl font-semibold flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        {catalogue.titre}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground mt-2">
                        {isInProgress
                          ? "Continuez votre apprentissage"
                          : "Commencez cette formation"}
                      </CardDescription>
                    </CardHeader>

                    {isInProgress && (
                      <div className="px-4 pb-2">
                        <Progress value={progress} className="h-2" />
                        <p className="text-sm text-muted-foreground mt-1">
                          {progress}% complété
                        </p>
                      </div>
                    )}

                    <CardFooter className="p-4 pt-0">
                      <Button
                        className="w-full flex items-center justify-center gap-2"
                        variant={isInProgress ? "default" : "outline"}
                        onClick={() =>
                          navigate(`/catalogue_formation/${catalogue.id}`)
                        }>
                        {VOIR_LES_DETAILS} <ArrowRight className="w-4 h-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })
            : null;
        })}
      </div>
    </div>
  );
}
