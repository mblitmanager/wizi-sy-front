import React, { useState, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import { CameraIcon, Trophy } from "lucide-react";
import { LoadingState } from "../quiz/quiz-play/LoadingState";

const ProfileHeader: React.FC = () => {
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

      const formData = new FormData();
      formData.append("image", file);

      setLoading(true);

      try {
        const response = await axios.post(
          `${VITE_API_URL}/avatar/${user.user.id}/update-profile`,
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

  return (
    <div className="container mx-auto mb-2 sm:p-4 border rounded-xl bg-white shadow-sm dark:bg-gray-900 dark:border-gray-800">
      {loading && <LoadingState />}
      <div className="flex items-center">
        <div
          className="relative w-20 h-20 cursor-pointer group"
          onClick={handleImageClick}>
          {loading ? (
            <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
              <span className="loader"></span>
            </div>
          ) : user.user.image ? (
            <img
              src={`${VITE_API_URL_MEDIA}/${user.user.image}`}
              alt={user.user.name || "User"}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="bg-blue-500 text-white w-full h-full rounded-full flex items-center justify-center text-2xl font-bold font-nunito">
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

          <div className="absolute bottom-[-10px] right-[-10px] bg-white p-2 rounded-full shadow-lg hover:scale-110 transition duration-300">
            <CameraIcon className="text-blue-500" />
          </div>
        </div>

        <div className="ml-4">
          <h2 className="text-xl font-semibold font-montserrat text-gray-800">
            {user.user.name.toUpperCase()} {user.stagiaire.prenom}
          </h2>
          <div className="text-gray-500 font-roboto mb-1">
            {user.user.email}
          </div>
          <div className="text-sm font-medium font-nunito text-gray-600">
            {user.points || 0} points - Niveau {user.level || 1}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
