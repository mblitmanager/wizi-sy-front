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
  const grouped = medias
    .filter((m) => ["video", "audio", "image", "document"].includes(m.type))
    .reduce((acc, media) => {
      const type = media.type as keyof typeof typeLabels;
      acc[type] = acc[type] || [];
      acc[type].push(media);
      return acc;
    }, {} as Record<keyof typeof typeLabels, Media[]>);

  Object.keys(grouped).forEach((type) => {
    grouped[type as keyof typeof grouped].sort((a, b) => a.ordre - b.ordre);
  });

  return (
    <div className="mb-6 p-2 sm:p-4 space-y-6">
      {Object.entries(grouped).map(([type, mediaGroup]) => {
        const Icon = typeIcons[type as keyof typeof typeIcons];
        const label = typeLabels[type as keyof typeof typeLabels];
        return (
          <div key={type}>
            <h2 className="text-sm sm:text-base font-semibold text-gray-700 flex items-center gap-2 mb-3">
              <Icon className="w-5 h-5 text-blue-600" />
              {label}
            </h2>
            <div className="space-y-3">
              {mediaGroup.map((media) => {
                const MediaIcon =
                  typeIcons[media.type as keyof typeof typeIcons];
                return (
                  <div
                    key={media.id}
                    onClick={() => onSelect(media)}
                    className={clsx(
                      "flex items-start gap-3 p-3 rounded-xl shadow-sm transition-all cursor-pointer border sm:items-center",
                      selectedMedia?.id === media.id
                        ? "bg-blue-50 border-blue-400"
                        : "bg-white hover:bg-gray-50 border-gray-200"
                    )}>
                    <div className="shrink-0 w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                      <MediaIcon className="w-5 h-5 text-blue-600" />
                    </div>

                    <div className="flex-1 space-y-1">
                      <h3 className="text-sm font-semibold text-gray-800">
                        {media.titre}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                          {media.categorie}
                        </span>
                        <span>{media.duree} min</span>
                      </div>
                    </div>

                    <div
                      className={clsx(
                        "w-2.5 h-2.5 rounded-full mt-1 sm:mt-0",
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
