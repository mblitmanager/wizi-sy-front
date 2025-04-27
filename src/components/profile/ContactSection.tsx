import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, User } from "lucide-react";

interface Contact {
  id: string;
  prenom: string;
  role: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
}

interface ContactSectionProps {
  contacts: {
    formateurs: Contact[];
    commerciaux: Contact[];
    pole_relation: Contact[];
  };
}

const ContactSection = ({ contacts }: ContactSectionProps) => {
  const allContacts = [
    ...contacts.formateurs.map(c => ({ ...c, type: 'Formateur' })),
    ...contacts.commerciaux.map(c => ({ ...c, type: 'Commercial' })),
    ...contacts.pole_relation.map(c => ({ ...c, type: 'Relation Client' }))
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {allContacts.map((contact) => (
        <Card key={contact.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              {contact.type}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium">{contact.prenom}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${contact.user.email}`} className="hover:underline">
                  {contact.user.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{contact.role}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ContactSection; 