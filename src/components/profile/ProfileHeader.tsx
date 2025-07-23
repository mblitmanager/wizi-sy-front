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
            id: 'connexion_serie',
            name: 'Série de connexions',
            description: 'Connectez-vous plusieurs jours d\'affilée',
            icon: '🔥',
            type: 'connexion_serie',
          },
          {
            id: 'first_login',
            name: 'Première connexion',
            description: 'Connectez-vous pour la première fois',
            icon: '🎉',
            type: 'connexion_serie',
          },
          {
            id: 'first_quiz',
            name: 'Premier quiz',
            description: 'Terminez votre premier quiz',
            icon: '🏆',
            type: 'quiz',
          },
          {
            id: 'first_video',
            name: 'Première vidéo',
            description: 'Regardez votre première vidéo',
            icon: '🎬',
            type: 'video',
          },
          {
            id: 'first_parrainage',
            name: 'Premier parrainage',
            description: 'Parrainez un utilisateur pour la première fois',
            icon: '🤝',
            type: 'parrainage',
          },
        ];
        // Ajoute les badges de test s'ils ne sont pas déjà présents (par id ou type)
        testBadges.forEach((testBadge) => {
          if (!badges.some((b) => b.id === testBadge.id || b.type === testBadge.type)) {
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
        toast.error("Type de fichier invalide. Veuillez choisir un JPEG, PNG ou GIF.");
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
        <div className={`${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}>
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
      <div className={`${className} bg-brown-shade text-white flex items-center justify-center text-4xl font-bold font-montserrat`}>
        {getInitials()}
      </div>
    );
  };

  return (
    <div className="mt-4">
      <div className="max-w-4xl flex flex-col lg:flex-row items-center h-auto mx-auto lg:my-0 gap-4">
        
        {/* Image profil - Mobile */}
        <div className="lg:hidden rounded-full shadow-xl mx-auto -mt-16 h-48 w-48 bg-cover bg-center relative group mb-4">
          {renderImage("w-full h-full rounded-full")}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
          <button
            type="button"
            className="absolute bottom-2 right-2 bg-brown-shade text-white rounded-full p-2 shadow-lg hover:bg-brown-dark"
            onClick={handleImageClick}
          >
            <CameraIcon size={24} />
          </button>
        </div>

        {/* Image profil - Desktop */}
        <div className="hidden lg:flex w-full lg:w-[200px] h-[250px] relative">
          <div className="w-full h-full rounded-none lg:rounded-lg shadow-2xl relative group overflow-hidden">
            {renderImage("w-full h-full rounded-lg")}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
            <button
              onClick={handleImageClick}
              className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm hover:scale-110 transition duration-300 border border-gray-200 dark:border-gray-600"
              aria-label="Changer la photo de profil"
            >
              <CameraIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </button>
          </div>
        </div>

        {/* Badges dynamiques */}
        <div className="w-full mt-4">
          <BadgesDisplay badges={achievements} loading={achievementsLoading} />
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
