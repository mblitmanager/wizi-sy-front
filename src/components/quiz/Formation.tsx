import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronDown,
  ChevronUp,
  FolderOpen,
  PlayCircle,
  Download,
} from "lucide-react";
import FormationService from "@/services/FormationService";
import { useUser } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

type FormationProps = Record<string, never>;

export const Formation: React.FC<FormationProps> = () => {
  const { formationId } = useParams<{ formationId: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const { toast } = useToast();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const {
    data: formation,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["formation", formationId],
    queryFn: () => {
      if (!formationId) throw new Error("Formation ID is required");
      return FormationService.getFormationById(formationId);
    },
    enabled: !!formationId && !!user,
    meta: {
      onError: (error: any) => {
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails de la formation.",
          variant: "destructive",
        });
        console.error("Error loading formation details:", error);
      },
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <p>Chargement des détails de la formation...</p>
      </div>
    );
  }

  if (error || !formation) {
    return (
      <div className="flex flex-col items-center p-4">
        <h2 className="text-lg font-semibold mb-2">Formation non disponible</h2>
        <Button
          variant="default"
          onClick={() => navigate("/formations")}
          className="flex items-center gap-2">
          <FolderOpen size={18} />
          Retour aux formations
        </Button>
      </div>
    );
  }

  const handleQuizStart = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
  };

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card className="mb-6 overflow-hidden">
        {formation.image && (
          <div className="h-48 overflow-hidden">
            <img
              src={formation.image || "https://source.unsplash.com/random"}
              alt={formation.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle>{formation.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">{formation.description}</p>

          {formation.quizzes && formation.quizzes.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Quizzes</h3>
              <ul className="space-y-1">
                {formation.quizzes.map((quiz) => (
                  <li
                    key={quiz.id}
                    onClick={() => handleQuizStart(quiz.id)}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer">
                    <PlayCircle size={18} />
                    <span>{quiz.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {formation.medias && formation.medias.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Médias</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formation.medias.map((media) => (
              <Card key={media.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{media.titre}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground">
                    {media.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={media.url}
                      target="_blank"
                      rel="noopener noreferrer">
                      Voir le média
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {formation.fichiers && formation.fichiers.length > 0 && (
        <div>
          <Collapsible className="w-full">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Téléchargements</h3>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection("downloads")}>
                  {openSections["downloads"] ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
            <Separator className="my-2" />
            <CollapsibleContent>
              <Card>
                <Table>
                  <TableBody>
                    {formation.fichiers.map((file) => (
                      <TableRow key={file.id}>
                        <TableCell>{file.titre}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="flex items-center gap-1">
                            <a href={file.url} download>
                              <Download size={14} />
                              Télécharger
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}
    </div>
  );
};
