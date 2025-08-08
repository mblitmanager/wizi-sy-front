import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import BadgesDisplay from "./BadgesDisplay";
import axios from "axios";
import { useUser } from "@/hooks/useAuth";
import { UserProgress } from "@/types/quiz";
import { toast } from "sonner";
import { CameraIcon } from "lucide-react";

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
  };
  user?: {
    id: string | number;
    name: string;
    email: string;
    role?: string;
    image?: string | null;
    updated_at?: string;
  };
}

interface UserStatsProps {
  user: User | null;
  userProgress?: UserProgress | null;
}

const ProfileHeader: React.FC<UserStatsProps> = ({ user, userProgress }) => {
  const [achievements, setAchievements] = useState([]);
  const [achievementsLoading, setAchievementsLoading] = useState(false);

  const VITE_API_URL_MEDIA = import.meta.env.VITE_API_URL_MEDIA;
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const { logout, refetchUser } = useUser();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(true);

  useEffect(() => {
    if (!user?.user?.id) return;
    setAchievementsLoading(true);
    axios
      .get(`${VITE_API_URL}/achievements/${user.user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const badges = res.data || [];
        // Ajout de badges de test si non présents
        const testBadges = [
          {
            id: "connexion_serie",
            name: "Série de connexions",
            description: "Connectez-vous plusieurs jours d'affilée",
            icon: "🔥",
            type: "connexion_serie",
          },
          {
            id: "first_login",
            name: "Première connexion",
            description: "Connectez-vous pour la première fois",
            icon: "🎉",
            type: "connexion_serie",
          },
          {
            id: "first_quiz",
            name: "Premier quiz",
            description: "Terminez votre premier quiz",
            icon: "🏆",
            type: "quiz",
          },
          {
            id: "first_video",
            name: "Première vidéo",
            description: "Regardez votre première vidéo",
            icon: "🎬",
            type: "video",
          },
          {
            id: "first_parrainage",
            name: "Premier parrainage",
            description: "Parrainez un utilisateur pour la première fois",
            icon: "🤝",
            type: "parrainage",
          },
        ];
        // Ajoute les badges de test s'ils ne sont pas déjà présents (par id ou type)
        testBadges.forEach((testBadge) => {
          if (
            !badges.some(
              (b) => b.id === testBadge.id || b.type === testBadge.type
            )
          ) {
            badges.push(testBadge);
          }
        });
        setAchievements(badges);
      })
      .catch(() => {
        toast.error("Erreur lors du chargement des succès");
      })
      .finally(() => setAchievementsLoading(false));
  }, [user?.user?.id, VITE_API_URL]);

  const handleImageClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleImageChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      const maxSize = 5 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        toast.error(
          "Type de fichier invalide. Veuillez choisir un JPEG, PNG ou GIF."
        );
        return;
      }

      if (file.size > maxSize) {
        toast.error("Fichier trop volumineux. Taille maximale : 5MB.");
        return;
      }

      const formData = new FormData();
      formData.append("image", file);

      setLoading(true);
      setImageError(false);

      try {
        await axios.post(
          `${VITE_API_URL}/avatar/${user?.user.id}/update-profile`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Image mise à jour avec succès");
        await refetchUser();
      } catch (error) {
        setImageError(true);
        toast.error("Erreur lors de la mise à jour de l'image");
      } finally {
        setLoading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [VITE_API_URL, user, refetchUser]
  );

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
    return (
      [
        user?.stagiaire?.adresse,
        user?.stagiaire?.code_postal,
        user?.stagiaire?.ville,
      ]
        .filter(Boolean)
        .join(", ") || "Adresse non renseignée"
    );
  }, [user?.stagiaire]);

  const renderImage = (className: string) => {
    if (loading) {
      return (
        <div
          className={`${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brown-shade"></div>
        </div>
      );
    }

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
              <button
                onClick={handleImageClick}
                className="absolute bottom-2 right-2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md hover:scale-110 transition-transform"
                aria-label="Changer la photo de profil"
              >
                <CameraIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            {/* Informations utilisateur compactes */}
            <div className="mt-4 text-center md:hidden">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {user?.stagiaire?.prenom || "Utilisateur"}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {user?.email || "Email non disponible"}
              </p>
              <div className="mt-2 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full inline-block">
                {totalPoints} points
              </div>
            </div>
          </div>

          {/* Section Principale - Informations + Badges */}
          <div className="flex-1 w-full">
            {/* Informations utilisateur détaillées (desktop) */}
            <div className="hidden md:block mb-6">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                {user?.stagiaire?.prenom || "Utilisateur"}{" "}
                {user?.user?.name ? `(${user.user.name})` : ""}
              </h1>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Email:</span> {user?.email}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Points:</span> {totalPoints}
                </div>
                {user?.stagiaire?.telephone && (
                  <div className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Tél:</span>{" "}
                    {user.stagiaire.telephone}
                  </div>
                )}
              </div>
              {userAddress && (
                <div className="mt-2 text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Adresse:</span> {userAddress}
                </div>
              )}
            </div>

            {/* Badges avec titre réduit et disposition compacte */}
            <div className="mt-4 md:mt-0">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                Mes badges
              </h3>
              <BadgesDisplay
                badges={achievements}
                loading={achievementsLoading}
                className="compact-view"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
