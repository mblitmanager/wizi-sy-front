import { Media } from "@/types/media";
import VideoPlayer from "./VideoPlayer";
import { Bookmark, FileText, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SkeletonCard from "@/components/ui/SkeletonCard";
import { stripHtmlTags } from "@/utils/UtilsFunction";

const VITE_API_URL_MEDIA = import.meta.env.VITE_API_URL_MEDIA;
const VITE_API_URL = import.meta.env.VITE_API_URL;

// MediaPlayer.tsx
interface Props {
  media: Media | null;
  className?: string;
}

export default function MediaPlayer({
  media,
  className = "",
}: Props & { className?: string }) {
  if (!media) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 w-full max-w-full max-w-[100vw] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>Sélectionnez un média dans la playlist</p>
        </div>
      </div>
    );
  }

  const renderMediaContent = () => {
    if (!media.url) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500 p-4 w-full">
          <p className="italic">Pas de média disponible</p>
        </div>
      );
    }

    switch (media.type) {
      case "video":
        return (
          <div className="relative aspect-video bg-black rounded-t-lg overflow-hidden w-full max-w-full max-w-[100vw] mx-auto">
            <VideoPlayer
              key={media.url}
              url={media.url}
              className="w-full h-full"
            />
          </div>
        );

      case "audio":
        return (
          <div className="p-4 w-full bg-gray-100 rounded-t-lg flex items-center gap-4">
            <Music className="w-8 h-8 text-yellow-400 shrink-0" />
            <audio
              key={media.url}
              controls
              className="w-full rounded-md min-w-0"
            >
              <source src={`${VITE_API_URL}/media/stream/${media.url}`} />
              Votre navigateur ne supporte pas la lecture audio.
            </audio>
          </div>
        );

      case "image":
        return (
          <div className="relative w-full aspect-video bg-gray-100 rounded-t-lg overflow-hidden flex items-center justify-center">
            <img
              src={`${VITE_API_URL_MEDIA}/${media.url}`}
              alt={media.titre}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        );

      case "document":
        return (
          <div className="w-full aspect-video bg-gray-100 rounded-t-lg overflow-hidden flex items-center justify-center">
            <FileText className="w-16 h-16 text-gray-400 shrink-0" />
            <p className="ml-2 text-gray-600 truncate">
              Document: {media.titre}
            </p>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500 p-4 w-full">
            <FileText className="w-6 h-6 mr-2 shrink-0" />
            <p className="italic truncate">Type de média non pris en charge</p>
          </div>
        );
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden w-full max-w-full max-w-[100vw] ${className}`}
    >
      {renderMediaContent()}

      <div className="p-2 sm:p-3 lg:p-4 border-t w-full max-w-full max-w-[100vw]">
        <div className="flex justify-between items-center w-full">
          <div className="min-w-0">
            <h3 className="text-sm lg:text-lg font-bold text-gray-800 truncate">
              {media?.titre || "Aucun média sélectionné"}
            </h3>
            {media && (
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full text-xs whitespace-nowrap">
                  {media.categorie}
                </span>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {media.duree} min
                </span>
              </div>
            )}
          </div>
          <button className="text-gray-400 hover:text-gray-600 shrink-0">
            <Bookmark className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>
        </div>
        <div className="mt-2 w-full">
          <p className="text-sm text-gray-600 break-words">
            {stripHtmlTags(media.description)}
          </p>
        </div>
      </div>
    </div>
  );
}
