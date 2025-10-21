import { Mail, Phone, User } from "lucide-react";
import { Contact } from "@/types/contact";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ContactCardProps {
  contact: Contact;
}

// Mapping des styles par rôle
const roleStyles: Record<string, string> = {
  commerciale: "bg-blue-100 text-blue-800",
  commercial: "bg-blue-100 text-blue-800",
  conseiller: "bg-blue-100 text-blue-800",
  conseillere: "bg-blue-100 text-blue-800",
  formateur: "bg-green-100 text-green-800",
  formatrice: "bg-green-100 text-green-800",
  pole_relation_client: "bg-yellow-400 text-yellow-00",
  "Pôle SAV": "bg-purple-100 text-purple-800",
  pole_sav: "bg-purple-100 text-purple-800",
  autre: "bg-gray-100 text-gray-800",
};

// Mapping des noms d'affichage par rôle
const roleDisplayNames: Record<string, string> = {
  formateur: "Formateur",
  commerciale: "Commercial",
  pole_relation_client: "Pôle Relation Client",
  "Pôle SAV": "Pôle SAV",
  pole_sav: "Pôle SAV",
  autre: "Autre",
};

export const ContactCard = ({ contact }: ContactCardProps) => {
  // Fonction pour déterminer le titre du poste avec civilité
  // Dans votre ContactCard existant, vérifiez que cette partie gère bien "Pôle SAV" :
  const getJobTitleWithCivility = (contact: Contact) => {
    // Utiliser le rôle s'il est disponible, sinon le type
    const role = contact.role || contact.type;
    const { civilite } = contact;

    if (!civilite) {
      return roleDisplayNames[role] || role;
    }

    // Nettoyer la civilité (enlever le point si présent)
    const cleanCivilite = civilite.replace(".", "");

    switch (role) {
      case "formateur":
        if (cleanCivilite === "M") {
          return "Formateur";
        } else if (cleanCivilite === "Mme" || cleanCivilite === "Mlle") {
          return "Formatrice";
        }
        return "Formateur/Formatrice";

      case "commerciale":
        if (cleanCivilite === "M") {
          return "Commercial";
        } else if (cleanCivilite === "Mme" || cleanCivilite === "Mlle") {
          return "Commerciale";
        }
        return "Commercial(e)";

      case "pole_relation_client":
        return "Pôle Relation Client";

      case "Pôle SAV": // Ajout explicite
      case "pole_sav": // Format alternatif
        return "Pôle SAV";

      default:
        return roleDisplayNames[role] || role;
    }
  };

  // Get name from either name field or combine nom/prenom
  const displayName =
    contact.name ||
    `${contact.prenom || ""} ${contact.nom || ""}`.trim() ||
    "Nom inconnu";

  // Format du nom avec civilité si disponible
  const getFormattedName = () => {
    const prenom = contact.prenom || "";
    const nom = contact.nom ? contact.nom.toUpperCase() : "";

    if (prenom || nom) {
      if (contact.civilite) {
        return `${contact.civilite} ${prenom} ${nom}`.trim();
      }
      return `${prenom} ${nom}`.trim();
    }

    if (contact.name) {
      return contact.name.toUpperCase();
    }

    const prenom = contact.prenom || "";
    const nom = contact.nom ? contact.nom.toUpperCase() : "";

    if (contact.civilite) {
      return `${contact.civilite} ${prenom} ${nom}`.trim();
    }

    return `${prenom} ${nom}`.trim() || "Nom inconnu";
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    if (contact.prenom || contact.nom) {
      const prenomInitial = contact.prenom
        ? contact.prenom.charAt(0).toUpperCase()
        : "";
      const nomInitial = contact.nom ? contact.nom.charAt(0).toUpperCase() : "";
      return `${nomInitial}${prenomInitial}`;
    }

    if (contact.name) {
      const parts = contact.name.split(" ").filter((part) => part.length > 0);
      if (parts.length === 0) return "?";
      if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
      return (
        parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
      ).toUpperCase();
    }

    return "?";
  };

  const formattedName = getFormattedName();
  const jobTitle = getJobTitleWithCivility(contact);
  // Utiliser le rôle en priorité, sinon le type pour la compatibilité
  const contactRole = contact.role || contact.type;

  return (
    <div
      key={contact.id}
      className="bg-white shadow-md rounded-2xl p-5 border hover:shadow-lg transition">
      <div className="flex items-center mb-4">
        {contact.image && contact.image !== "/images/default-avatar.png" ? (
          <img
            src={`${import.meta.env.VITE_API_URL_MEDIA}/${contact.image}`}
            alt={formattedName}
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4 text-gray-600 font-semibold text-sm">
            {getInitials()}
          </div>
        )}
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {contact.prenom ? `${contact.prenom} ` : ""}{contact.nom ? contact.nom.toUpperCase() : contact.name.toUpperCase()}  
          </h2>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              roleStyles[contactRole] || roleStyles.autre
            }`}>
            {jobTitle}
          </span>
        </div>
      </div>

      <div className="text-sm text-gray-600 space-y-1 mt-2">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          {contact.email ? (
            <a
              href={`mailto:${contact.email}?subject=Contact&body=Bonjour,`}
              className="hover:underline text-blue-600 hover:text-blue-800">
              Envoyer un email
            </a>
          ) : (
            <span className="text-gray-400">Email non disponible</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4" />
          {contact.telephone ? (
            <a
              href={`tel:${contact.telephone}`}
              className="hover:underline text-blue-600 hover:text-blue-800">
              {contact.telephone}
            </a>
          ) : (
            <span className="text-gray-400">Non renseigné</span>
          )}
        </div>
      </div>

      {contactRole === 'formateur' && (contact.formations || contact.formation) && (
        <div className="mt-4">
          {(contact.formations || contact.formation)?.length > 1 && (<h3 className="text-sm font-medium text-gray-500 mb-2">Formations</h3>)}
          
          <div className="flex flex-wrap gap-2">
            {(contact.formations || contact.formation)?.map((f) => (
              <Badge key={f.id} variant="secondary">{f.titre || f.title || f.name}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
