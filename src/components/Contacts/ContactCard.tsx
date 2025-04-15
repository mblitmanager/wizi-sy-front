
import { Mail, Phone, User } from "lucide-react";
import { Contact } from "@/types/contact";
import { Card, CardContent } from "@/components/ui/card";

interface ContactCardProps {
  contact: Contact;
}

export const ContactCard = ({ contact }: ContactCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          {contact.photo ? (
            <img 
              src={contact.photo} 
              alt={contact.name} 
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-6 h-6 text-gray-500" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-montserrat font-semibold text-lg">{contact.name}</h3>
            <p className="text-sm text-muted-foreground font-roboto">{contact.role}</p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="w-4 h-4" />
            <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline font-roboto">
              {contact.email}
            </a>
          </div>
          {contact.phone && (
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="w-4 h-4" />
              <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline font-roboto">
                {contact.phone}
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
