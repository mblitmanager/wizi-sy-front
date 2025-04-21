import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Share2, Users } from "lucide-react";
import { toast } from "sonner";

interface ReferralSystemProps {
  referralCode: string;
  totalReferrals: number;
  referralRewards: {
    points: number;
    quizzes: number;
  };
}

const ReferralSystem = ({
  referralCode,
  totalReferrals,
  referralRewards,
}: ReferralSystemProps) => {
  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success("Code de parrainage copié !");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Rejoignez-moi sur Quizzy Training Hub",
          text: `Utilisez mon code de parrainage ${referralCode} pour rejoindre Quizzy Training Hub et gagner des récompenses !`,
          url: window.location.origin,
        });
      } catch (error) {
        console.error("Erreur lors du partage:", error);
      }
    } else {
      handleCopyCode();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Programme de parrainage
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center p-4 bg-primary/5 rounded-lg">
            <p className="text-2xl font-bold text-primary">{totalReferrals}</p>
            <p className="text-sm text-muted-foreground">Filleuls</p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Votre code de parrainage</h3>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-muted rounded-md text-center font-mono">
                  {referralCode}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyCode}
                  title="Copier le code"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                  title="Partager"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-primary">
                  {referralRewards.points}
                </p>
                <p className="text-sm text-muted-foreground">Points bonus</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-primary">
                  {referralRewards.quizzes}
                </p>
                <p className="text-sm text-muted-foreground">Quiz débloqués</p>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>
                Partagez votre code avec vos amis et gagnez des récompenses pour chaque
                filleul qui rejoint la plateforme !
              </p>
              <ul className="mt-2 list-disc list-inside">
                <li>Points bonus pour chaque filleul</li>
                <li>Accès à des quiz exclusifs</li>
                <li>Badges spéciaux</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralSystem; 