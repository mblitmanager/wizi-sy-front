
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
          <AvatarImage src={contact.image_url} alt={`${contact.prenom} ${contact.nom}`} />
          <AvatarFallback>{contact.prenom.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{`${contact.prenom} ${contact.nom}`}</h3>
          <p className="text-sm text-muted-foreground">{contact.role}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">Email:</span> {contact.email}
          </p>
          {contact.telephone && (
            <p className="text-sm">
              <span className="font-medium">Téléphone:</span> {contact.telephone}
            </p>
          )}
          {contact.poste && (
            <div className="mt-2">
              <p className="text-sm font-medium mb-1">Poste:</p>
              <Badge variant="secondary">
                {contact.poste}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
