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
          <AvatarImage src={contact.avatar} alt={contact.name} />
          <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{contact.name}</h3>
          <p className="text-sm text-muted-foreground">{contact.role}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">Email:</span> {contact.email}
          </p>
          {contact.phone && (
            <p className="text-sm">
              <span className="font-medium">Téléphone:</span> {contact.phone}
            </p>
          )}
          {contact.formations && contact.formations.length > 0 && (
            <div className="mt-2">
              {contact.formations.length > 1 ? (
                <p className="text-sm font-medium mb-1">Formations proposées:</p>
              ) : (
                <p className="text-sm font-medium mb-1">Formation proposée:</p>
              )}
              <div className="flex flex-wrap gap-1">
                {contact.formations.map((formation, index) => (
                  <Badge key={index} variant="secondary">
                    {formation}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );console.log(contact);
};
