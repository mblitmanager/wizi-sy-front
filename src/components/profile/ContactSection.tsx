import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, User } from "lucide-react";

interface Contact {
  name: string;
  role: string;
  email: string;
  phone: string;
}

interface ContactSectionProps {
  contacts: {
    formateur: Contact;
    commercial: Contact;
    relationClient: Contact;
  };
}

const ContactSection = ({ contacts }: ContactSectionProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Object.entries(contacts).map(([key, contact]) => (
        <Card key={key} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              {contact.role}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium">{contact.name}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${contact.email}`} className="hover:underline">
                  {contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <a href={`tel:${contact.phone}`} className="hover:underline">
                  {contact.phone}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ContactSection; 