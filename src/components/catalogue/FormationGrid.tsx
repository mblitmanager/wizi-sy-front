
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Calendar } from "lucide-react";
import type { Formation } from '@/types';
import SkeletonCard from '../ui/SkeletonCard';

interface FormationGridProps {
  formations: Formation[];
  isLoading?: boolean;
}

export function FormationGrid({ formations, isLoading }: FormationGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }
  
  if (formations.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-medium">Aucune formation trouvée</h3>
        <p className="text-muted-foreground">Essayez un autre filtre ou revenir plus tard.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {formations.map((formation) => (
        <Card key={formation.id} className="flex flex-col hover:shadow-md transition-shadow">
          <CardHeader className="pb-2" style={{ 
            backgroundColor: formation.category?.color || "#9b87f5",
            color: "#fff"
          }}>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{formation.title || formation.titre}</CardTitle>
              {formation.category && (
                <Badge variant="outline" className="bg-white/20">
                  {formation.category.name}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="py-4 flex-1">
            <CardDescription className="line-clamp-3 mb-4 text-foreground/70">
              {formation.description}
            </CardDescription>
            {(formation.startDate || formation.duree) && (
              <div className="flex flex-col gap-2 text-sm">
                {formation.duree && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{formation.duree}</span>
                  </div>
                )}
                {formation.startDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formation.startDate}</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-0">
            <Button asChild className="w-full">
              <Link to={`/formation/${formation.id}`}>
                Voir les détails
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
