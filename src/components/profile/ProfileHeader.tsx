import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import BadgesDisplay from "./BadgesDisplay";
import axios from "axios";
import { useUser } from "@/hooks/useAuth";
import { UserProgress } from "@/types/quiz";
import { toast } from "sonner";

// Type utilisateur
export interface User {
  id: string | number;
  name: string;
  email: string;
  points?: number;
  level?: number;
  avatar?: string | null;
  role?: string;
  stagiaire: {
    prenom?: string;
    civilite?: string;
    telephone?: string;
    adresse?: string;
    code_postal?: string;
    ville?: string;
    date_debut_formation?: string;
    date_inscription?: string;
  };
  user?: {
    id: string | number;
    name: string;
    email: string;
    role?: string;
    image?: string | null;
    updated_at?: string;
    adresse?: string | null;
  };
}

interface AchievementMinimal { id: string | number; name?: string; type?: string; level?: string }

interface UserStatsProps {
  user: User | null;
  userProgress?: UserProgress | null;
  achievements?: AchievementMinimal[];
  achievementsLoading?: boolean;
}

const ProfileHeader: React.FC<UserStatsProps> = ({ user, userProgress, achievements, achievementsLoading }) => {
  const [localAchievements, setLocalAchievements] = useState<AchievementMinimal[]>([]);
  const [localAchievementsLoading, setLocalAchievementsLoading] = useState(false);
  const [showMoreMobile, setShowMoreMobile] = useState(false);

  const VITE_API_URL_MEDIA = import.meta.env.VITE_API_URL_MEDIA;
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const { logout, refetchUser } = useUser();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(true);

  // Charger localement si aucune prop achievements fournie
  useEffect(() => {
    if (achievements !== undefined) return; // props prioritaires
    if (!user?.user?.id) return;
    setLocalAchievementsLoading(true);
    axios
      .get(`${VITE_API_URL}/achievements/${user.user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const badges = (res.data || []) as AchievementMinimal[];
        // Ajout de badges de test si non présents
        const testBadges: AchievementMinimal[] = [
          { id: "connexion_serie", name: "Série de connexions", type: "connexion_serie" },
          { id: "first_login", name: "Première connexion", type: "connexion_serie" },
          { id: "first_quiz", name: "Premier quiz", type: "quiz" },
          { id: "first_video", name: "Première vidéo", type: "video" },
          { id: "first_parrainage", name: "Premier parrainage", type: "parrainage" },
        ];
        testBadges.forEach((testBadge) => {
          if (!badges.some((b) => b.id === testBadge.id || b.type === testBadge.type)) {
            badges.push(testBadge);
          }
        });
        setLocalAchievements(badges);
      })
      .catch(() => {
        toast.error("Erreur lors du chargement des succès");
      })
      .finally(() => setLocalAchievementsLoading(false));
  }, [user?.user?.id, VITE_API_URL, achievements]);

  const effectiveAchievements = achievements !== undefined ? achievements : localAchievements;
  const effectiveLoading = achievementsLoading !== undefined ? achievementsLoading : localAchievementsLoading;


  const { t } = useTranslation();

  const getInitials = useCallback(() => {
    if (!user || !user.stagiaire?.prenom) return "U";
    const first = user.stagiaire.prenom.charAt(0).toUpperCase();
    const last = user?.user?.name?.charAt(0).toUpperCase() || "";
    return `${first}${last}`;
  }, [user]);

  const totalPoints = useMemo(() => {
    return (
      user?.points ||
      userProgress?.total_points ||
      userProgress?.totalScore ||
      0
    );
  }, [user?.points, userProgress?.total_points, userProgress?.totalScore]);

  const imageUrl = useMemo(() => {
    if (!user?.user?.image) return null;
    return `${VITE_API_URL_MEDIA}/${user.user.image}?${new Date(
      user?.user?.updated_at
    ).getTime()}`;
  }, [user?.user?.image, user?.user?.updated_at, VITE_API_URL_MEDIA]);

  const userAddress = useMemo(() => {
    // Priorité à l’adresse stagiaire puis user
    const addr = user?.stagiaire?.adresse || user?.user?.adresse || "";
    const ville = user?.stagiaire?.ville || "";
    const cp = user?.stagiaire?.code_postal || "";
    const parts = [addr, cp, ville].filter(Boolean);
    return parts.length ? parts.join(", ") : t("common.address_not_provided");
  }, [user?.stagiaire, user?.user?.adresse]);

  const renderImage = (className: string) => {

    if (imageUrl && !imageError) {
      return (
        <img
          src={imageUrl}
          alt={user?.user?.name || "User"}
          className={`${className} object-cover`}
          loading="lazy"
          onError={() => setImageError(true)}
        />
      );
    }

    return (
      <div
        className={`${className} bg-black text-white flex items-center justify-center text-4xl font-bold font-montserrat`}
      >
        {getInitials()}
      </div>
    );
  };

  const formatDate = (value?: string) => {
    if (!value) return t("common.date_not_provided");
    const d = new Date(value);
    if (isNaN(d.getTime())) return "Non renseignée";
    return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(d);
  };

  const InfoRow = ({ label, value }: { label: string; value: string | number | null | undefined }) => (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-800 dark:text-white break-words">
        {value || "-"}
      </span>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="p-6 md:p-4">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Section Photo de profil */}
          <div className="flex flex-col items-center w-full md:w-auto">
            {/* Photo mobile + desktop combinée */}
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-lg">
                {renderImage("w-full h-full")}
              </div>
            </div>

            {/* Informations utilisateur compactes */}
            <div className="mt-4 text-center md:hidden w-full">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {user?.user?.name || user?.stagiaire?.prenom || "Utilisateur"}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {user?.user?.email || user?.email || "Email non disponible"}
              </p>
              <div className="mt-2 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full inline-block">
                {totalPoints} points
              </div>
              <div className="mt-2">
                <button
                  onClick={() => setShowMoreMobile((v) => !v)}
                  className="text-blue-600 dark:text-blue-400 text-sm underline">
                  {showMoreMobile ? "Voir moins" : "Voir plus"}
                </button>
              </div>
            </div>
          </div>

          {/* Section Principale - Informations + Badges */}
          <div className="flex-1 w-full">
            {/* Informations utilisateur détaillées (desktop) */}
            <div className="hidden md:block mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {user?.user?.name || user?.stagiaire?.prenom || t("common.user_default")}
                  </h1>
                </div>
              </div>
            </div>

            {/* Bloc d'informations détaillées du stagiaire */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 ${showMoreMobile ? "mt-3" : "hidden"} md:grid`}>
              <InfoRow label="Nom" value={user?.user?.name} />
              <InfoRow label="Prénom" value={user?.stagiaire?.prenom} />
              <InfoRow label="Email" value={user?.user?.email || user?.email} />
              <InfoRow label="Téléphone" value={user?.stagiaire?.telephone} />
              <InfoRow label="Ville" value={user?.stagiaire?.ville} />
              <InfoRow label="Code postal" value={user?.stagiaire?.code_postal} />
              <InfoRow label="Adresse" value={userAddress} />
              <InfoRow label="Date de lancement" value={formatDate(user?.stagiaire?.date_debut_formation)} />
              <InfoRow label="Date de vente" value={formatDate(user?.stagiaire?.date_inscription)} />
            </div>

            {/* Badges avec titre réduit et disposition compacte (peut être réactivé si besoin) */}
            {/* <div className="mt-4 md:mt-0">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                Mes badges
              </h3>
              <BadgesDisplay
                badges={effectiveAchievements as any}
                loading={effectiveLoading}
                className="compact-view"
              />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
