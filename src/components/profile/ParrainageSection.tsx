
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Link as LinkIcon, Copy, Gift, Share2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { sponsorshipService } from "../../services/sponsorshipService";
import { SponsorshipStats } from "../../services/sponsorshipService";

const ParrainageSection = () => {
  const [parrainageLink, setParrainageLink] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<SponsorshipStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await sponsorshipService.getStats();
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
      const response = await sponsorshipService.getLink();
      setParrainageLink(response.url);
      toast({
        title: "Lien généré",
        description: "Votre lien de parrainage est prêt à être partagé",
      });
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

  const handleShare = (platform: string) => {
    if (!parrainageLink) {
      toast({
        title: "Erreur",
        description: "Veuillez d'abord générer un lien de parrainage",
        variant: "destructive",
      });
      return;
    }

    let shareUrl = '';
    const shareText = "Rejoins Wizi Learn et commence à apprendre ! Utilise mon lien de parrainage:";
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(parrainageLink)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(parrainageLink)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText + " " + parrainageLink)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=Rejoins%20Wizi%20Learn&body=${encodeURIComponent(shareText + " " + parrainageLink)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank');
  };

  return (
    <section className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Users className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold font-montserrat">
          Programme de parrainage
        </h2>
      </div>

      {/* Bannière promotionnelle */}
      <div className="p-4 mb-6 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Je parraine et je gagne 50 €</h3>
            <p className="text-indigo-100">Pour chaque ami qui s'inscrit à une formation</p>
          </div>
          <Gift className="h-12 w-12 text-white opacity-80" />
        </div>
      </div>

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
                  <p className="text-2xl font-bold">{stats.totalReferrals}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-green-700">
                    Points Gagnés
                  </h4>
                  <p className="text-2xl font-bold">
                    {stats.totalPointsEarned}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-purple-700">
                    Prochaine récompense dans
                  </h4>
                  <p className="text-2xl font-bold">
                    {stats.nextReward ? stats.nextReward.pointsRemaining : 0} pts
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      )}

      {/* Génération de lien de parrainage */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Share2 className="h-6 w-6 text-blue-500 mr-2" />
            <h3 className="text-lg font-medium">Invitez vos amis</h3>
          </div>

          <p className="text-gray-600 mb-4">
            Partagez votre lien de parrainage et gagnez des points et des récompenses à chaque fois qu'un ami s'inscrit et rejoint une formation !
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
              <>
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
                
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Partager via:</p>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleShare('facebook')} className="flex-1">
                      Facebook
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleShare('twitter')} className="flex-1">
                      Twitter
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleShare('whatsapp')} className="flex-1">
                      WhatsApp
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleShare('email')} className="flex-1">
                      Email
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ParrainageSection;
