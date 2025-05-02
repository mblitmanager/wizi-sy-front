
import { Media } from "@/types/media";
import clsx from "clsx";
import { PlayCircle, FileText, ImageIcon, Music, Video } from "lucide-react";

interface Props {
  medias: Media[];
  selectedMedia: Media | null;
  onSelect: (media: Media) => void;
}

const typeIcons: Record<
  "video" | "document" | "image" | "audio",
  React.ElementType
> = {
  video: Video,
  document: FileText,
  image: ImageIcon,
  audio: Music,
};

const typeLabels: Record<"video" | "document" | "image" | "audio", string> = {
  video: "Vidéos",
  audio: "Audios",
  image: "Images",
  document: "Documents",
};

export default function MediaList({ medias, selectedMedia, onSelect }: Props) {
  // S'assurer que medias est bien un tableau
  const safeMedias = Array.isArray(medias) ? medias : [];
  
  const grouped = safeMedias
    .filter((m) => ["video", "audio", "image", "document"].includes(m.type))
    .reduce((acc, media) => {
      const type = media.type as keyof typeof typeLabels;
      acc[type] = acc[type] || [];
      acc[type].push(media);
      return acc;
    }, {} as Record<keyof typeof typeLabels, Media[]>);

  // Tri des groupes selon `ordre`
  Object.keys(grouped).forEach((type) => {
    grouped[type as keyof typeof grouped].sort((a, b) => a.ordre - b.ordre);
  });

  return (
    <div className="mb-8 p-4 space-y-8">
      {Object.entries(grouped).map(([type, mediaGroup]) => {
        const Icon = typeIcons[type as keyof typeof typeIcons];
        const label = typeLabels[type as keyof typeof typeLabels];
        return (
          <div key={type}>
            <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-4">
              <Icon className="w-5 h-5 text-blue-600" />
              {label}
            </h2>
            <div className="space-y-4">
              {mediaGroup.map((media) => {
                const MediaIcon =
                  typeIcons[media.type as keyof typeof typeIcons];
                return (
                  <div
                    key={media.id}
                    onClick={() => onSelect(media)}
                    className={clsx(
                      "relative flex items-center gap-4 p-4 rounded-xl shadow-md transition-all cursor-pointer border",
                      selectedMedia?.id === media.id
                        ? "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-500"
                        : "bg-white hover:bg-gray-50 border-gray-200"
                    )}>
                    <div className="shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <MediaIcon className="w-6 h-6 text-blue-600" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-800">
                        {media.titre}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                          {media.categorie}
                        </span>
                        <span>{media.duree} min</span>
                      </div>
                    </div>

                    <div
                      className={clsx(
                        "w-3 h-3 rounded-full absolute top-4 right-4",
                        selectedMedia?.id === media.id
                          ? "bg-blue-500"
                          : "bg-gray-300"
                      )}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
