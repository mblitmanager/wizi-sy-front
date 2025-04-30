import { Media } from "@/types/media";
import VideoPlayer from "./VideoPlayer";
import SkeletonCard from "../ui/SkeletonCard";
import { FileText, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  media: Media | null;
}

const VITE_API_URL_MEDIA = import.meta.env.VITE_API_URL_MEDIA;

interface Props {
  media: Media | null;
}

export default function MediaPlayer({ media }: Props) {
  if (!media) {
    return <SkeletonCard />;
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
        return <VideoPlayer url={media.url} />;

      case "audio":
        return (
          <div className="p-6 w-full bg-white border rounded-xl shadow-sm  flex items-center gap-4">
            <Music className="w-10 h-10 text-blue-600" />
            <audio
              key={media.url}
              controls
              className="w-full max-w-md rounded-md shadow-inner mx-auto  bg-gray-100">
              <source src={`${VITE_API_URL_MEDIA}/${media.url}`} />
              Votre navigateur ne supporte pas la lecture audio.
            </audio>
          </div>
        );

      case "image":
        return (
          <div className="relative w-full h-full rounded-xl overflow-hidden shadow-sm bg-gray-100 flex items-center justify-center">
            <img
              src={`${VITE_API_URL_MEDIA}/${media.url}`}
              alt={media.titre}
              className="max-h-[480px] w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>
        );

      case "document":
        return (
          <iframe
            src={`${VITE_API_URL_MEDIA}/${media.url}`}
            className="w-full h-full border rounded-md"
            title={media.titre}>
            Ce document ne peut pas être affiché.
          </iframe>
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
    <div>
      <AnimatePresence mode="wait">
        <motion.div
          key={media.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="aspect-video bg-gray-100 rounded-md flex items-center justify-center px-3">
          {renderMediaContent()}
        </motion.div>
      </AnimatePresence>

      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold text-gray-800">{media.titre}</h3>
        <div
          className="prose prose-sm max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: media.description }}
        />
        <div className="flex items-center gap-4 pt-4 text-sm text-gray-500 border-t">
          <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs font-medium">
            {media.categorie}
          </span>
          <span className="text-xs">{media.duree} min</span>
        </div>
      </div>
    </div>
  );
}
