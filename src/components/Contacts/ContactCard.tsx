import { Mail, Phone, User } from "lucide-react";
import { Contact } from "@/types/contact";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ContactCardProps {
  contact: Contact;
}

export const ContactCard = ({ contact }: ContactCardProps) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={contact.avatar || "/images/default-avatar.png"} alt={contact.name || "Profil"} />
          <AvatarFallback>{contact.name?.charAt(0) || "?"}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{contact.name || "Nom inconnu"}</h3>
          <p className="text-sm text-muted-foreground">{contact.role || "Rôle non spécifié"}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">Email:</span> {contact.email || "Non disponible"}
          </p>
          {contact.phone ? (
            <p className="text-sm">
              <span className="font-medium">Téléphone:</span> {contact.phone}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Téléphone non disponible</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
