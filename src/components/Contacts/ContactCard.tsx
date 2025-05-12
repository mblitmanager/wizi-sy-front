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
  const displayName =
    contact.name ||
    `${contact.prenom || ""} ${contact.nom || ""}`.trim() ||
    "Nom inconnu";
  const displayPhone = contact.phone || contact.telephone;

  return (
    <Card className="w-full flex items-center gap-4 p-4">
      <Avatar className="h-12 w-12">
        <AvatarImage
          src={
            contact.avatar || contact.image_url || "/images/default-avatar.png"
          }
          alt={displayName}
        />
        <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h4 className="font-semibold">{displayName}</h4>
        <p className="text-sm text-muted-foreground">
          {contact.role || "Rôle non spécifié"}
        </p>
        <p className="text-sm">{displayPhone || "Téléphone non disponible"}</p>
      </div>
    </Card>
  );
};
