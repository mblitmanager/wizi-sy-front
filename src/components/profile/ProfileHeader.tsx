import React from "react";
import { User } from "@/types";
import { Trophy } from "lucide-react";
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
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await axios.put(
          `${VITE_API_URL}/avatar/${user.stagiaire.id}/update-profile`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
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
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center mb-4">
        <div
          className="bg-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mr-4 font-nunito cursor-pointer relative"
          onClick={handleImageClick}>
          {user.user.image ? (
            <img
              src={`${VITE_API_URL_MEDIA}/${user.user.image}`}
              alt={user.user.name || "User"}
              className="w-full h-full rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const nextElem = e.currentTarget.nextSibling;
                if (nextElem && nextElem instanceof HTMLElement) {
                  nextElem.style.display = "flex";
                }
              }}
            />
          ) : (
            getInitials()
          )}

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold font-montserrat">
            {user.stagiaire.prenom} {user.user.name}
          </h2>
          <div className="text-gray-500 font-roboto">{user.user.email}</div>
          <div className="flex items-center mt-1">
            <span className="text-sm font-medium font-nunito">
              {user?.points || 0} points - Niveau {user?.level || 1}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
