import { Mail, Phone, User, School, ArrowRight } from "lucide-react";
import { Contact } from "@/types/contact";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Palette de couleurs Flutter harmonieuse
const colors = {
  primaryBlue: "#3D9BE9",
  primaryBlueLight: "#E8F4FE",
  primaryBlueDark: "#2A7BC8",

  successGreen: "#ABDA96",
  successGreenLight: "#F0F9ED",
  successGreenDark: "#7BBF5E",

  accentPurple: "#9392BE",
  accentPurpleLight: "#F5F4FF",
  accentPurpleDark: "#6A6896",

  warningOrange: "#FFC533",
  warningOrangeLight: "#FFF8E8",
  warningOrangeDark: "#E6A400",

  errorRed: "#A55E6E",
  errorRedLight: "#FBEAED",
  errorRedDark: "#8C4454",

  neutralWhite: "#FFFFFF",
  neutralGrey: "#F8F9FA",
  neutralGreyDark: "#6C757D",
  neutralBlack: "#212529",
};

interface ContactCardProps {
  contact: Contact;
  showFormations?: boolean;
}

// Mapping des couleurs par rôle
const roleColors: Record<string, { main: string; light: string }> = {
  formateur: { main: colors.primaryBlue, light: colors.primaryBlueLight },
  formatrice: { main: colors.primaryBlue, light: colors.primaryBlueLight },
  commercial: { main: colors.successGreen, light: colors.successGreenLight },
  commerciale: { main: colors.successGreen, light: colors.successGreenLight },
  pole_sav: { main: colors.warningOrange, light: colors.warningOrangeLight },
  "pôle sav": { main: colors.warningOrange, light: colors.warningOrangeLight },
  pole_relation_client: {
    main: colors.accentPurple,
    light: colors.accentPurpleLight,
  },
  "pôle relation client": {
    main: colors.accentPurple,
    light: colors.accentPurpleLight,
  },
  autre: { main: colors.neutralGreyDark, light: colors.neutralGrey },
};

// Mapping des noms d'affichage par rôle
const roleDisplayNames: Record<string, string> = {
  formateur: "Formateur",
  formatrice: "Formatrice",
  commercial: "Commercial",
  commerciale: "Commerciale",
  pole_sav: "Pôle SAV",
  "pôle sav": "Pôle SAV",
  pole_relation_client: "Pôle Relation Client",
  "pôle relation client": "Pôle Relation Client",
  autre: "Contact",
};

