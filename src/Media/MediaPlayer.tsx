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
}

export default function MediaPlayer({ media }: Props) {
  if (!media) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>Sélectionnez un média dans la playlist</p>
        </div>
      </div>
    );
  }

  const renderMediaContent = () => {
    if (!media.url) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500 p-4">
          <p className="italic">Pas de média disponible</p>
        </div>
      );
    }

    switch (media.type) {
      case "video":
        return (
          <div className="relative aspect-video bg-black rounded-t-lg overflow-hidden">
            <VideoPlayer key={media.url} url={media.url} />
          </div>
        );

      case "audio":
        return (
          <div className="p-4 w-full bg-gray-100 rounded-t-lg flex items-center gap-4">
            <Music className="w-8 h-8 text-yellow-400" />
            <audio key={media.url} controls className="w-full rounded-md">
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
            <FileText className="w-16 h-16 text-gray-400" />
            <p className="ml-2 text-gray-600">Document: {media.titre}</p>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500 p-4">
            <FileText className="w-6 h-6 mr-2" />
            <p className="italic">Type de média non pris en charge</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {renderMediaContent()}

      <div className="p-3 lg:p-4 border-t">
        <div className="flex justify-between items-center">
          <div className="truncate">
            <h3 className="text-sm lg:text-lg font-bold text-gray-800 truncate">
              {media?.titre || "Aucun média sélectionné"}
            </h3>
            {media && (
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full text-xs">
                  {media.categorie}
                </span>
                <span className="text-xs text-gray-500">{media.duree} min</span>
              </div>
            )}
          </div>
          <button className="text-gray-400 hover:text-gray-600 shrink-0">
            <Bookmark className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>
        </div>
        <div className="mt-2 text-wrap ">
          <p className="text-sm text-gray-600">
            {stripHtmlTags(media.description)}
          </p>
        </div>
      </div>
    </div>
  );
}
