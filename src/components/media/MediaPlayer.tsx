import { Media } from "@/types/media";
import VideoPlayer from "./VideoPlayer";
import SkeletonCard from "../ui/SkeletonCard";
import { FileText, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  media: Media | null;
}

const VITE_API_URL_MEDIA = import.meta.env.VITE_API_URL_MEDIA;
const VITE_API_URL = import.meta.env.VITE_API_URL;

interface Props {
  media: Media | null;
}

export default function MediaPlayer({ media }: Props) {
  if (!media) {
    return <SkeletonCard />;
  }

  let computedDuration = media.duree ?? undefined;

  const formatMinutes = (seconds?: number) => {
    if (typeof seconds !== "number") return null;
    const minutes = Math.max(1, Math.round(seconds / 60));
    return `${minutes} min`;
  };

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
          <VideoPlayer
            url={media.url}
            onDuration={(s) => {
              // mutation locale pour affichage en bas
              computedDuration = s;
            }}
          />
        );

      case "audio":
        return (
          <div className="p-4 sm:p-6 w-full bg-white border rounded-xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Music className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
            <audio
              key={media.url}
              controls
              className="w-full max-w-full sm:max-w-md rounded-md shadow-inner bg-gray-100">
              <source src={`${VITE_API_URL}/media/stream/${media.url}`} />
              Votre navigateur ne supporte pas la lecture audio.
            </audio>
          </div>
        );

      case "image":
        return (
          <div className="relative w-full max-h-[60vh] rounded-xl overflow-hidden shadow-sm bg-gray-100 flex items-center justify-center">
            <img
              src={`${VITE_API_URL_MEDIA}/${media.url}`}
              alt={media.titre}
              className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>
        );

      case "document":
        return (
          <div className="w-full h-[60vh] sm:h-[70vh] border rounded-md overflow-hidden">
            <iframe
              src={`${VITE_API_URL_MEDIA}/${media.url}`}
              className="w-full h-full"
              title={media.titre}>
              Ce document ne peut pas être affiché.
            </iframe>
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
    <div className="w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={media.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="w-full aspect-video sm:aspect-video bg-gray-100 rounded-md flex items-center justify-center px-0 sm:px-3">
          {renderMediaContent()}
        </motion.div>
      </AnimatePresence>

      <div className="p-3 sm:p-4 space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-gray-800">
          {media.titre}
        </h3>
        <div
          className="prose prose-sm sm:prose max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: media.description }}
        />
        <div className="flex flex-wrap items-center gap-2 pt-3 text-xs text-gray-500 border-t">
          <span className="bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full font-medium">
            {media.categorie}
          </span>
          <span>
            {formatMinutes(computedDuration) || (typeof media.duree === "number" ? `${media.duree} min` : "")}
          </span>
        </div>
      </div>
    </div>
  );
}
