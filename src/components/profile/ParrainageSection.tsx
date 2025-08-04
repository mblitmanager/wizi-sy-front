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
  Share2,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { parrainageService } from "../../services/parrainageService";
import { ParrainageStats as ParrainageStatsType } from "../../services/parrainageService";
import image from "../../assets/aopia parrainage.png";
import { useUser } from "@/hooks/useAuth";
import LienParrainage from "../parrainage/LienParainage";

const API_URL = import.meta.env.VITE_API_URL || "https://wizi-learn.com/api";

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
        console.log("Statistiques récupérées :", data);

        setStats({
          total_filleuls: data.nombre_filleuls,
          total_points: parseInt(data.total_points),
          gains: parseFloat(data.gains),
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
    <section className="mb-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        {/* Left Column - Content */}
        <div className="flex-1 order-2 lg:order-1">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4 lg:hidden">
              <img
                src={image}
                alt="Parrainage"
                className="w-16 h-16 object-contain rounded-lg"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Programme de parrainage
                </h1>
                <p className="text-sm text-gray-600">
                  Gagnez{" "}
                  <span className="text-blue-600 font-bold">
                    50€ par filleul
                  </span>
                </p>
              </div>
            </div>

            <h1 className="hidden lg:block text-3xl font-bold text-gray-800 mb-3">
              Programme de parrainage
            </h1>
            <p className="hidden lg:block text-lg text-gray-600 mb-6">
              Parrainez vos amis et gagnez{" "}
              <span className="text-blue-600 font-bold">50€</span> pour chaque
              inscription valide. Partagez votre lien unique et suivez vos gains
              en temps réel.
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Gift className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Gagnez jusqu'à 500€ par mois
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Plus vous parrainez, plus vous gagnez. Vos gains sont
                    directement versés sur votre compte chaque mois.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Share2 className="h-4 w-4 mr-2" />
                    Commencer à parrainer
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Link Generation Card */}
          <div className="mb-8">
            <Card className="border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <Megaphone className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Votre lien de parrainage
                  </h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Partagez ce lien unique avec vos amis et commencez à gagner.
                  Chaque inscription valide vous rapporte{" "}
                  <span className="font-bold text-blue-600">50€</span>.
                </p>
                <LienParrainage />
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <div className="mb-8">
            {statsLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : statsError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
                {statsError}
              </div>
            ) : (
              stats && (
                <Card className="border border-gray-200 rounded-xl shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-amber-100 p-2 rounded-lg">
                        <BarChart2 className="h-5 w-5 text-amber-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        Vos statistiques
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-xs hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <UserPlus className="h-4 w-4 text-blue-600" />
                          </div>
                          <h4 className="text-sm font-medium text-gray-500">
                            Filleuls
                          </h4>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">
                          {stats.total_filleuls}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          +0 cette semaine
                        </p>
                      </div>

                      <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-xs hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-green-100 p-2 rounded-full">
                            <Star className="h-4 w-4 text-green-600" />
                          </div>
                          <h4 className="text-sm font-medium text-gray-500">
                            Points
                          </h4>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">
                          {stats.total_points || 0}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Cumulés</p>
                      </div>

                      <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-xs hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-purple-100 p-2 rounded-full">
                            <Award className="h-4 w-4 text-purple-600" />
                          </div>
                          <h4 className="text-sm font-medium text-gray-500">
                            Gains
                          </h4>
                        </div>
                        <p className="text-3xl font-bold text-gray-800">
                          {stats.gains && stats.gains > 0
                            ? `${
                                stats.gains % 1 === 0
                                  ? stats.gains.toFixed(0)
                                  : stats.gains.toFixed(2)
                              } €`
                            : "0 €"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Par chaque isncription
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            )}
          </div>

          {/* How It Works Section */}
          <Card className="border border-gray-200 rounded-xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-100 p-2 rounded-lg">
                  <ChevronRight className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Comment ça marche ?
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-full flex-shrink-0">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">
                      Générez votre lien
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Créez votre lien de parrainage unique en un clic.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-full flex-shrink-0">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">
                      Partagez avec vos proches
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Envoyez votre lien par email, réseaux sociaux ou
                      messagerie.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-full flex-shrink-0">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">
                      Vos amis s'inscrivent
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Ils utilisent votre lien pour créer leur compte.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-full flex-shrink-0">
                    <span className="text-blue-600 font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">
                      Vous gagnez 50€
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Pour chaque inscription valide, vous recevez 50€.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Image (Desktop only) */}
        <div className="hidden lg:block flex-1 order-1 lg:order-2">
          <div className="sticky top-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-gray-200 shadow-sm">
              <img
                src={image}
                alt="Programme de parrainage"
                className="w-full h-auto object-contain rounded-lg"
              />
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Pourquoi parrainer ?
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="bg-blue-100 p-1 rounded-full mt-1">
                      <ChevronRight className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-gray-600">
                      Revenus complémentaires faciles
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-blue-100 p-1 rounded-full mt-1">
                      <ChevronRight className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-gray-600">Sans limite de gains</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-blue-100 p-1 rounded-full mt-1">
                      <ChevronRight className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-gray-600">
                      Paiements mensuels sécurisés
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-blue-100 p-1 rounded-full mt-1">
                      <ChevronRight className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-gray-600">
                      Tableau de bord de suivi
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParrainageSection;
