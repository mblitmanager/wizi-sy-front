
import { Mail, Phone, User } from "lucide-react";
import { Contact } from "@/types/contact";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ContactCardProps {
  contact: Contact;
}

export const ContactCard = ({ contact }: ContactCardProps) => {
  // Get name from either name field or combine nom/prenom
  const displayName = contact.name || `${contact.prenom || ''} ${contact.nom || ''}`.trim() || "Nom inconnu";
  const displayPhone = contact.phone || contact.telephone;
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={contact.avatar || contact.image_url || "/images/default-avatar.png"} alt={displayName || "Profil"} />
          <AvatarFallback>{displayName?.charAt(0) || "?"}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{displayName}</h3>
          <p className="text-sm text-muted-foreground">{contact.role || "Rôle non spécifié"}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">Email:</span> {contact.email || "Non disponible"}
          </p>
          {displayPhone ? (
            <p className="text-sm">
              <span className="font-medium">Téléphone:</span> {displayPhone}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Téléphone non disponible</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
