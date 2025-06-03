import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import { UserProgress } from "@/types/quiz";
import { toast } from "sonner";
import { CameraIcon, PhoneIcon } from "lucide-react";

interface UserStatsProps {
  user: User | null;
  userProgress?: UserProgress | null;
}

const ProfileHeader: React.FC<UserStatsProps> = ({ userProgress }) => {
  const VITE_API_URL_MEDIA = import.meta.env.VITE_API_URL_MEDIA;
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const { logout, refetchUser } = useUser();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(true);

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
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message ||
              "Erreur lors de la mise à jour de l'image"
          );
        } else {
          toast.error("Erreur inattendue");
        }
      } finally {
        setLoading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [VITE_API_URL, user?.user.id, refetchUser]
  );

  const getInitials = useCallback(() => {
    if (!user || !user.stagiaire.prenom) return "U";
    const firstNameInitial =
      user.stagiaire?.prenom?.charAt(0).toUpperCase() || "";
    const lastNameInitial = user?.user?.name.charAt(0).toUpperCase();
    return `${firstNameInitial}${lastNameInitial}`;
  }, [user]);

  const totalPoints = useMemo(
    () =>
      user?.points ||
      userProgress?.total_points ||
      userProgress?.totalScore ||
      0,
    [user?.points, userProgress?.total_points, userProgress?.totalScore]
  );

  const imageUrl = useMemo(() => {
    if (!user?.user?.image) return null;
    return `${VITE_API_URL_MEDIA}/${user.user.image}?${new Date(
      user?.user?.updated_at
    ).getTime()}`;
  }, [user?.user?.image, user?.user?.updated_at, VITE_API_URL_MEDIA]);

  const userAddress = useMemo(
    () =>
      [
        user?.stagiaire?.adresse,
        user?.stagiaire?.code_postal,
        user?.stagiaire?.ville,
      ]
        .filter(Boolean)
        .join(", ") || "Adresse non renseignée",
    [
      user?.stagiaire?.adresse,
      user?.stagiaire?.code_postal,
      user?.stagiaire?.ville,
    ]
  );

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
        className={`${className} bg-brown-shade text-white flex items-center justify-center text-4xl font-bold font-montserrat`}
      >
        {getInitials()}
      </div>
    );
  };

  return (
    <div className="mt-4">
      <div className="max-w-4xl flex flex-col lg:flex-row items-center h-auto mx-auto lg:my-0">
        {/* Image mobile seulement - visible sur mobile, cachée sur desktop */}
        <div className="lg:hidden rounded-full shadow-xl mx-auto -mt-16 h-48 w-48 bg-cover bg-center relative group mb-4">
          {loading ? (
            <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brown-shade"></div>
            </div>
          ) : imageUrl && imageLoaded ? (
            <img
              src={imageUrl}
              alt={user?.user?.name || "User"}
              className="w-full h-full object-cover rounded-full"
              loading="eager"
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageLoaded(false);
                setImageError(true);
              }}
            />
          ) : (
            <div className="bg-brown-shade text-white w-full h-full rounded-full flex items-center justify-center text-4xl font-bold font-montserrat">
              {getInitials()}
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
          />
          <button
            onClick={handleImageClick}
            className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm hover:scale-110 transition duration-300 border border-gray-200 dark:border-gray-600 cursor-pointer"
            aria-label="Changer la photo de profil"
          >
            <CameraIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </button>
        </div>

        {/* Main Content */}
        <div
          id="profile"
          className="w-full lg:w-3/5 rounded-lg lg:rounded-l-lg lg:rounded-r-none shadow-2xl bg-white dark:bg-gray-900 opacity-95 mx-0 lg:mx-0"
        >
          <div className="p-4 md:p-6 text-center lg:text-left">
            <h1 className="text-3xl font-bold pt-8 lg:pt-0">
              {user?.stagiaire?.civilite} {user?.user.name.toUpperCase()}{" "}
              {user?.stagiaire.prenom}
            </h1>

            <div className="mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-brown-shade opacity-25"></div>

            <p className="pt-4 text-base font-bold flex items-center justify-center lg:justify-start dark:text-gray-300">
              <svg
                className="h-4 fill-current text-brown-shade dark:text-brown-shade pr-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9 12H1v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6h-8v2H9v-2zm0-1H0V5c0-1.1.9-2 2-2h4V2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1h4a2 2 0 0 1 2 2v6h-9V9H9v2zm3-8V2H8v1h4z" />
              </svg>
              {user?.user?.role || user?.role || "stagiaire"}
            </p>

            <p className="pt-2 text-gray-600 dark:text-gray-400 text-xs lg:text-sm flex items-center justify-center lg:justify-start">
              <svg
                className="h-4 fill-current text-brown-shade dark:text-brown-shade pr-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm7.75-8a8.01 8.01 0 0 0 0-4h-3.82a28.81 28.81 0 0 1 0 4h3.82zm-.82 2h-3.22a14.44 14.44 0 0 1-.95 3.51A8.03 8.03 0 0 0 16.93 14zm-8.85-2h3.84a24.61 24.61 0 0 0 0-4H8.08a24.61 24.61 0 0 0 0 4zm.25 2c.41 2.4 1.13 4 1.67 4s1.26-1.6 1.67-4H8.33zm-6.08-2h3.82a28.81 28.81 0 0 1 0-4H2.25a8.01 8.01 0 0 0 0 4zm.82 2a8.03 8.03 0 0 0 4.17 3.51c-.42-.96-.74-2.16-.95-3.51H3.07zm13.86-8a8.03 8.03 0 0 0-4.17-3.51c.42.96.74 2.16.95 3.51h3.22zm-8.6 0h3.34c-.41-2.4-1.13-4-1.67-4S8.74 3.6 8.33 6zM3.07 6h3.22c.2-1.35.53-2.55.95-3.51A8.03 8.03 0 0 0 3.07 6z" />
              </svg>
              {[
                user.stagiaire?.adresse,
                user.stagiaire?.code_postal,
                user.stagiaire?.ville,
              ]
                .filter(Boolean)
                .join(", ") || "Adresse non renseignée"}
            </p>

            <div className="pt-8 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                <PhoneIcon className="w-4 h-4 text-brown-shade" />
                <span>{user?.stagiaire?.telephone || "Non renseigné"}</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <svg
                  className="w-4 h-4 fill-current text-brown-shade dark:text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0 0 16 4H4a2 2 0 0 0-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.118z" />
                </svg>
                <span>{user.user.email || user.email || ""}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Image desktop seulement - cachée sur mobile, visible sur desktop */}
        <div className="hidden lg:flex w-full lg:w-[200px] h-[250px] relative">
          <div className="w-full h-full rounded-none lg:rounded-lg shadow-2xl relative group overflow-hidden">
            {loading ? (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brown-shade"></div>
              </div>
            ) : imageUrl && imageLoaded ? (
              <img
                src={imageUrl}
                alt={user?.user?.name || "User"}
                className="w-full h-full object-cover rounded-lg"
                loading="eager"
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  setImageLoaded(false);
                  setImageError(true);
                }}
              />
            ) : (
              <div className="w-full h-full bg-brown-shade text-white flex items-center justify-center text-6xl font-bold font-montserrat">
                {getInitials()}
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />

            <button
              onClick={handleImageClick}
              className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm hover:scale-110 transition duration-300 border border-gray-200 dark:border-gray-600 cursor-pointer"
              aria-label="Changer la photo de profil"
            >
              <CameraIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
