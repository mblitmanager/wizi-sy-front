// components/ParrainageSection.tsx
import { Gift } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ParrainageSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Gift className="h-5 w-5 text-pink-500" />
          <span>Parrainage</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Invitez vos amis et gagnez des récompenses !
        </p>
        <ul className="mt-2 list-disc list-inside text-sm">
          <li>1 filleul = 50 €</li>
          <li>Bonus si actif 1 mois</li>
        </ul>
      </CardContent>
    </Card>
  );
}
