// components/CatalogueFormationSection.tsx
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { BookOpen, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import React from "react";
import SkeletonCard from "../ui/SkeletonCard";
import {
  CatalogueFormation,
  CatalogueFormationResponse,
} from "@/types/stagiaire";

interface CatalogueFormationSectionProps {
  CATALOGUE_FORMATION: string;
  catalogueData: CatalogueFormation[] | null;
  isLoading: boolean;
  VITE_API_URL_IMG: string;
}

export default function CatalogueFormationSection({
  CATALOGUE_FORMATION,
  catalogueData,
  isLoading,
  VITE_API_URL_IMG,
}: CatalogueFormationSectionProps) {
  const navigate = useNavigate();

  return (
    <div className="mb-8 p-4 bg-card rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-yellow-400">
          {CATALOGUE_FORMATION}
        </h2>
        <Link to="/formations">
          <Button variant="ghost" className="text-blue-400" size="sm">
            Voir tous <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <SkeletonCard />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {catalogueData &&
            catalogueData.map((catalogue) => {
              const progress = Math.floor(Math.random() * 100);
              const isInProgress = progress > 0;
              const image = catalogue.image_url
                ? `${VITE_API_URL_IMG}/${catalogue.image_url}`
                : "/default-image.jpg";

              return (
                <Card
                  key={catalogue.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
                  <div className="relative h-40">
                    <img
                      src={image}
                      alt={catalogue.titre}
                      className="w-full h-full object-cover"
                    />
                    {isInProgress && (
                      <div className="absolute top-2 left-2">
                        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                          EN COURS
                        </span>
                      </div>
                    )}
                  </div>

                  <CardHeader className="p-4">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      {catalogue.titre}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {isInProgress
                        ? "Continuez votre apprentissage"
                        : "Commencez cette formation"}
                    </CardDescription>
                  </CardHeader>

                  {isInProgress && (
                    <div className="px-4 pb-2">
                      <Progress value={progress} className="h-2 rounded-full" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {progress}% complété
                      </p>
                    </div>
                  )}

                  <CardFooter className="p-4 pt-0 mt-auto">
                    <Button
                      className="w-full flex items-center justify-center gap-2"
                      variant={isInProgress ? "default" : "outline"}
                      onClick={() =>
                        navigate(
                          `/catalogue_formation/${catalogue.formation_id}`
                        )
                      }>
                      VOIR LES DÉTAILS <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
        </div>
      )}
    </div>
  );
}
