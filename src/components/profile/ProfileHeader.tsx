import React, { useState, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import { User } from "@/types";
import { UserProgress } from "@/types/quiz";
import { useUser } from "@/context/UserContext";
import {
  CameraIcon,
  MapPinIcon,
  PhoneIcon,
  StarIcon,
  Trophy,
} from "lucide-react";
import { LoadingState } from "../quiz/quiz-play/LoadingState";
import useAdvert from "../publiciter/useAdvert";
import AdvertBanner from "../publiciter/AdvertBanner";
interface UserStatsProps {
  userProgress?: UserProgress | null;
}

const ProfileHeader: React.FC<UserStatsProps> = ({ userProgress }) => {
  const VITE_API_URL_MEDIA = import.meta.env.VITE_API_URL_MEDIA;
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const { user, logout, refetchUser } = useUser();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

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
      console.log(user);

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
    if (!user || !user.name) return "U";
    const firstNameInitial =
      user.stagiaire?.prenom?.charAt(0).toUpperCase() || "";
    const lastNameInitial = user.name.charAt(0).toUpperCase();
    return `${firstNameInitial}${lastNameInitial}`;
  };
  const totalPoints =
    user?.points || userProgress?.total_points || userProgress?.totalScore || 0;

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mb-4 mx-2 sm:mx-0">
        {loading && <LoadingState />}
        <div className="flex flex-col items-center gap-3">
          <div className="relative group">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-4 border-white dark:border-gray-700 shadow-md cursor-pointer overflow-hidden transition-all duration-300 group-hover:shadow-lg"
              onClick={handleImageClick}>
              {loading ? (
                <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="loader"></span>
                </div>
              ) : user?.user.image ? (
                <img
                  src={`${VITE_API_URL_MEDIA}/${user?.user.image}`}
                  alt={user?.name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white w-full h-full rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold font-montserrat">
                  {getInitials()}
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />

            <div className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 p-1 rounded-full shadow-sm hover:scale-110 transition duration-300 border border-gray-200 dark:border-gray-600">
              <CameraIcon className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <div className="text-center space-y-1 w-full max-w-[90vw]">
            <h2 className="text-base sm:text-lg font-bold font-montserrat text-gray-800 dark:text-white break-words px-2">
              {user?.stagiaire?.civilite} {user?.name?.toUpperCase()}{" "}
              {user?.stagiaire?.prenom}
            </h2>

            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium break-words px-2">
              {user?.email}
            </div>

            <div className="my-1 sm:my-2">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  user?.role === "admin"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                }`}>
                {user?.role === "admin" ? "Admin" : "Stagiaire"}
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
                    user?.stagiaire?.adresse,
                    user?.stagiaire?.code_postal,
                    user?.stagiaire?.ville,
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
      </div>
    </>
  );
};

export default ProfileHeader;