export const ContactCard = ({
  contact,
  showFormations = true,
}: ContactCardProps) => {
  // Fonction pour déterminer le titre du poste avec civilité - CORRIGÉE
  console.log("Contact reçu dans ContactCard:", contact);
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
  // Format du nom avec première lettre du nom et prénom entier - CORRIGÉE
  const getFormattedName = () => {
    const prenom = contact.prenom || "";
    const nom = contact.nom || "";

    if (prenom && nom) {
      // Format "J. Marc" - première lettre du nom + point + prénom
      const nomInitial = nom.charAt(0).toUpperCase() + ".";
      return `${nomInitial} ${prenom}`;
    }

    if (prenom) {
      return prenom;
    }

    if (nom) {
      return nom.toUpperCase();
    }

    return contact.name || "Nom inconnu";
  };

  // Initiales pour l'avatar
  const getInitials = () => {
    if (contact.prenom || contact.nom) {
      const nomInitial = contact.name
        ? contact.name.charAt(0).toUpperCase()
        : "";
      return `${nomInitial}`;
    }
    return contact.name ? contact.name.charAt(0).toUpperCase() : "?";
  };

  // Couleur du rôle
  const getRoleColor = () => {
    const role = (contact.role || contact.type || "autre").toLowerCase();
    return roleColors[role] || roleColors.autre;
  };

  // Vérifier si c'est un formateur - CORRIGÉE
  const isFormateur = () => {
    const role = (contact.role || contact.type || "").toLowerCase();
    const jobTitle = getJobTitleWithCivility(contact);
    return (
      role.includes("formateur") ||
      role.includes("formatrice") ||
      jobTitle.includes("formateur") ||
      jobTitle.includes("formatrice")
    );
  };

  // Formater les dates de formation
  const formatFormationDates = (dateDebut?: string, dateFin?: string) => {
    if (!dateDebut && !dateFin) return "";

    const formatDate = (date: string) => {
      try {
        const d = new Date(date);
        return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${d.getFullYear()}`;
      } catch {
        return date;
      }
    };

    const debut = dateDebut ? formatDate(dateDebut) : "";
    const fin = dateFin ? formatDate(dateFin) : "";

    if (debut && fin) return `${debut} - ${fin}`;
    if (debut) return `Début: ${debut}`;
    if (fin) return `Fin: ${fin}`;
    return "";
  };

  const formattedName = getFormattedName();
  const jobTitle = getJobTitleWithCivility(contact);
  const roleColor = getRoleColor();
  const formations = contact.formations || contact.formation || [];

  return (
    <TooltipProvider>
      <Card className="bg-white dark:bg-gray-800 rounded-2xl border-0 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <div
          className="p-4 md:p-6"
          style={{
            background: `linear-gradient(135deg, ${colors.neutralWhite} 0%, ${colors.neutralGrey} 100%)`,
          }}>
          <div className="flex items-start justify-between">
            {/* Section avatar et informations */}
            <div className="flex items-start space-x-3 flex-1 min-w-0">
              {/* Avatar avec badge de rôle */}
              <div className="relative">
                <div
                  className="relative rounded-full p-0.5"
                  style={{
                    background: `linear-gradient(135deg, ${roleColor.main}, ${roleColor.main}dd)`,
                    boxShadow: `0 4px 12px ${roleColor.main}40`,
                  }}>
                  {contact.image &&
                  contact.image !== "/images/default-avatar.png" ? (
                    <Avatar className="w-12 h-12 md:w-14 md:h-14 border-2 border-white">
                      <AvatarImage
                        src={`${import.meta.env.VITE_API_URL_MEDIA}/${
                          contact.image
                        }`}
                        alt={formattedName}
                      />
                      <AvatarFallback
                        className="text-white font-semibold"
                        style={{ backgroundColor: roleColor.main }}>
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Avatar
                      className="w-12 h-12 md:w-14 md-h-14 border-2 border-white"
                      style={{ backgroundColor: roleColor.main }}>
                      <AvatarFallback className="text-white font-semibold">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>

              {/* Informations du contact */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white truncate">
                      {getInitials()}. {formattedName}
                    </h3>
                    <div className="mt-1">
                      <Badge
                        variant="secondary"
                        className="text-xs font-semibold border-0"
                        style={{
                          backgroundColor: roleColor.light,
                          color: roleColor.main,
                        }}>
                        {jobTitle}
                      </Badge>
                    </div>
                  </div>

                  {/* Boutons d'action version mobile */}
                  <div className="flex space-x-1 md:hidden ml-2">
                    {contact.email && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            className="w-8 h-8 rounded-full p-0"
                            style={{ backgroundColor: colors.successGreen }}
                            onClick={() =>
                              (window.location.href = `mailto:${contact.email}`)
                            }>
                            <Mail className="w-3 h-3 text-white" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Envoyer un email</TooltipContent>
                      </Tooltip>
                    )}
                    {contact.telephone && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            className="w-8 h-8 rounded-full p-0"
                            style={{ backgroundColor: colors.primaryBlue }}
                            onClick={() =>
                              (window.location.href = `tel:${contact.telephone}`)
                            }>
                            <Phone className="w-3 h-3 text-white" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Appeler</TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>

                {/* Coordonnées */}
                <div className="mt-3 space-y-2">
                  {/* Email */}
                  <div className="flex items-center space-x-2">
                    <Mail
                      className="w-4 h-4"
                      style={{ color: colors.neutralGreyDark }}
                    />
                    {contact.email ? (
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline truncate flex-1">
                        {/* {contact.email}  */} Envoyer un email 
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400">
                        Email non disponible
                      </span>
                    )}
                  </div>

                  {/* Téléphone */}
                  <div className="flex items-center space-x-2">
                    <Phone
                      className="w-4 h-4"
                      style={{ color: colors.neutralGreyDark }}
                    />
                    {contact.telephone ? (
                      <a
                        href={`tel:${contact.telephone}`}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                        {contact.telephone}
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400">
                        Non renseigné
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Boutons d'action version desktop */}
            <div className="hidden md:flex flex-col space-y-2 ml-4">
              {contact.email && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      className="w-10 h-10 rounded-full p-0"
                      style={{ backgroundColor: colors.successGreen }}
                      onClick={() =>
                        (window.location.href = `mailto:${contact.email}`)
                      }>
                      <Mail className="w-4 h-4 text-white" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Envoyer un email</TooltipContent>
                </Tooltip>
              )}
              {contact.telephone && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      className="w-10 h-10 rounded-full p-0"
                      style={{ backgroundColor: colors.primaryBlue }}
                      onClick={() =>
                        (window.location.href = `tel:${contact.telephone}`)
                      }>
                      <Phone className="w-4 h-4 text-white" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Appeler</TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          {/* Section Formations */}
          {showFormations && isFormateur() && formations.length > 0 && (
            <div
              className="mt-4 p-3 rounded-xl border"
              style={{
                backgroundColor: colors.successGreenLight,
                borderColor: colors.successGreen + "20",
              }}>
              <div className="flex items-center space-x-2 mb-2">
                <School
                  className="w-4 h-4"
                  style={{ color: colors.successGreenDark }}
                />
                <span
                  className="text-sm font-semibold"
                  style={{ color: colors.successGreenDark }}>
                  Formations
                </span>
              </div>

              {formations.length > 1 ? (
                <div className="flex items-center justify-between">
                  <span
                    className="text-sm"
                    style={{ color: colors.neutralGreyDark }}>
                    {formations.length} formations disponibles
                  </span>
                  <ArrowRight
                    className="w-4 h-4"
                    style={{ color: colors.successGreenDark }}
                  />
                </div>
              ) : (
                formations.slice(0, 1).map((formation, index) => (
                  <div key={index} className="space-y-1">
                    <div className="text-sm font-medium text-gray-900 line-clamp-1">
                      {formation.titre || formation.title || formation.name}
                    </div>
                    {formation.dateDebut && (
                      <div
                        className="text-xs"
                        style={{ color: colors.neutralGreyDark }}>
                        {formatFormationDates(
                          formation.dateDebut,
                          formation.dateFin
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </Card>
    </TooltipProvider>
  );
};
