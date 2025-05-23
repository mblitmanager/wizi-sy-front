import { Media } from "@/types/media";
import clsx from "clsx";
import {
  PlayCircle,
  FileText,
  ImageIcon,
  Music,
  Video,
  ChevronDown,
} from "lucide-react";
import { useMemo, useState } from "react";

// MediaList.tsx
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

const typeColors: Record<"video" | "document" | "image" | "audio", string> = {
  video: "text-red-500",
  audio: "text-purple-500",
  image: "text-green-500",
  document: "text-yellow-500",
};

export default function MediaList({ medias, selectedMedia, onSelect }: Props) {
  const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>({
    video: true,
    audio: true,
    image: true,
    document: true,
  });

  const grouped = useMemo(() => {
    return medias
      .filter((m) => ["video", "audio", "image", "document"].includes(m.type))
      .reduce((acc, media) => {
        const type = media.type as keyof typeof typeLabels;
        acc[type] = acc[type] || [];
        acc[type].push(media);
        return acc;
      }, {} as Record<keyof typeof typeLabels, Media[]>);
  }, [medias]);

  const toggleType = (type: string) => {
    setExpandedTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <div className="space-y-6 p-4">
      {Object.entries(grouped).map(([type, mediaGroup]) => {
        const Icon = typeIcons[type as keyof typeof typeIcons];
        const label = typeLabels[type as keyof typeof typeLabels];
        const color = typeColors[type as keyof typeof typeColors];

        return (
          <div
            key={type}
            className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
            <div
              className="flex justify-between items-center cursor-pointer p-3 hover:bg-gray-50 transition-colors"
              onClick={() => toggleType(type)}>
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${color}`} />
                <h2 className="text-sm font-semibold text-gray-800">{label}</h2>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                  {mediaGroup.length}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  expandedTypes[type] ? "rotate-180" : ""
                }`}
              />
            </div>

            {expandedTypes[type] && (
              <ul className="divide-y divide-gray-100">
                {mediaGroup.map((media) => (
                  <li
                    key={media.id}
                    onClick={() => onSelect(media)}
                    className={`p-3 transition-colors cursor-pointer flex items-center gap-3 ${
                      selectedMedia?.id === media.id
                        ? "bg-blue-50"
                        : "hover:bg-gray-50"
                    }`}>
                    <span
                      className={`flex-shrink-0 w-2 h-2 rounded-full ${
                        selectedMedia?.id === media.id
                          ? "bg-blue-500"
                          : "bg-gray-300"
                      }`}></span>
                    <span
                      className={`truncate text-sm flex-1 ${
                        selectedMedia?.id === media.id
                          ? "text-blue-600 font-medium"
                          : "text-gray-700"
                      }`}>
                      {media.titre}
                    </span>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {media.duree} min
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
