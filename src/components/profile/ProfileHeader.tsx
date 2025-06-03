import { useEffect, useRef, useState } from "react";
import axios from "axios";

import { useUser } from "../../context/UserContext";
import { UserProgress } from "@/types/quiz";
import { toast } from "sonner";
import { CameraIcon, PhoneIcon } from "lucide-react";
import { LoadingState } from "../quiz/quiz-play/LoadingState";
interface UserStatsProps {
  userProgress?: UserProgress | null;
}
const ProfileHeader: React.FC<UserStatsProps> = ({ userProgress }) => {
  const VITE_API_URL_MEDIA = import.meta.env.VITE_API_URL_MEDIA;
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const { user, logout, refetchUser } = useUser();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  useEffect(() => {
    if (user?.user?.image) {
      const img = new Image();
      img.src = `${VITE_API_URL_MEDIA}/${user.user.image}`;
      img.onload = () => setImageLoaded(true);
    }
  }, [user?.user?.image]);
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
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

      try {
        const response = await axios.post(
          `${VITE_API_URL}/avatar/${user?.user.id}/update-profile`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        toast.success("Image mise à jour avec succès");
        await refetchUser();
      } catch (error) {
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
      }
    }
  };

  const getInitials = () => {
    if (!user || !user.stagiaire || !user.stagiaire.prenom || !user.user || !user.user.name) return "U";
    const firstNameInitial = user.stagiaire.prenom.charAt(0).toUpperCase();
    const lastNameInitial = user.user.name.charAt(0).toUpperCase();
    return `${firstNameInitial}${lastNameInitial}`;
  };

  const totalPoints =
    user?.points || userProgress?.total_points || userProgress?.totalScore || 0;

  return (
    <div className="mt-4">
      <div className="max-w-4xl flex items-center h-auto flex-wrap mx-auto lg:my-0">
        {/* Main Content */}
        <div
          id="profile"
          className="w-full lg:w-3/5 rounded-lg lg:rounded-l-lg lg:rounded-r-none shadow-2xl bg-white dark:bg-gray-900 opacity-95 mx-6 lg:mx-0">
          <div className="p-4 md:p-6 text-center lg:text-left">
            {/* Mobile Image */}
            <div className="block lg:hidden rounded-full shadow-xl mx-auto -mt-16 h-48 w-48 bg-cover bg-center relative group">
              {loading ? (
                <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="loader"></span>
                </div>
              ) : user?.user?.image ? (
                <img
                  src={`${VITE_API_URL_MEDIA}/${user?.user.image}`}
                  alt={user?.user?.name || "User"}
                  className="w-full h-full object-cover rounded-full"
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
              <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm hover:scale-110 transition duration-300 border border-gray-200 dark:border-gray-600 cursor-pointer">
                <CameraIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-orange-500 pt-8 lg:pt-0">
              {user?.stagiaire?.civilite} {user?.user.name.toUpperCase()}{" "}
              {user?.stagiaire.prenom}
            </h1>

            <div className="mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-brown-shade opacity-25"></div>

            <p className="pt-4 text-base font-bold flex items-center justify-center lg:justify-start dark:text-gray-300">
              <svg
                className="h-4 fill-current text-brown-shade dark:text-brown-shade pr-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20">
                <path d="M9 12H1v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6h-8v2H9v-2zm0-1H0V5c0-1.1.9-2 2-2h4V2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1h4a2 2 0 0 1 2 2v6h-9V9H9v2zm3-8V2H8v1h4z" />
              </svg>
              {user?.user.role === "admin" ? "Administrateur" : "Stagiaire"}
            </p>

            <p className="pt-2 text-gray-600 dark:text-gray-400 text-xs lg:text-sm flex items-center justify-center lg:justify-start">
              <svg
                className="h-4 fill-current text-brown-shade dark:text-brown-shade pr-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20">
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
                  viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0 0 16 4H4a2 2 0 0 0-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.118z" />
                </svg>
                <span>{user.user.email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[300px] h-[300px] relative">
          {/* Desktop Image */}
          <div className="w-full h-full rounded-none lg:rounded-lg shadow-2xl relative group overflow-hidden">
            {loading || !imageLoaded ? (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="loader" />
              </div>
            ) : user?.user?.image ? (
              <img
                src={`${VITE_API_URL_MEDIA}/${user?.user.image}`}
                alt={user?.user?.name || "User"}
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover rounded-lg"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)} // Fallback en cas d'erreur de chargement
              />
            ) : (
              <div className="w-full h-full bg-brown-shade text-white flex items-center justify-center text-6xl font-bold font-montserrat">
                {getInitials()}
              </div>
            )}

            {/* Hidden file input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />

            {/* Camera Icon Overlay */}
            <div
              onClick={handleImageClick}
              className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm hover:scale-110 transition duration-300 border border-gray-200 dark:border-gray-600 cursor-pointer">
              <CameraIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <div className="text-center space-y-1 w-full max-w-[90vw]">
            <h2 className="text-base sm:text-lg font-bold font-montserrat text-gray-800 dark:text-white break-words px-2">
              {user?.stagiaire?.civilite} {user?.user?.name?.toUpperCase() || ""} {user?.stagiaire?.prenom}
            </h2>

            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium break-words px-2">
              {user?.user?.email || ""}
            </div>

            <div className="my-1 sm:my-2">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  user?.user?.role === "admin"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                }`}
              >
                {user?.user?.role === "admin" ? "Admin" : "Stagiaire"}
              </span>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mt-1 sm:mt-2 px-2">
              <div className="flex items-center justify-center gap-1 break-words">
                <PhoneIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                <span>{user?.stagiaire?.telephone || "Non renseigné"}</span>
              </div>
              <div className="flex items-center justify-center gap-1 break-words">
                <MapPinIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                <span>
                  {[
                    user.stagiaire?.adresse,
                    user.stagiaire?.code_postal,
                    user.stagiaire?.ville,
                  ]
                    .filter(Boolean)
                    .join(", ") || "Adresse non renseignée"}
                </span>
              </div>
            </div>

            {/* <div className="flex justify-center gap-2 mt-2 sm:mt-3 flex-wrap">
              <span className="text-xs px-2 py-0.5 sm:py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full">
                Niveau {userProgress?.level || 1}
              </span>
              <span className="text-xs px-2 py-0.5 sm:py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-full flex items-center gap-1">
                <StarIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />{" "}
                {totalPoints || 0} points
              </span>
            </div> */}
          </div>
        </div>

        {loading}
      </div>
    </div>
  );
};

export default ProfileHeader;
