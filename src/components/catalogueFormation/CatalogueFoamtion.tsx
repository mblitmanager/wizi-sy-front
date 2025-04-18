import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"; // Remplacez par le bon chemin
import { Button } from "../ui/button"; // Remplacez par le bon chemin
import { Formation, CatalogueFormationResponse } from "@/types/stagiaire";
import { Progress } from "../ui/progress";
import { ArrowRight, Badge, BookOpen } from "lucide-react";

const VITE_API_URL_IMG = process.env.VITE_API_URL_IMG;

export default function CatalogueFormation({
  catalogueData,
}: {
  catalogueData: CatalogueFormationResponse;
}) {
  const navigate = useNavigate();

  return (
    <div className="mb-8 p-4 bg-background rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Catalogue de Formations</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {catalogueData.stagiaire.formations.map((formation: Formation) => {
          const progress = Math.floor(Math.random() * 100); // À remplacer par une vraie donnée
          const image = formation.catalogue_formation?.image_url
            ? `${VITE_API_URL_IMG}/${formation.catalogue_formation.image_url}`
            : "/default-image.jpg";

          const isInProgress = progress > 0;

          return (
            <Card
              key={formation.id}
              className="overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="relative h-40">
                <img
                  src={image}
                  alt={formation.titre}
                  className="w-full h-full object-cover"
                />
                {isInProgress && (
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary">En cours</Badge>
                  </div>
                )}
              </div>

              <CardHeader className="p-4">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  {formation.titre}
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
                    navigate(
                      `/catalogue_formation/${formation.catalogue_formation.id}`
                    )
                  }>
                  Voir les détails <ArrowRight className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
