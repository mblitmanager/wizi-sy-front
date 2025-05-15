import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Link as LinkIcon, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { parrainageService } from "../../services/parrainageService";
import { ParrainageStats as ParrainageStatsType } from "../../services/parrainageService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const ParrainageSection = () => {
  const [parrainageLink, setParrainageLink] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<ParrainageStatsType | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await parrainageService.getParrainageStats();
        setStats(data);
      } catch (err) {
        setStatsError("Erreur lors du chargement des statistiques");
        console.error(err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const generateLink = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_URL}/stagiaire/parrainage/generate-link`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la génération du lien");
      }

      const data = await response.json();
      setParrainageLink(data.link);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le lien de parrainage",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(parrainageLink);
    toast({
      title: "Succès",
      description: "Lien copié dans le presse-papiers",
    });
  };

  return (
    <section className="mb-6">
      <h1 className="text-3xl text-blue-custom-100 font-bold mb-8">
        Programme de parrainage
      </h1>

      {/* Statistiques de parrainage */}
      {statsLoading ? (
        <div className="mb-6">Chargement des statistiques...</div>
      ) : statsError ? (
        <div className="mb-6 text-red-500">{statsError}</div>
      ) : (
        stats && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">
                Vos statistiques de parrainage
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-blue-700">
                    Filleuls
                  </h4>
                  <p className="text-2xl font-bold">{stats.total_filleuls}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-green-700">
                    Points Gagnés
                  </h4>
                  <p className="text-2xl font-bold">
                    {stats.total_points || 0}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-purple-700">
                    Récompenses
                  </h4>
                  <p className="text-2xl font-bold">
                    {stats.total_rewards || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      )}

      {/* Génération de lien de parrainage */}
      <Card className="mb-4">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Users className="h-6 w-6 text-blue-500 mr-2" />
            <h3 className="text-lg font-medium">Invitez vos amis</h3>
          </div>

          <p className="text-gray-600 mb-4">
            Partagez votre lien de parrainage et gagnez des points à chaque fois
            qu'un ami s'inscrit et commence à apprendre !
          </p>

          <div className="space-y-4">
            <Button
              onClick={generateLink}
              disabled={isLoading}
              className="w-full">
              <LinkIcon className="h-4 w-4 mr-2" />
              {isLoading ? "Génération..." : "Générer mon lien de parrainage"}
            </Button>

            {parrainageLink && (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={parrainageLink}
                  readOnly
                  aria-label="Lien de parrainage"
                  className="flex-1 p-2 border rounded-md bg-gray-50"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                  aria-label="Copier le lien">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ParrainageSection;
