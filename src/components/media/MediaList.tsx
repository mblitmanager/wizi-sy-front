import { Media } from "@/types/media";
import clsx from "clsx";
import { PlayCircle, FileText, ImageIcon, Music, Video, ChevronDown, Info } from "lucide-react";
import { useState } from "react";

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

  const [expandedType, setExpandedType] = useState<string | null>(null);
  const [showDescription, setShowDescription] = useState(false);

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

  // Affiche la description si aucune playlist n'est dépliée
  const shouldShowDescription = !expandedType && selectedMedia && showDescription;

  return (
    <div className="mb-4 sm:mb-6 p-2 sm:p-4 space-y-4 sm:space-y-6">
      {/* Description du média sélectionné, façon YouTube mobile */}
      {selectedMedia && (
        <div className="mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-gray-800 truncate flex-1">
              {selectedMedia.titre}
            </h3>
            <button
              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
              onClick={() => setShowDescription((v) => !v)}
              aria-label={shouldShowDescription ? "Masquer la description" : "Afficher la description"}
            >
              <Info className={clsx("w-5 h-5", shouldShowDescription ? "text-blue-600" : "text-gray-500")} />
            </button>
          </div>
          {shouldShowDescription && (
            <div className="mt-2 text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
              <div dangerouslySetInnerHTML={{ __html: selectedMedia.description }} />
              <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-gray-500">
                <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                  {selectedMedia.categorie}
                </span>
                <span>{selectedMedia.duree} min</span>
              </div>
            </div>
          )}
        </div>
      )}

      {Object.entries(grouped).map(([type, mediaGroup]) => {
        const Icon = typeIcons[type as keyof typeof typeIcons];
        const label = typeLabels[type as keyof typeof typeLabels];
        const isExpanded = expandedType === type;
        return (
          <div key={type} className="w-full">
            <div
              className="flex items-center justify-between cursor-pointer px-2 py-2 rounded-lg bg-gray-100 mb-2"
              onClick={() => setExpandedType(isExpanded ? null : type)}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-semibold text-gray-700">{label}</span>
                <span className="text-xs px-2 py-1 bg-gray-200 rounded-full text-gray-600">{mediaGroup.length}</span>
              </div>
              <ChevronDown className={clsx("w-4 h-4 text-gray-400 transition-transform", isExpanded ? "rotate-180" : "")} />
            </div>
            {isExpanded && (
              <div className="space-y-2 sm:space-y-3">
                {mediaGroup.map((media) => {
                  const MediaIcon = typeIcons[media.type as keyof typeof typeIcons];
                  return (
                    <div
                      key={media.id}
                      onClick={() => {
                        onSelect(media);
                        setShowDescription(false); // cacher la description quand on sélectionne un autre média
                      }}
                      className={clsx(
                        "flex items-start gap-3 p-3 rounded-2xl shadow-sm transition-all cursor-pointer border sm:items-center",
                        selectedMedia?.id === media.id
                          ? "bg-blue-50 border-blue-200"
                          : "bg-white hover:bg-gray-50 border-gray-200"
                      )}
                    >
                      <div className="shrink-0 w-9 h-9 bg-yellow-100 rounded-full flex items-center justify-center">
                        <MediaIcon className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">{media.titre}</h3>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">{media.categorie}</span>
                          <span className="text-gray-500">{media.duree} min</span>
                        </div>
                      </div>
                      <div className={clsx("w-2.5 h-2.5 rounded-full mt-1 sm:mt-0", selectedMedia?.id === media.id ? "bg-blue-500" : "bg-gray-300")} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
