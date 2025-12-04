import { Media } from "@/types/media";
import VideoPlayer from "./VideoPlayer";
import { Bookmark, FileText, Music, Play } from "lucide-react";
import { stripHtmlTags } from "@/utils/UtilsFunction";
import DOMPurify from "dompurify";

const VITE_API_URL_MEDIA = import.meta.env.VITE_API_URL_MEDIA;
const VITE_API_URL = import.meta.env.VITE_API_URL;

interface Props {
  media: Media | null;
  className?: string;
  showDescription?: boolean;
}

export default function MediaPlayer({
  media,
  className = "",
  showDescription = true,
}: Props) {
  if (!media) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center">
        <Play className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-500 mb-2">
          Aucun média sélectionné
        </h3>
        <p className="text-gray-400 text-sm">
          Choisissez un média dans la liste pour commencer
        </p>
      </div>
    );
  }

  const renderMediaContent = () => {
    if (!media.url) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] bg-gray-100 rounded-t-2xl p-8 text-center">
          <FileText className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-gray-500 font-medium">Aucun contenu disponible</p>
          <p className="text-gray-400 text-sm mt-1">{media.titre}</p>
        </div>
      );
    }

    switch (media.type) {
      case "video": {
        return (
          <div className="relative bg-black rounded-t-2xl overflow-hidden w-full aspect-video max-h-[60vh]">
            <VideoPlayer
              key={media.id}
              url={media.video_url || media.url}
              mediaId={media.id}
              stagiaireId={0}
              subtitleUrl={media.subtitle_url}
              subtitleLanguage={media.subtitle_language || 'fr'}
            />
          </div>
        );
      }

      case "audio":
        return (
          <div className="min-h-[200px] bg-gradient-to-br from-purple-50 to-blue-50 rounded-t-2xl flex flex-col items-center justify-center p-6">
            <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
              <Music className="w-10 h-10 text-purple-600" />
            </div>
            <audio
              key={media.url}
              controls
              className="w-full max-w-md rounded-lg bg-white shadow-sm">
              <source src={`${VITE_API_URL}/media/stream/${media.url}`} />
              Votre navigateur ne supporte pas la lecture audio.
            </audio>
          </div>
        );

      case "image":
        return (
          <div className="min-h-[400px] max-h-[60vh] bg-gray-100 rounded-t-2xl overflow-hidden flex items-center justify-center p-4">
            <img
              src={`${VITE_API_URL_MEDIA}/${media.url}`}
              alt={media.titre}
              className="max-h-full max-w-full object-contain rounded-lg"
            />
          </div>
        );

      case "document":
        return (
          <div className="min-h-[300px] bg-gradient-to-br from-green-50 to-emerald-50 rounded-t-2xl flex flex-col items-center justify-center p-8 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
              <FileText className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Document
            </h3>
            <p className="text-gray-600 text-sm max-w-md">{media.titre}</p>
            <button className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
              Télécharger
            </button>
          </div>
        );

      default:
        return (
          <div className="min-h-[300px] bg-gray-100 rounded-t-2xl flex flex-col items-center justify-center p-8 text-center">
            <FileText className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-gray-500 font-medium">Type non supporté</p>
            <p className="text-gray-400 text-sm mt-1">{media.type}</p>
          </div>
        );
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden w-full max-w-full ${className}`}>
      {/* Contenu média avec hauteur cohérente */}
      <div className="w-full">{renderMediaContent()}</div>

      {/* Informations média */}
      <div className="p-4 sm:p-6 border-t border-gray-100">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="min-w-0 flex-1">
            {/* <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 break-words">
              {media.titre}
            </h3> */}

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                {media.categorie}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                {media.type}
              </span>
              {media.duree && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">
                  ⏱ {media.duree} min
                </span>
              )}
            </div>
          </div>

          <button
            className="flex-shrink-0 p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            title="Marquer comme favori">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>

        {/* Description */}
        {showDescription && media.description && (
          <div
            className="text-sm text-gray-700"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(media.description),
            }}
          />
        )}
      </div>
    </div>
  );
}
