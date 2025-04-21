
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Challenge } from "@/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ChallengeCardProps {
  challenge: Challenge;
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const formatDate = (date?: Date) => {
    if (!date) return "Aucune échéance";
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const handleAcceptChallenge = () => {
    toast.success(`Défi "${challenge.title}" accepté !`);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
        <CardTitle className="text-lg">{challenge.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
        <div className="flex justify-between text-sm mt-4">
          <span className="text-muted-foreground">Récompense:</span>
          <span className="font-medium">{challenge.points} points</span>
        </div>
        {challenge.deadline && (
          <div className="flex justify-between text-sm mt-2">
            <span className="text-muted-foreground">Échéance:</span>
            <span className="font-medium">{formatDate(challenge.deadline)}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {challenge.completed ? (
          <Button variant="outline" className="w-full" disabled>
            Complété
          </Button>
        ) : (
          <Button className="w-full" onClick={handleAcceptChallenge}>
            Accepter le défi
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
