import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Link as LinkIcon,
  Copy,
  BarChart2,
  UserPlus,
  Star,
  Award,
  Megaphone,
  Gift,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { parrainageService } from "../../services/parrainageService";
import { ParrainageStats as ParrainageStatsType } from "../../services/parrainageService";
import image from "../../assets/aopia parrainage.png";
import { useUser } from "@/context/UserContext";
import LienParrainage from "../parrainage/LienParainage";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const ParrainageSection = () => {
  const [parrainageLink, setParrainageLink] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<ParrainageStatsType | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useUser();
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Vérification plus robuste de l'ID utilisateur
        const userId = user?.user?.id;
        if (!userId) {
          console.log("Aucun ID utilisateur trouvé");
          return;
        }

        const response = await fetch(`${API_URL}/parrainage/stats/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              "Erreur lors de la récupération des statistiques"
          );
        }

        const data = await response.json();

        setStats({
          total_filleuls: data.nombre_filleuls,
          total_points: parseInt(data.total_points),
          total_rewards: 0, // À adapter selon votre logique
        });
      } catch (err) {
        console.error("Error in fetchStats:", err);
        setStatsError(
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement des statistiques"
        );
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [user?.user?.id]);
  console.log("stats:", stats);
  // Dans ParrainageSection.tsx
  const generateLink = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/parrainage/generate-link`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        setParrainageLink(data.link);
      } else {
        throw new Error(data.message || "Erreur lors de la génération du lien");
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message,
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
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-2 order-2 md:order-2 md:w-full">
          {/* En-tête compact pour mobile */}
          <div className="md:hidden flex items-center gap-4 mb-4">
            <img
              src={image}
              alt="Parrainage"
              className="w-20 h-20 object-contain"
            />
            <div>
              <h1 className="text-2xl text-brown-shade font-bold">
                Programme de parrainage
              </h1>
              <p className="text-sm text-gray-700">
                Gagnez <span className="font-bold text-green-600">50€</span> par
                filleul
              </p>
            </div>
          </div>

          {/* Version desktop */}
          <h1 className="hidden md:block text-3xl text-brown-shade font-bold mb-4">
            Programme de parrainage
          </h1>

          <p className="hidden md:block text-lg text-gray-700 mb-4">
            Parlez de nos formations à votre entourage (famille, amis, collègues
            et connaissances) et gagnez{" "}
            <span className="font-bold text-green-600">50 €</span> par filleul !
          </p>

          {/* Bouton principal plus compact sur mobile */}
          <Button className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:from-blue-700 hover:to-blue-500 mb-4">
            <Gift className="h-5 w-5 mr-2" />
            <span className="text-sm md:text-base">
              Je parraine et je gagne 50€
            </span>
          </Button>

          {/* Cartes en colonne unique sur mobile */}
          <div className="space-y-4">
            {/* Carte de génération de lien */}
            <Card className="border-blue-100">
              <Card className="border-blue-100">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center mb-3">
                    <Megaphone className="h-5 w-5 text-blue-500 mr-2" />
                    <h3 className="text-base md:text-lg font-medium">
                      Partagez et gagnez
                    </h3>
                  </div>
                  <p className="text-sm md:text-base text-gray-700 mb-3">
                    Gagnez <span className="font-bold">50€</span> par ami
                    inscrit
                  </p>
                  <LienParrainage />
                </CardContent>
              </Card>
            </Card>

            {/* Statistiques - version compacte mobile */}
            {statsLoading ? (
              <div className="text-center py-4">Chargement...</div>
            ) : statsError ? (
              <div className="text-red-500 text-sm py-4">{statsError}</div>
            ) : (
              stats && (
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                  <CardContent className="p-4 md:p-6">
                    <h3 className="text-base md:text-lg font-medium mb-3 flex items-center">
                      <BarChart2 className="h-4 w-4 md:h-5 md:w-5 mr-2 text-blue-600" />
                      <span>Vos stats</span>
                    </h3>
                    <div className="grid grid-cols-3 gap-2 md:gap-4">
                      <div className="bg-white p-2 md:p-4 rounded-lg shadow-sm border border-blue-100">
                        <h4 className="text-xs md:text-sm font-semibold text-blue-700 flex items-center">
                          <UserPlus className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                          <span className="truncate">Filleuls</span>
                        </h4>
                        <p className="text-xl md:text-2xl font-bold text-blue-800">
                          {stats.total_filleuls}
                        </p>
                      </div>
                      <div className="bg-white p-2 md:p-4 rounded-lg shadow-sm border border-green-100">
                        <h4 className="text-xs md:text-sm font-semibold text-green-700 flex items-center">
                          <Star className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                          <span className="truncate">Points</span>
                        </h4>
                        <p className="text-xl md:text-2xl font-bold text-green-800">
                          {stats.total_points || 0}
                        </p>
                      </div>
                      <div className="bg-white p-2 md:p-4 rounded-lg shadow-sm border border-purple-100">
                        <h4 className="text-xs md:text-sm font-semibold text-purple-700 flex items-center">
                          <Award className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                          <span className="truncate">Gains</span>
                        </h4>
                        <p className="text-xl md:text-2xl font-bold text-purple-800">
                          {stats.total_rewards || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            )}

            {/* Guide compact */}
            <div className="bg-blue-50 p-3 md:p-4 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-800 text-sm md:text-base mb-1 md:mb-2">
                Comment ça marche ?
              </h3>
              <ul className="text-xs md:text-sm text-gray-700 space-y-1 pl-4">
                <li className="list-disc">Générez votre lien unique</li>
                <li className="list-disc">Partagez avec vos proches</li>
                <li className="list-disc">50€ par inscription valide</li>
                <li className="list-disc">Suivez vos gains</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Image seulement sur desktop */}
        <div className="hidden md:flex flex-1 justify-start order-1 md:order-1">
          {/* <img
            src={image}
            alt="Programme de parrainage AOPIA"
            className="max-w-xs md:max-w-sm"
          /> */}
        </div>
      </div>
    </section>
  );
};

export default ParrainageSection;
