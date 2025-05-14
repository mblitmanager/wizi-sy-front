import React from "react";
import { User } from "@/types";
import { CameraIcon, Trophy } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useRef } from "react";
import axios from "axios";

const ProfileHeader: React.FC = () => {
  const VITE_API_URL_MEDIA = import.meta.env.VITE_API_URL_MEDIA;
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const { user, logout } = useUser();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Validate file type and size before sending
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        console.error(
          "Invalid file type. Please upload a JPEG, PNG, or GIF image."
        );
        return;
      }

      if (file.size > maxSize) {
        console.error("File too large. Maximum size is 5MB.");
        return;
      }

      const formData = new FormData();
      formData.append("image", file); // Try "avatar" or "file" if "image" doesn't work

      try {
        const response = await axios.post(
          `${VITE_API_URL}/avatar/${user.user.id}/update-profile`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              // Don't set Content-Type manually for FormData
            },
          }
        );

        console.log("Image mise à jour :", response.data.image);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            "Erreur lors de la mise à jour de l'image :",
            error.response?.data
          );
          // Check for validation errors in response
          if (error.response?.status === 422) {
            console.error("Validation errors:", error.response.data.errors);
          }
        } else {
          console.error("Erreur inattendue :", error);
        }
      }
    }
  };
  const getInitials = () => {
    if (!user || !user.name) return "U";
    const firstNameInitial = user.stagiaire?.prenom
      ? user.stagiaire.prenom.charAt(0).toUpperCase()
      : "";
    const lastNameInitial = user.name.charAt(0).toUpperCase();
    return `${firstNameInitial}${lastNameInitial}`;
  };

  return (
    <div className="container mx-auto mb-2 sm:p-4 border rounded-xl bg-white shadow-sm dark:bg-gray-900 dark:border-gray-800">
      <div className="flex items-center">
        <div
          className="relative w-20 h-20 cursor-pointer group"
          onClick={handleImageClick}>
          {user.user.image ? (
            <div className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-r from-green-400 to-blue-500 shadow-lg flex items-center justify-center">
              <img
                src={`${VITE_API_URL_MEDIA}/${user.user.image}`}
                alt={user.user.name || "User"}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const nextElem = e.currentTarget.nextSibling;
                  if (nextElem && nextElem instanceof HTMLElement) {
                    nextElem.style.display = "flex";
                  }
                }}
              />
            </div>
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

          {/* Icone caméra à l'extérieur */}
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
            {user?.points || 0} points - Niveau {user?.level || 1}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
